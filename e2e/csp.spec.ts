import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Regression test for the production Content-Security-Policy.
 *
 * A wrong CSP breaks the deployed site completely while every build, unit
 * test and other e2e test still passes — nothing else in this repo serves the
 * app with the production headers. The first version of this policy used
 * `script-src 'self'`, which blocks the inline hydration scripts a Next.js
 * static export emits: the page rendered, then nothing worked.
 *
 * So this parses the real policy out of the nginx config and serves the real
 * build behind it.
 */

const CSP_PORT = 3210;
const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};

async function readPolicy(): Promise<string> {
  const conf = await readFile("deploy/nginx-wahealth.conf.example", "utf8");
  const match = conf.match(
    /add_header Content-Security-Policy "([\s\S]*?)" always;/,
  );
  if (!match?.[1]) throw new Error("No CSP found in the nginx config");
  return match[1].replace(/\\\n/g, "").replace(/\s+/g, " ").trim();
}

test("the production CSP does not break the app", async ({ browser }) => {
  const policy = await readPolicy();

  const server = http.createServer(async (req, res) => {
    let path = decodeURIComponent((req.url ?? "/").split("?")[0]!);
    if (path.endsWith("/")) path += "index.html";
    try {
      const body = await readFile(join("out", path));
      res.setHeader("Content-Security-Policy", policy);
      res.setHeader(
        "Content-Type",
        CONTENT_TYPES[extname(path)] ?? "application/octet-stream",
      );
      res.end(body);
    } catch {
      res.statusCode = 404;
      res.end("not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(CSP_PORT, resolve));

  try {
    const page = await browser.newPage();
    const violations: string[] = [];
    page.on("console", (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text())) {
        violations.push(message.text().slice(0, 200));
      }
    });

    await page.goto(`http://127.0.0.1:${CSP_PORT}/`, {
      waitUntil: "domcontentloaded",
    });

    // Hydration has to survive the policy, or the interactive UI never appears.
    await expect(page.getByText(/of \d+ facilities/)).toBeVisible();
    // And MapLibre has to be able to boot its canvas.
    await expect(page.locator("canvas.maplibregl-canvas")).toHaveCount(1, {
      timeout: 20_000,
    });

    expect(violations, `CSP violations:\n${violations.join("\n")}`).toEqual([]);
    await page.close();
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

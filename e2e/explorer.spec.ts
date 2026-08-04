import { expect, test } from "@playwright/test";

test.describe("hospital explorer", () => {
  test("renders the directory in the static HTML, before any JS runs", async ({
    request,
  }) => {
    // Guards the SEO / no-JavaScript path: the previous version fetched and
    // parsed CSV client-side, so the shipped HTML contained no hospitals.
    const html = await (await request.get("/")).text();
    expect(html).toContain("Astria Sunnyside Hospital and Clinics");
    expect(html).toContain("Tubal ligations");
  });

  test("filters the list and puts the filter in the URL", async ({ page }) => {
    await page.goto("/");

    const count = page.getByText(/of \d+ facilities/);
    await expect(count).toBeVisible();
    const before = await count.textContent();

    await page.getByRole("button", { name: /Filter by service/ }).click();
    await page.getByRole("checkbox", { name: "Surgical abortion" }).check();

    await expect(page).toHaveURL(/services=surgical-abortion/);
    await expect(count).not.toHaveText(before ?? "");
  });

  test("search narrows results and survives a reload", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search by hospital or city").fill("Yakima");

    await expect(page).toHaveURL(/q=Yakima/);
    const articles = page.locator("article");
    await expect(articles.first()).toContainText(/Yakima/i);

    await page.reload();
    await expect(page.getByLabel("Search by hospital or city")).toHaveValue(
      "Yakima",
    );
  });

  test("switches program and resets service filters", async ({ page }) => {
    await page.goto("/?services=surgical-abortion");

    await page.getByRole("tab", { name: "End of life" }).click();

    await expect(page).toHaveURL(/program=endOfLife/);
    await expect(page).not.toHaveURL(/services=/);
    await expect(
      page.getByRole("tab", { name: "End of life" }),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("expands a facility from the keyboard", async ({ page }) => {
    await page.goto("/");

    const first = page.locator("article h3 button").first();
    await first.focus();
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "true");
  });

  test("shows an empty state instead of a blank list", async ({ page }) => {
    await page.goto("/?q=zzzznotahospital");
    await expect(
      page.getByText(/No facilities match these filters/),
    ).toBeVisible();
  });
});

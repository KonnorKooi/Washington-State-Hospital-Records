import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build. The hospital data is baked in at build time by
  // scripts/build-data.ts, so there is nothing to render on a server —
  // this emits out/ for the nginx deploy.
  output: "export",
  // next/image optimization needs a server; static export has none.
  images: { unoptimized: true },
  // Emit /foo/index.html instead of /foo.html so nginx can serve the tree
  // with a plain `try_files $uri $uri/ =404`.
  trailingSlash: true,
};

export default nextConfig;

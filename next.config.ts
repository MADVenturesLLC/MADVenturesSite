import type { NextConfig } from "next";

/** Static export for Cloudflare Pages. Redirects are copied from public/_redirects;
 * verify their HTTP behavior on the release preview before production. */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root to this repository. Without it, Turbopack walks up
  // and picks up an unrelated pnpm-workspace.yaml outside the repo.
  turbopack: { root: __dirname },
};

export default nextConfig;

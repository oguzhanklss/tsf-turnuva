import path from 'node:path';

import type { NextConfig } from 'next';

/**
 * The portal builds to static HTML (`out/`), so the demo can be served from
 * GitHub Pages or any file host. NEXT_PUBLIC_BASE_PATH ("/tsf-turnuva" on
 * a project page) is read at build time and prefixed to every route and asset.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  // Static hosts serve `turnuvalar/index.html`, so every route ends with a slash.
  trailingSlash: true,
  reactStrictMode: true,
  // Pin the workspace root so the bundler does not pick a lockfile higher up.
  turbopack: { root: path.resolve(process.cwd(), '../..') },
  // The design system styles plain <img> elements; the optimizer is not used.
  images: { unoptimized: true },
};

export default nextConfig;

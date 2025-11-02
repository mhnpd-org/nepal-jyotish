import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: {
    // Prevent automatic sitemap generation conflict when using next-sitemap
    // (If future versions introduce auto sitemap, this flag can avoid collision.)
  },
  // We will generate sitemap via next-sitemap postbuild; exclude during Next build
  // by adding a rewrite to ignore requests to /sitemap.xml in dev/export phase if needed.
  async redirects() {
    return [];
  },
};

export default nextConfig;

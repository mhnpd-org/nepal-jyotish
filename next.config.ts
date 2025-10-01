import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export so site can be fully hosted on a CDN like Cloudflare
  output: 'export',
  // (Optional) If using dynamic routes with no data fetching we can pre-render them.
  // Images: Next/Image in export mode requires either remotePatterns or unoptimized
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

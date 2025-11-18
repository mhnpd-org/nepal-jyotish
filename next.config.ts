import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/blogs/np',
        permanent: true,
      },
      {
        source: '/blogs/:slug',
        destination: '/blogs/np/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

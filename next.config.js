/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.saleor.cloud',
      },
      {
        protocol: 'https',
        hostname: 'demo.saleor.io',
      },
      {
        protocol: 'https',
        hostname: 'prod.demo.saleor.cloud',
      },
    ],
  },
};

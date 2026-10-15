import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from your own domain and any future CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimise local images in public/assets/
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
    ],
  },

  // Expose non-secret env vars to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  },

  // Strict mode catches potential issues early
  reactStrictMode: true,

  // Output — set to 'standalone' for Docker / server deployments
  // output: 'standalone',
};

export default nextConfig;

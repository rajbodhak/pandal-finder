import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fra.cloud.appwrite.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
  allowedDevOrigins: ['192.168.0.102'],
};

export default nextConfig;
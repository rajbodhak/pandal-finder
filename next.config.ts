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

  // Allow cross-origin requests for both local network and ngrok
  allowedDevOrigins: [
    // Local network access
    '192.168.0.104',
    '192.168.0.103',
    '192.168.0.*',
    'localhost',
    '127.0.0.1',

    // ngrok domains
    '*.ngrok.io',
    '*.ngrok-free.app',
    '*.ngrok.app',
  ],
} as any;

export default nextConfig;
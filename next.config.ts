import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/ws',
        destination: 'http://localhost:3001/ws' // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;

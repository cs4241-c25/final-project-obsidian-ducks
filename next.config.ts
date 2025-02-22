import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'fly.storage.tigris.dev',
                    port: '',
                    pathname: '/wpi-buys1/**',
                    search: '',
                },
            ],
        },
};

export default nextConfig;

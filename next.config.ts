import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
        experimental: {
            serverActions: {
                bodySizeLimit: "3mb"
            }
        },
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

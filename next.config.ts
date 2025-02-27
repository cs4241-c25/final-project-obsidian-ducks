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
    experimental: {
        serverActions: {
            bodySizeLimit: "3mb"
        }
    },
};

export default nextConfig;

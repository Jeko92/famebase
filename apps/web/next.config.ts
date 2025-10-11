import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    transpilePackages: ['database'],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },

    // Optimize middleware bundle size for Vercel Edge
    experimental: {
        serverMinification: true,
    },

    // Ensure Prisma binaries are included
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('@prisma/client');
        }
        return config;
    },
};

export default nextConfig;
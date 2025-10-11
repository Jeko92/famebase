import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

export default nextConfig;
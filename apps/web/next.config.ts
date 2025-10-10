import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    transpilePackages: ['database'],
    experimental: {
        // Enable Turbopack for builds (beta)
        turbo: {
            // Add any turbopack-specific config here
        }
    },
};

export default nextConfig;
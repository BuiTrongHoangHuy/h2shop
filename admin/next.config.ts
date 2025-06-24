import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'i.etsystatic.com',
            port: '',
            pathname: '/**'
        },
            {
            protocol: 'https',
            hostname: 'h2shop-storage-images.s3.ap-southeast-1.amazonaws.com',
            port: '',
            pathname: '/**'
            }],
    },
};

export default nextConfig;

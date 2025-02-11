import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // or whatever domain you're using
        port: '',
        pathname: '/**',
      },
    ], 
  },
};

export default nextConfig;

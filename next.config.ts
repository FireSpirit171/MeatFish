import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.190.224:8000/:path*/',
      },
    ];
  },
};

export default nextConfig;
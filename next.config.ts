import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/netzteil-rechner/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: '/listings',
        destination: '/',
        permanent: true, // This makes it a permanent redirect
      },
    ];
  },
};
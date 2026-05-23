import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Keep file tracing rooted at this project to avoid Windows junction scans
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Avoid bundling Prisma internals on Windows build step
      config.externals.push("@prisma/client", "prisma");
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/listings",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

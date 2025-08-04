import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
      {
        hostname: "3rzhxgaojq.ufs.sh",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;

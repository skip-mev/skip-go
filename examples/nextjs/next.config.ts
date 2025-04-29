import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // temporary, REMOVE BEFORE MERGING
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

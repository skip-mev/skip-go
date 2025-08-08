import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "../../packages/widget/src/components"),
      "@/utils": path.resolve(__dirname, "../../packages/widget/src/utils"),
      "@/hooks": path.resolve(__dirname, "../../packages/widget/src/hooks"),
      "@/modals": path.resolve(__dirname, "../../packages/widget/src/modals"),
      "@/fonts": path.resolve(__dirname, "../../packages/widget/src/fonts"),
      "@/widget": path.resolve(__dirname, "../../packages/widget/src/widget"),
      "@/icons": path.resolve(__dirname, "../../packages/widget/src/icons"),
      "@/state": path.resolve(__dirname, "../../packages/widget/src/state"),
      "@/constants": path.resolve(__dirname, "../../packages/widget/src/constants"),
      "@/pages": path.resolve(__dirname, "../../packages/widget/src/pages"),
      "@/providers": path.resolve(__dirname, "../../packages/widget/src/providers"),
    };

    // Handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;

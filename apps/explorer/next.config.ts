import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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
    };

    // Handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    });

    // Handle polyfill conflicts by using Next.js's built-in implementations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Disable polyfills that conflict with Next.js
      "url": false,
      "querystring": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "process": false,
      "util": false,
      "assert": false,
      "constants": false,
      "events": false,
      "path": false,
      "os": false,
      "fs": false,
      "http": false,
      "https": false,
      "zlib": false,
      "tty": false,
      "domain": false,
      "punycode": false,
      "string_decoder": false,
      "timers": false,
      "vm": false,
      "worker_threads": false,
    };

    return config;
  },
};

export default nextConfig;

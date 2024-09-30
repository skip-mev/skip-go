/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  }
};

module.exports = nextConfig;

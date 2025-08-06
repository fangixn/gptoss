/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Server Actions are not supported with static export
  // experimental: {
  //   serverActions: true,
  // },
};

module.exports = nextConfig;

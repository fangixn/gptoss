/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For static export (GitHub Pages)
  output: 'export',
  trailingSlash: true,
  images: { 
    unoptimized: true // Required for static export
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false // Enable Next.js Image Optimization for Vercel
  },
  // For static export (GitHub Pages), uncomment the following lines:
  // output: 'export',
  // trailingSlash: true,
  // images: { unoptimized: true },
};

module.exports = nextConfig;
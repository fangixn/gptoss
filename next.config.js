/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 根据环境决定是否使用静态导出
  ...(process.env.DEPLOY_TARGET === 'static' ? {
    // For static export (GitHub Pages)
    output: 'export',
    trailingSlash: true,
    images: { 
      unoptimized: true // Required for static export
    },
  } : {
    // For development or server deployment
    images: {
      unoptimized: false
    }
  }),
};

module.exports = nextConfig;
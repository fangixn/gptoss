/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

if (isGitHubPages) {
  // GitHub repository is in format: owner/repo-name
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: assetPrefix,
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

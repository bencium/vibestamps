/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better compatibility
  trailingSlash: true,
  // Ensure proper asset prefix for static hosting
  assetPrefix: '',
  // Use relative paths for assets
  basePath: '',
};

module.exports = nextConfig;

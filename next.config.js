/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better compatibility
  trailingSlash: true,
};

module.exports = nextConfig;

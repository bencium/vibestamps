/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization (Vercel supports this)
  images: {
    domains: [],
  },
  // Modern configuration for Vercel
  swcMinify: true,
};

module.exports = nextConfig;

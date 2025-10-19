/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;

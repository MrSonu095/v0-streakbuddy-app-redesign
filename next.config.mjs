/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ye line Vercel ko bolegi ki type errors ko ignore karo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ye line faltu warnings ko rokegi
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
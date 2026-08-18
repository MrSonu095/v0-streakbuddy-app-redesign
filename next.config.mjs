/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.github.dev',
        'literate-tribble-qv9qvvxp6r9q34j5p-3000.app.github.dev'
      ]
    }
  }
};

export default nextConfig;
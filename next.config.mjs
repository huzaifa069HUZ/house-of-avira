/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  serverActions: {
    bodySizeLimit: '20mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['firebase-admin', 'nodemailer', 'razorpay', 'cloudinary'],
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'gsap',
      '@gsap/react',
      'fuse.js',
      'country-state-city',
    ],
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['jspdf', 'fflate'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: [
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    '192.168.1.106',
    '192.168.1.106:3000',
    '192.168.1.109',
    '192.168.1.109:3000',
  ],
  async redirects() {
    return [
      {
        source: '/trips',
        destination: '/upcoming-tours',
        permanent: true,
      },
      {
        source: '/itinerary',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

export default nextConfig

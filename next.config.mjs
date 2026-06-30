/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.109', '*'],
  async redirects() {
    return [
      {
        source: '/trips',
        destination: '/upcoming-tours',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

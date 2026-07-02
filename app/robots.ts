import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/login',
        '/booking/package',
      ],
    },
    sitemap: 'https://wanderphilia.com/sitemap.xml',
  }
}

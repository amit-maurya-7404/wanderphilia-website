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
        '/sheet-itinerary',
        '/sheet-itinerary/',
        '/itinerary',
        '/itinerary/',
        '/manual-itinerary',
        '/manual-itinerary/',
        '/itinerary-custom',
        '/itinerary-custom/',
        '/itinerary-test',
        '/itinerary-test/',
      ],
    },
    sitemap: 'https://wanderphilia.com/sitemap.xml',
  }
}

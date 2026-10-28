import { MetadataRoute } from 'next'
import { trips, blogs } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'

const BASE_URL = 'https://wanderphilia.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/india-trips',
    '/international-trips',
    '/upcoming-tours',
    '/christmas-new-year',
    '/honeymoon',
    '/blog',
    '/careers',
    '/why-us',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/payment',
    '/trips/bali',
    '/trips/bhutan',
    '/trips/himachal',
    '/trips/kashmir',
    '/trips/leh-ladakh',
    '/trips/sikkim',
    '/trips/singapore',
    '/trips/spiti',
    '/trips/thailand',
    '/trips/vietnam',
  ]

  const routeEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }))

  const tripEntries = trips.map((trip) => ({
    url: `${BASE_URL}/trips/${trip.slug}`,
    lastModified: new Date(),
  }))

  const blogEntries = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
  }))

  const categoryEntries = getAllCategories().map((category) => ({
    url: `${BASE_URL}/trips/${category.id}`,
    lastModified: new Date(),
  }))

  // Ensure internal team routes (sheet-itinerary, admin) and private client itinerary links are NEVER in sitemap
  return [...routeEntries, ...tripEntries, ...blogEntries, ...categoryEntries].filter(
    (e) =>
      !e.url.includes('/sheet-itinerary') &&
      !e.url.includes('/itinerary') &&
      !e.url.includes('/admin')
  )
}

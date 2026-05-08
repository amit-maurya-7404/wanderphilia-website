import { MetadataRoute } from 'next'
import { trips, blogs } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'

const BASE_URL = 'https://wanderphilia.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/trips',
    '/india-trips',
    '/international-trips',
    '/honeymoon',
    '/blog',
    '/careers',
    '/upcoming-tours',
    '/why-us',
    '/booking/package',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/payment',
    '/login',
    '/trips/bhutan',
    '/trips/himachal',
    '/trips/iceland',
    '/trips/indonesia',
    '/trips/japan',
    '/trips/kashmir',
    '/trips/leh-ladakh',
    '/trips/meghalaya',
    '/trips/nepal',
    '/trips/peru',
    '/trips/spiti',
    '/trips/switzerland',
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
    url: `${BASE_URL}/category/${category.id}`,
    lastModified: new Date(),
  }))

  return [...routeEntries, ...tripEntries, ...blogEntries, ...categoryEntries]
}

import { trips } from './data'

export interface Category {
  id: string
  name: string
  image: string
}

// Get all categories with their images
export const getAllCategories = () => {
  const categoryImageMap: Record<string, string> = {
    Bhutan: '/images/Bhutan_cat.jpg',
    Nepal: '/images/nepal-dest.jpg',
    Indonesia: '/images/indonesia-dest.jpg',
    Switzerland: '/images/switzerland-dest.jpg',
    Peru: '/images/peru-dest.jpg',
    Japan: '/images/japan.jpg',
    'Leh Ladakh': '/images/leh-ladakh.jpg',
    Spiti: '/images/spiti-valley.jpg',
    Kashmir: '/images/kashmir.jpg',
    Meghalaya: '/images/meghalaya.jpg',
    Himachal: '/images/himachal.jpg'
  }

  const cats = Array.from(new Set(trips.map(t => t.category))).sort()
  return cats.map((cat) => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat,
    image: categoryImageMap[cat] || `/images/${cat.toLowerCase().replace(/\s+/g, '-')}.jpg`
  }))
}

// Get categories by trip type (India or International)
export const getCategoriesByType = (type: 'India' | 'International') => {
  return getAllCategories().filter(cat => {
    return trips.some(trip => trip.category === cat.name && trip.tripType === type)
  })
}
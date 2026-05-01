import { trips } from './data'

export interface Category {
  id: string
  name: string
  image: string
}

// Get all categories with their images
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

const normalizeCategoryId = (category: string) =>
  category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')

const formatCategoryName = (category: string) =>
  category
    .trim()
    .replace(/-/g, ' ')
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const getAllCategories = () => {
  const uniqueCategories = new Map<string, string>()

  trips
    .map((t) => t.category.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach((rawCategory) => {
      const id = normalizeCategoryId(rawCategory)
      if (!uniqueCategories.has(id)) {
        uniqueCategories.set(id, formatCategoryName(rawCategory))
      }
    })

  return Array.from(uniqueCategories.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name]) => ({
      id,
      name,
      image: categoryImageMap[name] || `/images/${id}.jpg`
    }))
}

// Get categories by trip type (India or International)
export const getCategoriesByType = (type: 'India' | 'International') => {
  return getAllCategories().filter(cat => {
    return trips.some(trip => trip.category === cat.name && trip.tripType === type)
  })
}
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
  Ladakh: '/images/leh-ladakh.jpg',
  Spiti: '/images/spiti-valley.jpg',
  Kashmir: '/images/kashmir.jpg',
  Meghalaya: '/images/meghalaya.jpg',
  Himachal: '/images/himachal.jpg',
  Singapore: '/images/singapore.png',
  Sikkim: '/images/sikkim.png',
  Thailand: '/images/thailand.jpg'
}

const categoryOrder: string[] = [
  'Ladakh',
  'Spiti',
  'Bhutan',
  'Singapore',
  'Switzerland',
  'Peru',
  'Iceland',
  'Japan',
  'Nepal',
  'Indonesia',
  'Kashmir',
  'Himachal',
  'Sikkim',
  'Meghalaya',
  'Thailand'
]

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

const displayCategoryName = (category: string) => {
  const formatted = formatCategoryName(category)
  if (formatted.toLowerCase() === 'leh ladakh') {
    return 'Ladakh'
  }
  return formatted
}

export const getAllCategories = () => {
  const uniqueCategories = new Map<string, string>()

  trips
    .map((t) => t.category.trim())
    .forEach((rawCategory) => {
      const id = normalizeCategoryId(rawCategory)
      if (!uniqueCategories.has(id)) {
        uniqueCategories.set(id, displayCategoryName(rawCategory))
      }
    })

  return Array.from(uniqueCategories.entries())
    .map(([id, name]) => ({
      id,
      name,
      image: categoryImageMap[name] || `/images/${id}.jpg`
    }))
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.name)
      const bIndex = categoryOrder.indexOf(b.name)

      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      }

      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
}

// Get categories by trip type (India or International)
export const getCategoriesByType = (type: 'India' | 'International') => {
  return getAllCategories().filter(cat => {
    return trips.some(
      trip => normalizeCategoryId(trip.category) === cat.id && trip.tripType === type
    )
  })
}
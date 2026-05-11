'use client'

import { useEffect, useState } from 'react'
import { GalleryCarousel } from '@/components/gallery-carousel'

interface GalleryImage {
  _id: string
  image: string
  category: string
  alt?: string
  createdAt: string
}

interface TripGallerySectionProps {
  categoryId: string
  categoryName: string
}

export function TripGallerySection({ categoryId, categoryName }: TripGallerySectionProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Unable to load gallery')
        }
        const data = await response.json()
        // Filter images for this category
        const filtered = data.filter((img: any) => img.category === categoryId)
        // If no images found for this category, maybe show some generic ones or nothing?
        // For now, let's show filtered if any, else nothing or fallback to all?
        // User said "category ke hisab se add krna hai", so we should show only those.
        setImages(filtered)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [categoryId])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            📸 Visual Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            {categoryName} Gallery
          </h2>
          <div className="py-12">
            <p className="text-gray-500 animate-pulse">Loading gallery images...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || images.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            📸 Visual Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {categoryName} Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore breathtaking moments from {categoryName} captured by our travelers.
          </p>
        </div>

        <GalleryCarousel images={images} />
      </div>
    </section>
  )
}

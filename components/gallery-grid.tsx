'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryGridImage {
  _id: string
  image: string
  category: string
  alt?: string
  title?: string
  createdAt: string
}

interface GalleryGridProps {
  images: GalleryGridImage[]
  showFilter?: boolean
}

export function GalleryGrid({ images, showFilter = true }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryGridImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images

  const categories = ['mountains', 'stays', 'trips']

  const handleNext = () => {
    const index = filteredImages.findIndex((img) => img._id === selectedImage?._id)
    if (index < filteredImages.length - 1) {
      setSelectedImage(filteredImages[index + 1])
      setCurrentIndex(index + 1)
    }
  }

  const handlePrev = () => {
    const index = filteredImages.findIndex((img) => img._id === selectedImage?._id)
    if (index > 0) {
      setSelectedImage(filteredImages[index - 1])
      setCurrentIndex(index - 1)
    }
  }

  return (
    <>
      {/* Filter Buttons */}
      {showFilter && (
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Standard Uniform Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image) => (
          <div
            key={image._id}
            className="relative overflow-hidden rounded-2xl cursor-pointer group h-80"
            onClick={() => {
              setSelectedImage(image)
              setCurrentIndex(filteredImages.findIndex((img) => img._id === image._id))
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.image}
                alt={image.alt ?? image.title ?? 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage.image}
              alt={selectedImage.alt ?? selectedImage.title ?? 'Gallery image'}
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl"
            />

            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredImages.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-white/80 text-sm px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  {currentIndex + 1} / {filteredImages.length}
                </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

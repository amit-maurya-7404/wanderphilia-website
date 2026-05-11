'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'

interface GalleryImage {
  _id: string
  image: string
  title?: string
  caption?: string
  category: string
  alt?: string
  createdAt: string
}

interface GalleryCarouselProps {
  images: GalleryImage[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add('lightbox-open')
    } else {
      document.body.classList.remove('lightbox-open')
    }
    return () => {
      document.body.classList.remove('lightbox-open')
    }
  }, [selectedImage])

  return (
    <>
      <div className="relative group px-4 md:px-0 overflow-hidden">
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          effect={'coverflow'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          className="!overflow-visible"
        >
          {images.map((image) => (
            <SwiperSlide key={image._id} className="transition-all duration-300">
              <div
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group/item shadow-xl"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.image}
                  alt={image.alt ?? 'Gallery image'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-primary shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-1/4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-primary shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-1/4">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 flex items-center justify-center transition-all border border-white/20 group"
            title="Close"
          >
            <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div
            className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image content
          >
            <div className="relative w-full h-[80vh] md:h-[90vh]">
              <Image
                src={selectedImage.image}
                alt={selectedImage.alt ?? selectedImage.title ?? 'Gallery image'}
                fill
                sizes="100vw"
                className="object-contain rounded-lg drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import * as React from 'react'
import Image from 'next/image'
import type { TripMediaItem } from '@/lib/data'

interface TripHeroCarouselProps {
  media?: TripMediaItem[]
  images?: string[]
  className?: string
}

export function TripHeroCarousel({ media, images, className }: TripHeroCarouselProps) {
  const normalizedMedia: TripMediaItem[] = React.useMemo(() => {
    if (media && Array.isArray(media) && media.length > 0) {
      return media
    }
    if (images && Array.isArray(images) && images.length > 0) {
      return images.map((src, i) => ({ type: 'image' as const, src, alt: `Hero image ${i + 1}` }))
    }
    return [{ type: 'image' as const, src: '/images/about_hero4.jpg', alt: 'Hero' }]
  }, [media, images])

  const [activeIndex, setActiveIndex] = React.useState(0)
  const hasMultiple = normalizedMedia.length > 1

  React.useEffect(() => {
    if (!hasMultiple) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedMedia.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [hasMultiple, normalizedMedia.length])

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className || ''}`}>

      {normalizedMedia.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {item.type === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={item.src}
              poster={item.poster}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          )}
        </div>
      ))}

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {normalizedMedia.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={
              index === activeIndex
                ? 'h-2.5 w-8 rounded-full bg-white'
                : 'h-2.5 w-2.5 rounded-full bg-white/50'
            }
          />
        ))}
      </div>
    </div>
  )
}
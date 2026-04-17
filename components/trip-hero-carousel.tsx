'use client'

import * as React from 'react'
import Image from 'next/image'
import type { TripMediaItem } from '@/lib/data'

interface TripHeroCarouselProps {
  media: TripMediaItem[]
}

export function TripHeroCarousel({ media }: TripHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const hasMultiple = media.length > 1

  React.useEffect(() => {
    if (!hasMultiple) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [hasMultiple, media.length])

  const activeItem = media[activeIndex]

  return (
    <div className="relative h-[40vh] md:h-[70vh]  overflow-hidden bg-transparent">
      {media.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className={
            index === activeIndex
              ? 'absolute inset-0 backdrop-opacity-100 transition-opacity duration-700'
              : 'absolute inset-0 opacity-0 transition-opacity duration-700'
          }
          aria-hidden={index !== activeIndex}
        >
          {item.type === 'video' ? (
            <video
              className="h-full w-full object-cover"
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
              className="object-cover"
              priority={index === 0}
            />
          )}
        </div>
      ))}

      <div className="absolute inset-0  pointer-events-none" />
      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
        {media.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={
              index === activeIndex
                ? 'h-2.5 w-8 rounded-full bg-white shadow'
                : 'h-2.5 w-2.5 rounded-full bg-white/50'
            }
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

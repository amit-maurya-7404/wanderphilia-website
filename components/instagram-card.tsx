'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play } from 'lucide-react'

interface InstagramCardProps {
  thumbnail: string
  type: 'post' | 'reel'
  caption?: string
  url: string
}

export function InstagramCard({ thumbnail, type, caption }: InstagramCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={thumbnail}
        alt={caption || type}
        fill
        className="object-cover"
      />

      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-8 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {type === 'reel' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        <div className="text-center px-4">
          <p className="text-white text-sm line-clamp-2">{caption || 'Travel reel'}</p>
        </div>
      </div>

      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-900">
        {type === 'reel' ? '🎬 Reel' : '📸 Post'}
      </div>
    </div>
  )
}

'use client'

import { Star } from 'lucide-react'

interface ReviewCardProps {
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial'
  rating: number
  comment: string
  createdAt: string
}

export function ReviewCard({ name, platform, rating, comment, createdAt }: ReviewCardProps) {
  const platformColors = {
    Google: 'bg-blue-50 text-blue-700',
    Facebook: 'bg-blue-100 text-blue-800',
    Justdial: 'bg-orange-50 text-orange-700',
  }

  const platformEmoji = {
    Google: '🔍',
    Facebook: '👥',
    Justdial: '⭐',
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-500 mt-1 truncate">{platform}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${platformColors[platform]}`}>
          {platformEmoji[platform]} {platform}
        </span>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>

      <p className="text-gray-700 text-sm mb-4 grow leading-relaxed">{comment}</p>

      <p className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </div>
  )
}

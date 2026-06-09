'use client'

import { useState } from 'react'
import { Star, Compass } from 'lucide-react'

interface ReviewCardProps {
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial' | 'Wanderphilia'
  rating: number
  comment: string
  createdAt: string
  profilePhotoUrl?: string
  relativeTime?: string
  images?: string[]
}

export function ReviewCard({
  name,
  platform,
  rating,
  comment,
  createdAt,
  profilePhotoUrl,
  relativeTime,
  images,
}: ReviewCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const platformColors = {
    Google: 'bg-red-50 text-red-600 border border-red-100',
    Facebook: 'bg-blue-50 text-blue-600 border border-blue-100',
    Justdial: 'bg-orange-50 text-orange-600 border border-orange-100',
    Wanderphilia: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  }

  const platformIcons = {
    Google: (
      <svg className="w-3 h-3 mr-1 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.472 0-6.27-2.798-6.27-6.27s2.798-6.27 6.27-6.27c1.628 0 3.097.618 4.218 1.631l3.197-3.197C19.345 2.502 16.035 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11 0-.746-.066-1.32-.2-1.95H12.24z" />
      </svg>
    ),
    Facebook: (
      <svg className="w-3 h-3 mr-1 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
      </svg>
    ),
    Justdial: (
      <span className="font-extrabold text-[9px] mr-1 inline-block">JD</span>
    ),
    Wanderphilia: (
      <Compass className="w-3 h-3 mr-1 inline-block text-emerald-600" />
    ),
  }

  // Get initials for avatar fallback
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // Stable random gradient for initials
  const getAvatarGradient = (n: string) => {
    const charCodeSum = n.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const gradients = [
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-emerald-400 to-teal-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-red-500',
    ]
    return gradients[charCodeSum % gradients.length]
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col h-full group">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-4">
        {profilePhotoUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner group-hover:border-primary/30 transition-colors">
            <img
              src={profilePhotoUrl}
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center text-white text-sm font-semibold border border-white/20 shadow`}>
            {getInitials(name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-gray-900 text-base truncate group-hover:text-primary transition-colors">
            {name}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${platformColors[platform] || 'bg-gray-100 text-gray-700'}`}>
              {platformIcons[platform]}
              {platform}
            </span>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-1 mb-3.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 grow line-clamp-4 group-hover:text-gray-800 transition-colors font-medium">
        &ldquo;{comment}&rdquo;
      </p>

      {/* Review Images Grid */}
      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(imgUrl)
              }}
              className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-2xs hover:scale-105 transition duration-200 cursor-zoom-in"
            >
              <img
                src={imgUrl}
                alt={`Review photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
        <span>Verified Customer</span>
        <span>
          {relativeTime ||
            new Date(createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
        </span>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300">
            <img
              src={selectedImage}
              alt="Full size review photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10"
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition duration-200 cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { InstagramCard } from '@/components/instagram-card'
import { Instagram } from 'lucide-react'

interface ReelItem {
  _id: string
  type: 'post' | 'reel'
  url: string
  thumbnail: string
  caption?: string
  createdAt: string
}

export function InstagramSection() {
  const [posts, setPosts] = useState<ReelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/reels')
        if (!response.ok) {
          throw new Error('Failed to load reels')
        }
        const data = await response.json()
        setPosts(data.slice(0, 9))
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4 items-center gap-2 justify-center mx-auto w-fit">
              <Instagram size={16} />
              Reels
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Instagram Reels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow @wanderphilia for travel inspiration, reels, and behind-the-scenes moments.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reels...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">{error}</div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4 items-center gap-2 justify-center mx-auto w-fit">
              <Instagram size={16} />
              Reels
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Instagram Reels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow @wanderphilia for travel inspiration, reels, and behind-the-scenes moments.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No reels available yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4 items-center gap-2 justify-center mx-auto w-fit">
            <Instagram size={16} />
            Reels
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Instagram Reels
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow @wanderphilia for travel inspiration, reels, and behind-the-scenes moments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {posts.map((post) => (
            <InstagramCard key={post._id} {...post} />
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://instagram.com/wanderphilia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            <Instagram size={20} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

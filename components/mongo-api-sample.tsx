'use client'

import { useEffect, useState } from 'react'

interface GalleryItem {
  _id: string
  image: string
  category: string
  title?: string
  caption?: string
  createdAt: string
}

export function MongoApiSample() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Failed to load gallery')
        }
        const data = await response.json()
        setGallery(data)
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchGallery()
  }, [])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">API sample: /api/gallery</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {gallery.slice(0, 3).map((item) => (
            <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">{item.category}</p>
              <p className="font-semibold text-slate-900">{item.title || 'Untitled'}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-sm text-slate-500">
        <p>Use <code className="rounded bg-slate-100 px-1 py-0.5">fetch('/api/gallery')</code> or POST to <code className="rounded bg-slate-100 px-1 py-0.5">/api/gallery</code>.</p>
      </div>
    </div>
  )
}

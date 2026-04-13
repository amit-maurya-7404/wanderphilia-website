'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const initialGallery = {
  title: '',
  image: '',
  caption: '',
  category: 'mountains',
}

const initialReel = {
  caption: '',
  url: '',
  thumbnail: '',
  type: 'reel',
}

const initialReview = {
  name: '',
  review: '',
  rating: '5',
  platform: 'Google',
}

const initialBanner = {
  title: '',
  image: '',
  url: '',
  isActive: true,
}

const initialCategory = {
  name: '',
  image: '',
  url: '',
  isActive: true,
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminPage() {
  const [gallery, setGallery] = useState(initialGallery)
  const [reel, setReel] = useState(initialReel)
  const [review, setReview] = useState(initialReview)
  const [banner, setBanner] = useState(initialBanner)
  const [category, setCategory] = useState(initialCategory)
  const [status, setStatus] = useState('')
  const [counts, setCounts] = useState({ gallery: 0, reels: 0, reviews: 0, banners: 0, categories: 0 })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [categoryFile, setCategoryFile] = useState<File | null>(null)

  const collectionConfig = useMemo(
    () => [
      { key: 'gallery', title: 'Gallery Item', fields: ['title', 'image', 'caption'] },
      { key: 'reels', title: 'Reel / Post', fields: ['caption', 'url', 'thumbnail', 'type'] },
      { key: 'reviews', title: 'Review', fields: ['name', 'review', 'rating', 'location'] },
      { key: 'banners', title: 'Offer Banner', fields: ['title', 'image', 'url'] },
      { key: 'categories', title: 'Category', fields: ['name', 'image', 'url'] },
    ],
    []
  )

  const loadCounts = async () => {
    const results = await Promise.all(
      collectionConfig.map(async (collection) => {
        const response = await fetch(`/api/${collection.key}`)
        if (!response.ok) return [collection.key, 0] as const
        const data = await response.json()
        return [collection.key, Array.isArray(data) ? data.length : 0] as const
      })
    )

    setCounts(Object.fromEntries(results) as typeof counts)
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0]._id || data[0].name)
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      if (response.ok) {
        const data = await response.json()
        // Banners are managed in mobile hero, just ensuring API works
        console.log('Banners loaded:', data.length)
      }
    } catch (error) {
      console.error('Failed to load banners:', error)
    }
  }

  const loadPackages = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/trips?category=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error('Failed to load packages:', error)
    }
  }

  useEffect(() => {
    loadCounts().catch(() => {
      setCounts({ gallery: 0, reels: 0, reviews: 0, banners: 0, categories: 0 })
    })
    loadCategories()
  }, [collectionConfig])

  useEffect(() => {
    if (selectedCategory) {
      loadPackages(selectedCategory)
    }
  }, [selectedCategory])

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (collection: string, payload: Record<string, unknown>) => {
    setStatus('Saving…')
    try {
      let finalPayload = { ...payload }

      // Handle file uploads for banners and categories
      if (collection === 'banners' && bannerFile) {
        const imageUrl = await handleFileUpload(bannerFile)
        finalPayload.image = imageUrl
      }

      if (collection === 'categories' && categoryFile) {
        const imageUrl = await handleFileUpload(categoryFile)
        finalPayload.image = imageUrl
      }

      const response = await fetch(`/api/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result?.error || 'Unable to save item')
      }

      setStatus('Saved successfully.')
      if (collection === 'gallery') setGallery(initialGallery)
      if (collection === 'reels') setReel(initialReel)
      if (collection === 'reviews') setReview(initialReview)
      if (collection === 'banners') {
        setBanner(initialBanner)
        setBannerFile(null)
        loadBanners() // Reload banners after adding new one
      }
      if (collection === 'categories') {
        setCategory(initialCategory)
        setCategoryFile(null)
        loadCategories() // Reload categories after adding new one
      }
      setTimeout(() => setStatus(''), 4000)
      await loadCounts()
    } catch (error) {
      setStatus(`Save failed: ${(error as Error).message}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-4xl bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin Panel</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Manage Gallery, Instagram & Reviews</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                Add new content directly to MongoDB Atlas so the site can stay fresh with the latest travel inspiration.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Gallery</p>
                <p className="mt-4 text-3xl font-semibold">{counts.gallery}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Reels</p>
                <p className="mt-4 text-3xl font-semibold">{counts.reels}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Reviews</p>
                <p className="mt-4 text-3xl font-semibold">{counts.reviews}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Banners</p>
                <p className="mt-4 text-3xl font-semibold">{counts.banners}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Categories</p>
                <p className="mt-4 text-3xl font-semibold">{counts.categories}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Gallery Item</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={gallery.title}
                  onChange={(event) => setGallery({ ...gallery, title: event.target.value })}
                />
                <Input
                  placeholder="Image URL"
                  value={gallery.image}
                  onChange={(event) => setGallery({ ...gallery, image: event.target.value })}
                />
                <Textarea
                  placeholder="Caption"
                  value={gallery.caption}
                  onChange={(event) => setGallery({ ...gallery, caption: event.target.value })}
                />
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={gallery.category}
                  onChange={(event) => setGallery({ ...gallery, category: event.target.value })}
                >
                  <option value="mountains">Mountains</option>
                  <option value="stays">Stays</option>
                  <option value="trips">Trips</option>
                </select>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit('gallery', gallery)}
                >
                  Save Gallery Item
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Reel / Post</h2>
              <div className="space-y-4">
                <Textarea
                  placeholder="Caption"
                  value={reel.caption}
                  onChange={(event) => setReel({ ...reel, caption: event.target.value })}
                />
                <Input
                  placeholder="Video / Post URL"
                  value={reel.url}
                  onChange={(event) => setReel({ ...reel, url: event.target.value })}
                />
                <Input
                  placeholder="Thumbnail URL"
                  value={reel.thumbnail}
                  onChange={(event) => setReel({ ...reel, thumbnail: event.target.value })}
                />
                <Input
                  placeholder="Type: reel or post"
                  value={reel.type}
                  onChange={(event) => setReel({ ...reel, type: event.target.value as 'reel' | 'post' })}
                />
                <Button
                  className="w-full"
                  onClick={() => handleSubmit('reels', reel)}
                >
                  Save Reel / Post
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Review</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Guest Name"
                  value={review.name}
                  onChange={(event) => setReview({ ...review, name: event.target.value })}
                />
                <Textarea
                  placeholder="Review Text"
                  value={review.review}
                  onChange={(event) => setReview({ ...review, review: event.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Rating (1-5)"
                    value={review.rating}
                    onChange={(event) => setReview({ ...review, rating: event.target.value })}
                  />
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={review.platform}
                    onChange={(event) => setReview({ ...review, platform: event.target.value })}
                  >
                    <option value="Google">Google</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Justdial">Justdial</option>
                  </select>
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    handleSubmit('reviews', {
                      name: review.name,
                      rating: Number(review.rating),
                      platform: review.platform,
                      comment: review.review,
                    })
                  }
                >
                  Save Review
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Offer Banner</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Banner Title"
                  value={banner.title}
                  onChange={(event) => setBanner({ ...banner, title: event.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setBannerFile(event.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
                <div className="text-center text-slate-500 text-sm">OR</div>
                <Input
                  placeholder="Image URL"
                  value={banner.url}
                  onChange={(event) => setBanner({ ...banner, url: event.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="banner-active"
                    checked={banner.isActive}
                    onChange={(event) => setBanner({ ...banner, isActive: event.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="banner-active" className="text-sm text-slate-700">Active</label>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit('banners', {
                    title: banner.title,
                    image: banner.url, // Will be overridden if file is uploaded
                    isActive: banner.isActive
                  })}
                >
                  Save Banner
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Category</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={category.name}
                  onChange={(event) => setCategory({ ...category, name: event.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCategoryFile(event.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
                <div className="text-center text-slate-500 text-sm">OR</div>
                <Input
                  placeholder="Image URL"
                  value={category.url}
                  onChange={(event) => setCategory({ ...category, url: event.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="category-active"
                    checked={category.isActive}
                    onChange={(event) => setCategory({ ...category, isActive: event.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="category-active" className="text-sm text-slate-700">Active</label>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit('categories', {
                    name: category.name,
                    image: categoryFile ? '' : category.url,
                    isActive: category.isActive
                  })}
                >
                  Save Category
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm xl:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Category & Package Management</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Select Category</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id || cat.name} value={cat._id || cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {packages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-3">Related Packages ({packages.length})</h3>
                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                      {packages.map((pkg) => (
                        <div key={pkg._id || pkg.id} className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="font-medium text-slate-900">{pkg.title}</p>
                          <p className="text-sm text-slate-600">{pkg.destination} • {pkg.duration} days</p>
                          <p className="text-sm font-semibold text-primary">₹{pkg.price?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Status</p>
            <p className={classNames('mt-3 text-lg', status.startsWith('Save failed') ? 'text-rose-300' : 'text-emerald-200')}>
              {status || 'Ready to add new entries to MongoDB Atlas.'}
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Make sure your <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">MONGODB_URI</code> and optional <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">MONGODB_DB</code> are configured in <span className="font-medium">.env.local</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

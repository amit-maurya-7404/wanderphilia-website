'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Star, 
  Upload, 
  X, 
  Check, 
  MapPin, 
  User, 
  MessageSquare, 
  ArrowLeft, 
  Compass, 
  Loader2, 
  Image as ImageIcon,
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { getAllCategories } from '@/lib/trip-categories'

interface Category {
  id: string
  name: string
  image: string
}

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  errorMsg?: string
}

export default function ReviewPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  // Wizard Step State
  const [step, setStep] = useState(1)
  
  // Form State
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  
  // Execution/Status States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Validation States (touched on input blur or step submit)
  const [touched, setTouched] = useState({
    name: false,
    category: false,
    rating: false,
    comment: false,
  })

  // Load categories on client
  useEffect(() => {
    try {
      const cats = getAllCategories()
      setCategories(cats)
    } catch (e) {
      console.error('Failed to load categories', e)
    }
  }, [])

  // Filter categories by search query
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Rating feedback labels
  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Poor 😞'
      case 2: return 'Fair 😐'
      case 3: return 'Good 🙂'
      case 4: return 'Very Good 😃'
      case 5: return 'Excellent! 😍'
      default: return 'Rate your trip'
    }
  }

  // File Uploader Logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (selectedFiles: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const newFiles: UploadedFile[] = selectedFiles
      .filter(file => {
        if (!validTypes.includes(file.type)) {
          alert(`File "${file.name}" is not a valid image format. Only JPG, PNG, and WebP are allowed.`)
          return false
        }
        if (file.size > maxSize) {
          alert(`File "${file.name}" is too large. Maximum size allowed is 5MB.`)
          return false
        }
        return true
      })
      .map(file => ({
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        file,
        progress: 0,
        status: 'pending' as const
      }))

    // Limit to max 5 images total
    const updatedFiles = [...files, ...newFiles].slice(0, 5)
    setFiles(updatedFiles)

    newFiles.forEach(uf => {
      uploadFile(uf.id, uf.file)
    })
  }

  const uploadFile = async (id: string, file: File) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 10 } : f))
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === id && f.status === 'uploading' && f.progress < 90) {
            return { ...f, progress: f.progress + 15 }
          }
          return f
        }))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to upload file')
      }

      const data = await response.json()
      
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'success', progress: 100, url: data.url } : f
      ))
    } catch (err) {
      console.error('File upload error:', err)
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'error', progress: 0, errorMsg: (err as Error).message } : f
      ))
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  // Wizard Validation
  const isNameInvalid = touched.name && !name.trim()
  const isCategoryInvalid = touched.category && !selectedCategory
  const isRatingInvalid = touched.rating && rating === 0
  const isCommentInvalid = touched.comment && comment.trim().length < 10

  const canGoToStep2 = name.trim() && selectedCategory
  const canGoToStep3 = canGoToStep2 && rating > 0 && comment.trim().length >= 10

  // Move forward in Wizard
  const nextStep = () => {
    if (step === 1) {
      setTouched(prev => ({ ...prev, name: true, category: true }))
      if (canGoToStep2) setStep(2)
    } else if (step === 2) {
      setTouched(prev => ({ ...prev, rating: true, comment: true }))
      if (canGoToStep3) setStep(3)
    }
  }

  // Move backward in Wizard
  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (files.some(f => f.status === 'uploading')) {
      alert('Please wait for photos to finish uploading.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const imageUrls = files
      .filter(f => f.status === 'success' && f.url)
      .map(f => f.url as string)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          comment: comment.trim(),
          categoryId: selectedCategory === 'general' ? null : selectedCategory,
          platform: 'Wanderphilia',
          images: imageUrls
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      setSubmitSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-tr from-[#FFF7ED] via-[#F4FAF9] to-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] aspect-square rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-10 z-10">
        <button 
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-bold group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Website
        </button>
        
        <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tight">
          <Compass className="text-primary animate-spin-slow w-6 h-6" />
          <span>Wanderphilia</span>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="grow max-w-3xl mx-auto w-full z-10 flex flex-col justify-center">
        {submitSuccess ? (
          /* Animated Success Screen */
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-14 shadow-2xl border border-emerald-100/60 text-center animate-in zoom-in duration-300">
            <div className="mx-auto w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner ring-4 ring-emerald-50/50">
              <Check size={48} className="stroke-[3] animate-bounce" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Feedback Received!
            </h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed text-sm sm:text-base font-medium">
              Thank you for sharing your travel experience! Your review and photos have been saved and will appear on the destination's page automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/95 hover:shadow-xl hover:-translate-y-0.5 active:scale-98 transition-all duration-200 cursor-pointer shadow-md shadow-primary/20 text-sm tracking-wide"
              >
                Return to Website
              </button>
              <button
                onClick={() => {
                  setName('')
                  setSelectedCategory('')
                  setRating(0)
                  setComment('')
                  setFiles([])
                  setTouched({ name: false, category: false, rating: false, comment: false })
                  setStep(1)
                  setSubmitSuccess(false)
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-extrabold rounded-2xl active:scale-98 transition-all duration-200 cursor-pointer text-sm"
              >
                Write Another Review
              </button>
            </div>
          </div>
        ) : (
          /* High-End Step-by-Step Form Card */
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-100 flex flex-col justify-between min-h-[580px]">
            <div>
              {/* Header Title Section */}
              <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2.5 uppercase tracking-widest">
                    Step {step} of 3
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Share Your Journey
                  </h1>
                </div>
                
                {/* Horizontal Progress Steps */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {[1, 2, 3].map((num) => (
                    <div 
                      key={num} 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step === num 
                          ? 'w-8 bg-primary' 
                          : step > num 
                          ? 'w-4 bg-emerald-500' 
                          : 'w-4 bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <p>{submitError}</p>
                </div>
              )}

              {/* Wizard Step 1: Who are you & Where did you go? */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800" htmlFor="name">
                      What is your name?
                    </label>
                    <div className="relative rounded-2xl">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                        className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 border rounded-2xl transition duration-200 outline-hidden focus:ring-2 ${
                          isNameInvalid 
                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/50' 
                            : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
                        }`}
                        placeholder="e.g. John Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                    {isNameInvalid && (
                      <p className="text-xs text-rose-500 font-semibold pl-1">Please enter your name.</p>
                    )}
                  </div>

                  {/* Destination Selection with cards */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <label className="block text-sm font-bold text-slate-800">
                        Which destination did you visit?
                      </label>
                      
                      {/* Interactive Search Field */}
                      <div className="relative w-full sm:w-60">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Search size={14} />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search destination..."
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Destination Grid */}
                    <div className="border border-slate-100 bg-slate-50/30 rounded-2xl p-3 max-h-[300px] overflow-y-auto custom-scroll">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        
                        {/* General Feedback Card */}
                        {searchQuery === '' && (
                          <button
                            type="button"
                            onClick={() => setSelectedCategory('general')}
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left group transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-950 ${
                              selectedCategory === 'general'
                                ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-[1.01]'
                                : 'border-slate-200/60 hover:border-slate-400 hover:shadow-xs'
                            }`}
                          >
                            <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                              <div className="flex justify-between items-start">
                                <Compass className="text-primary w-5 h-5 animate-spin-slow shrink-0" />
                                {selectedCategory === 'general' && (
                                  <div className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200 shrink-0">
                                    <Check size={12} className="stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">General</p>
                                <p className="text-xs font-extrabold tracking-tight">Overall Experience</p>
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Category Cards */}
                        {filteredCategories.map((cat) => {
                          const isSelected = selectedCategory === cat.id
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left group transition-all duration-300 ${
                                isSelected 
                                  ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-[1.01]' 
                                  : 'border-slate-200/60 hover:border-slate-400 hover:shadow-xs'
                              }`}
                            >
                              <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t transition duration-300 ${
                                isSelected ? 'from-primary/80 via-primary/45 to-black/10' : 'from-black/75 via-black/25 to-transparent'
                              }`} />
                              
                              {/* Checkmark overlay */}
                              {isSelected && (
                                <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200 shrink-0">
                                  <Check size={12} className="stroke-[3]" />
                                </div>
                              )}

                              <div className="absolute bottom-2.5 left-2.5 text-white pr-2">
                                <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">Destination</p>
                                <p className="text-xs font-extrabold tracking-tight truncate">{cat.name}</p>
                              </div>
                            </button>
                          )
                        })}

                        {filteredCategories.length === 0 && searchQuery !== '' && (
                          <div className="col-span-full py-8 text-center text-slate-400 font-semibold text-xs">
                            No destinations match "{searchQuery}"
                          </div>
                        )}
                      </div>
                    </div>
                    {isCategoryInvalid && (
                      <p className="text-xs text-rose-500 font-semibold pl-1">Please select the destination you visited.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Wizard Step 2: Rating and Comments */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  {/* Glowing Star Rating */}
                  <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-center sm:text-left">
                    <label className="block text-sm font-bold text-slate-800">
                      How would you rate your trip?
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center sm:justify-start">
                      <div className="flex items-center gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = star <= (hoverRating || rating)
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                setRating(star)
                                setTouched(prev => ({ ...prev, rating: true }))
                              }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-120 active:scale-90 transition duration-150 text-slate-200 cursor-pointer"
                            >
                              <Star
                                size={36}
                                className={`transition-all duration-200 ${
                                  isActive 
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]' 
                                    : 'text-slate-300 hover:text-slate-400'
                                }`}
                              />
                            </button>
                          )
                        })}
                      </div>
                      <span className={`text-sm font-extrabold transition-colors duration-200 min-w-28 text-center sm:text-left ${
                        rating > 0 ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        {getRatingLabel(hoverRating || rating)}
                      </span>
                    </div>
                    {isRatingInvalid && (
                      <p className="text-xs text-rose-500 font-semibold pl-1 text-left">Please select a rating.</p>
                    )}
                  </div>

                  {/* Comment Box */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800" htmlFor="comment">
                      Write your review
                    </label>
                    <div className="relative rounded-2xl">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none text-slate-400">
                        <MessageSquare size={18} />
                      </div>
                      <textarea
                        id="comment"
                        rows={5}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, comment: true }))}
                        className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 border rounded-2xl transition duration-200 outline-hidden focus:ring-2 ${
                          isCommentInvalid 
                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/50' 
                            : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
                        }`}
                        placeholder="Tell us about the highlights of your trip, guides, accommodations, or special moments... (minimum 10 characters)"
                      />
                    </div>
                    <div className="flex justify-between items-center px-1 text-[11px] font-bold text-slate-400">
                      {isCommentInvalid ? (
                        <p className="text-rose-500">Review must be at least 10 characters.</p>
                      ) : (
                        <span>Describe your experience in details</span>
                      )}
                      <span>{comment.length} characters</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Step 3: Photos Upload */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">
                      Add photos to your review
                    </label>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                      Upload beautiful memories from your trip (max 5 pictures). These will show up in the reviews section.
                    </p>
                  </div>

                  {/* High Quality Drag & Drop Uploader */}
                  {files.length < 5 && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-200 hover:border-primary/60 bg-slate-50/30 hover:bg-primary/5 rounded-2xl p-8 text-center transition duration-200 cursor-pointer relative group flex flex-col items-center"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isSubmitting}
                      />
                      <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-100 group-hover:scale-110 transition duration-300">
                        <Upload className="text-slate-400 group-hover:text-primary transition-colors w-7 h-7" />
                      </div>
                      <p className="text-sm font-extrabold text-slate-700 mt-3.5">
                        Drag & Drop photos or <span className="text-primary hover:underline">Browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">
                        JPEG, PNG, WebP up to 5MB
                      </p>
                    </div>
                  )}

                  {/* Photo Thumbnails Preview Grid */}
                  {files.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                      {files.map((uf) => {
                        const isUploading = uf.status === 'uploading'
                        const isSuccess = uf.status === 'success'
                        const isError = uf.status === 'error'
                        const previewUrl = URL.createObjectURL(uf.file)

                        return (
                          <div 
                            key={uf.id} 
                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-2xs group bg-slate-100"
                          >
                            <img
                              src={isSuccess && uf.url ? uf.url : previewUrl}
                              alt={uf.file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            
                            {/* Upload Progress Loader overlay */}
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-white">
                                <Loader2 className="w-5 h-5 animate-spin mb-1.5" />
                                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${uf.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Successful Upload Badge overlay */}
                            {isSuccess && (
                              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-200">
                                <Check size={12} className="stroke-[3]" />
                              </div>
                            )}

                            {/* Upload Failed overlay */}
                            {isError && (
                              <div className="absolute inset-0 bg-rose-500/85 text-white flex flex-col items-center justify-center p-1.5 text-[9px] text-center">
                                <X className="w-4 h-4 stroke-[3] mb-0.5" />
                                <span className="font-bold line-clamp-2">{uf.errorMsg || 'Failed'}</span>
                              </div>
                            )}

                            {/* Hover Delete Action Button */}
                            <button
                              type="button"
                              onClick={() => removeFile(uf.id)}
                              className="absolute top-1 right-1 p-1 bg-black/55 hover:bg-black/75 hover:scale-105 active:scale-95 text-white rounded-full transition opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto cursor-pointer"
                              title="Delete Photo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Footer Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4 mt-8">
              {/* Back Button */}
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-extrabold rounded-2xl transition duration-150 active:scale-98 flex items-center gap-1.5 text-sm cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft size={16} className="stroke-[2.5]" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {/* Next / Submit Button */}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={(step === 1 && !canGoToStep2) || (step === 2 && !canGoToStep3)}
                  className="px-7 py-3.5 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-2xl transition duration-150 active:scale-98 flex items-center gap-1.5 text-sm cursor-pointer shadow-md shadow-primary/10 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                >
                  Continue
                  <ChevronRight size={16} className="stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || files.some(f => f.status === 'uploading')}
                  className="px-8 py-3.5 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-2xl transition duration-150 active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <Check size={16} className="stroke-[2.5]" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs font-semibold text-slate-400 mt-12 pt-6 border-t border-slate-100/60 z-10">
        <p>&copy; {new Date().getFullYear()} Wanderphilia. All rights reserved.</p>
      </footer>

    </div>
  )
}

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { VideoTestimonial } from '@/lib/data'

interface VideoCardProps extends VideoTestimonial {}

export function VideoCard({ title, thumbnail, videoUrl, author, role, trip }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className="group relative rounded-2xl overflow-hidden bg-gray-200 cursor-pointer h-64"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-white/50 group-hover:scale-110 transition-all duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}>
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Info at bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium text-sm">{author}</p>
              <p className="text-white/70 text-xs">{role}</p>
            </div>
            <span className="bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {trip}
            </span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-0">
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-gray-900 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold">{author}</p>
                <p className="text-gray-400">{role}</p>
              </div>
              <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold">
                {trip}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

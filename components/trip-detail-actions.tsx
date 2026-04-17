'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Share2 } from 'lucide-react'

interface TripDetailActionsProps {
    title: string
}

export function TripDetailActions({ title }: TripDetailActionsProps) {
    const [wishlisted, setWishlisted] = useState(false)
    const [notification, setNotification] = useState<string | null>(null)

    const showNotification = (message: string) => {
        setNotification(message)
        setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
    }

    async function handleShare() {
        const shareText = `Check out ${title} on Wanderphilia.`
        const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

        // Try Web Share API first (works on mobile and some desktop browsers)
        if (typeof navigator !== 'undefined' && 'share' in navigator) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: shareUrl,
                })
                return
            } catch (error) {
                // User cancelled share or API failed, continue to fallback
                console.log('Share cancelled or failed:', error)
            }
        }

        // Fallback: Copy to clipboard
        if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
            try {
                await navigator.clipboard.writeText(shareUrl)
                // Show a better notification instead of alert
                showNotification('Link copied to clipboard!')
            } catch (error) {
                console.error('Failed to copy to clipboard:', error)
                // Final fallback: show the URL in a prompt
                if (typeof window !== 'undefined') {
                    window.prompt('Copy this link:', shareUrl)
                }
            }
        } else {
            // Old browser fallback
            if (typeof window !== 'undefined') {
                window.prompt('Copy this link:', shareUrl)
            }
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-row sm:flex-row items-center justify-between gap-0">
                    <div className="flex flex-row  items-center gap-0">
                        <Button
                            variant="outline"
                            className="gap-2 px-4 text-sm font-semibold"
                            onClick={handleShare}
                        >
                            <Share2 size={18} />
                            Share
                        </Button>
                        {/* <Button
              variant={wishlisted ? 'secondary' : 'outline'}
              className="gap-2 px-4 text-sm font-semibold"
              onClick={() => setWishlisted((current) => !current)}
            >
              <Heart size={18} className={wishlisted ? 'text-pink-500' : ''} />
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </Button> */}
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-sm text-gray-600">Need help?</p>
                        <p className="text-sm font-semibold text-primary">Call us: +91 98765 43210</p>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
                    {notification}
                </div>
            )}
        </div>
    )
}

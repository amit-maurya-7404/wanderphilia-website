import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ScrollActionButtons from '@/components/ScrollActionButtons'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { MobileBottomNavConditional } from '@/components/mobile-bottom-nav-conditional'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ✅ SAME as your original (unchanged)
  title: 'Wanderphilia - India\'s Most trusted & Safest Travel Community',
  description: 'India’s growing travel community for epic group trips & offbeat experiences across India & international destinations. From customised family holidays to romantic honeymoons, trusted by 20,000+ travellers to create unforgettable journeys and stories you carry for life.',

  // ✅ IMPROVED favicon setup
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },

  // ✅ Manifest add kiya (no conflict)
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <div className="min-h-screen pb-14 md:pb-0">
          {children}
        </div>
        <ScrollActionButtons />
        <ScrollToTopButton />
        <MobileBottomNavConditional />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
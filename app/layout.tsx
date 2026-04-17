import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ScrollActionButtons from '@/components/ScrollActionButtons'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { MobileBottomNavConditional } from '@/components/mobile-bottom-nav-conditional'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Wanderphilia - Explore the Unseen',
  description: 'Discover extraordinary travel experiences with Wanderphilia. Premium adventure trips curated for wanderlust seekers.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
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

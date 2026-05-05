import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import ScrollActionButtons from '@/components/ScrollActionButtons'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { MobileBottomNavConditional } from '@/components/mobile-bottom-nav-conditional'
import { Analytics as GAAnalytics } from '@/components/analytics'
import { ScrollTracker } from '@/components/scroll-tracker'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ✅ SAME as your original (unchanged)
  title: 'Wanderphilia - India\'s Most trusted & Safest Travel Community',
  description: 'India’s growing travel community for epic group trips & offbeat experiences across India & international destinations. From customised family holidays to romantic honeymoons, trusted by 20,000+ travellers to create unforgettable journeys and stories you carry for life.',

  // ✅ IMPROVED favicon setup
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
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
        {/* Google Analytics Script - Loads after interactive elements */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-GFPXJ77HPK`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GFPXJ77HPK');
          `}
        </Script>

        <div className="min-h-screen pb-14 md:pb-0">
          {children}
        </div>
        <div className="hidden md:block">
          <ScrollActionButtons />
        </div>
        <ScrollToTopButton />
        <MobileBottomNavConditional />

        {/* Page View Tracking */}
        <GAAnalytics />

        {/* Scroll Depth Tracking */}
        <ScrollTracker />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
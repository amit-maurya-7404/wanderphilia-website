import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { GoogleAnalyticsTracker } from '@/components/analytics'
import './globals.css'
import ScrollActionButtons from '@/components/ScrollActionButtons'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { MobileBottomNavConditional } from '@/components/mobile-bottom-nav-conditional'
import { ScrollTracker } from '@/components/scroll-tracker'
import { AITripPlanner } from '@/components/ai-trip-planner'
// import { PromoAdCard } from '@/components/promo-ad'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wanderphilia.com'),
  alternates: {
    canonical: 'https://wanderphilia.com',
  },
  title: {
    default: "Wanderphilia - India's Most Trusted Travel Community",
    template: '%s | Wanderphilia',
  },
  description: 'India’s growing travel community for epic group trips & offbeat experiences across India & international destinations. From customised family holidays to romantic honeymoons, trusted by 20,000+ travellers to create unforgettable journeys and stories you carry for life.',
  applicationName: 'Wanderphilia',
  keywords: [
    'Wanderphilia',
    'India travel company',
    'group trips',
    'honeymoon packages',
    'international holidays',
    'travel community',
  ],
  openGraph: {
    title: 'Wanderphilia - India’s Most Trusted Travel Community',
    description: 'Group trips, honeymoon packages and international holidays from India’s trusted travel community.',
    url: 'https://wanderphilia.com',
    siteName: 'Wanderphilia',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://wanderphilia.com/images/bali.jpg',
        width: 1200,
        height: 630,
        alt: 'Wanderphilia travel company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderphilia - India’s Most Trusted Travel Community',
    description: 'Group trips, honeymoon packages and international holidays from India’s trusted travel community.',
    images: ['https://wanderphilia.com/images/bali.jpg'],
    creator: '@Wanderphilia',
    site: '@Wanderphilia',
  },
  authors: [{ name: 'Wanderphilia', url: 'https://wanderphilia.com' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const themeColor = '#ff8a00';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Wanderphilia',
              url: 'https://wanderphilia.com',
              logo: 'https://wanderphilia.com/favicon.png',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+91 92176 64099',
                  contactType: 'Customer Service',
                  availableLanguage: ['English'],
                },
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Laxmi Vihar Building, Walkeshwar',
                addressLocality: 'Mumbai',
                addressRegion: 'MH',
                postalCode: '400006',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased overflow-x-hidden`}>
        <GoogleAnalyticsTracker />
        <div className="min-h-screen pb-14 md:pb-0">
          {children}
        </div>
        <div className="hidden md:block">
          <ScrollActionButtons />
        </div>
        <ScrollToTopButton />
        <MobileBottomNavConditional />
        <AITripPlanner />


        {/* Scroll Depth Tracking */}
        <ScrollTracker />
        {/* <PromoAdCard /> */}

        {process.env.NODE_ENV === 'production' && <VercelAnalytics />}
      </body>
    </html>
  )
}

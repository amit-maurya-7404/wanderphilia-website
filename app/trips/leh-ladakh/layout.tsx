import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leh Ladakh Tour Packages 2026 | Wanderphilia',
  description: 'Book all inclusive Leh Ladakh Tour Packages covering Nubra Valley, Khardung La, Pangong Lake, Turtuk, Hanle, Umingla Pass, Tso Moriri.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/leh-ladakh',
  },
  openGraph: {
    title: 'Leh Ladakh Tour Packages 2026 | Wanderphilia',
    description: 'Book all inclusive Leh Ladakh Tour Packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/leh-ladakh',
    type: 'website',
  }
}

export default function LehLadakhLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leh Ladakh Tour Packages | Ladakh Bike Trips & Group Tours | Wanderphilia',
  description: 'Experience the ultimate adventure with Ladakh tour packages. Join Leh Ladakh group tours, bike trips to Pangong Lake, Nubra Valley, and Khardung La with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/leh-ladakh',
  },
  openGraph: {
    title: 'Leh Ladakh Tour Packages | Ladakh Bike Trips & Group Tours | Wanderphilia',
    description: 'Experience the ultimate adventure with Ladakh tour packages. Join Leh Ladakh group tours, bike trips to Pangong Lake, Nubra Valley, and Khardung La with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/leh-ladakh',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

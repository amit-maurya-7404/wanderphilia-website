import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kashmir Tour Packages | Heaven on Earth Group & Custom Trips | Wanderphilia',
  description: 'Explore the beauty of Kashmir with our custom and group tour packages. Boat rides on Dal Lake, scenic views in Gulmarg, Pahalgam, and Srinagar with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/kashmir',
  },
  openGraph: {
    title: 'Kashmir Tour Packages | Heaven on Earth Group & Custom Trips | Wanderphilia',
    description: 'Explore the beauty of Kashmir with our custom and group tour packages. Boat rides on Dal Lake, scenic views in Gulmarg, Pahalgam, and Srinagar with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/kashmir',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

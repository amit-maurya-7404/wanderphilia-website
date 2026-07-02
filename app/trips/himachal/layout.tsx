import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Himachal Tour Packages | Group Trips & Custom Holidays | Wanderphilia',
  description: 'Book scenic Himachal tour packages with Wanderphilia. Explore Shimla, Manali, Dharamshala, Dalhousie, and Kasol in curated group tours or customized family packages.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/himachal',
  },
  openGraph: {
    title: 'Himachal Tour Packages | Group Trips & Custom Holidays | Wanderphilia',
    description: 'Book scenic Himachal tour packages with Wanderphilia. Explore Shimla, Manali, Dharamshala, Dalhousie, and Kasol in curated group tours or customized family packages.',
    url: 'https://wanderphilia.com/trips/himachal',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bhutan Tour Packages | Wanderphilia',
  description: 'Experience the magic of Bhutan with Wanderphilia. Book your Bhutan group trips and customized tours today.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bhutan',
  },
  openGraph: {
    title: 'Bhutan Tour Packages | Wanderphilia',
    description: 'Experience the magic of Bhutan with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/bhutan',
    type: 'website',
  }
}

export default function BhutanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

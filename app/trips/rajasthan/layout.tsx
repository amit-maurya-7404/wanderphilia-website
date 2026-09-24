import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rajasthan Tour Packages 2026 | Royal Palaces, Forts & Desert Holidays | Wanderphilia',
  description: 'Explore the royal land of Rajasthan with curated luxury group & private trips. Visit Jaipur, Ranthambore, Agra & Taj Mahal with verified stays, chauffeur transfers, and 24/7 concierge support.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/rajasthan',
  },
  openGraph: {
    title: 'Rajasthan Tour Packages 2026 | Royal Palaces & Desert Holidays | Wanderphilia',
    description: 'Explore royal palaces, towering forts, wildlife, and the Taj Mahal with Wanderphilia exclusive private & group holidays.',
    url: 'https://wanderphilia.com/trips/rajasthan',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

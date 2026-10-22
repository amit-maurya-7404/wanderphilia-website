import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal Itinerary Builder | Wanderphilia',
  description: 'Internal Operations tool for Wanderphilia team.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function SheetItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Command & Itinerary Hub | Wanderphilia',
  description: 'Internal sales portal for generating quotes, multi-option itineraries, and client handover to operations.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {children}
    </div>
  );
}

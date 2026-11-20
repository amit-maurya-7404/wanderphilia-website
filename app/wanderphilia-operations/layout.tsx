import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Operations & Fulfillment Hub | Wanderphilia',
  description: 'Internal operations, hotel reservations, transport dispatch, and finance sync portal.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function OperationsLayout({
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

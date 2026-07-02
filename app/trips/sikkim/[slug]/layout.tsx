import { Metadata } from 'next'
import { trips } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) return {};

  const title = `${trip.title} | Wanderphilia`;
  const description = Array.isArray(trip.description) ? trip.description[0] : trip.description;

  return {
    title,
    description: description.substring(0, 160),
    alternates: {
      canonical: `https://wanderphilia.com/trips/sikkim/${slug}`,
    },
    openGraph: {
      title,
      description: description.substring(0, 160),
      url: `https://wanderphilia.com/trips/sikkim/${slug}`,
      type: 'website',
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getManualItinerary, getAllManualItineraries } from '@/data/manual-itineraries';
import { ManualItineraryTemplate } from '@/components/itinerary/manual-itinerary-template';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllManualItineraries();
  return all.flatMap(it => [
    { slug: it.id },
    { slug: it.slug }
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = getManualItinerary(slug);

  if (!itinerary) {
    return {
      title: 'Itinerary Not Found | Wanderphilia',
      description: 'The requested luxury travel itinerary could not be found.',
    };
  }

  const title = `${itinerary.title.toUpperCase()} | Wanderphilia Exclusive`;
  const description = `${itinerary.duration} - ${itinerary.route}. Curated luxury mountain expedition by Wanderphilia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: itinerary.heroImage ? [{ url: itinerary.heroImage }] : [],
    },
  };
}

export default async function ItineraryCustomPage({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = getManualItinerary(slug);

  if (!itinerary) {
    notFound();
  }

  return <ManualItineraryTemplate itinerary={itinerary} />;
}

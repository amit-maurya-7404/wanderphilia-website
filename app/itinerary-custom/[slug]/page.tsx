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
  const teamImageUrl = 'https://wanderphilia.com/images/team5.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wanderphilia.com/itinerary-custom/${slug}`,
      siteName: 'Wanderphilia',
      images: [
        {
          url: teamImageUrl,
          width: 1200,
          height: 630,
          alt: 'Wanderphilia Team',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [teamImageUrl],
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

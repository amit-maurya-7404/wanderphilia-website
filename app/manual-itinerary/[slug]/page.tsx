import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getManualItinerary, getAllManualItineraries } from '@/data/manual-itineraries';
import { ManualItineraryTemplate } from '@/components/itinerary/manual-itinerary-template';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = getManualItinerary(slug);

  if (!itinerary) {
    try {
      const { getDb } = await import('@/lib/mongodb');
      const db = await getDb();
      const mongoTrip = await db.collection('trips').findOne({
        $or: [{ slug }, { id: slug }]
      });
      if (mongoTrip) {
        const title = mongoTrip.seo?.title || `${mongoTrip.title} | Wanderphilia Exclusive`;
        const description = mongoTrip.seo?.description || mongoTrip.description?.slice(0, 160) || '';
        return {
          title,
          description,
        };
      }
    } catch {}

    const cleanTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${cleanTitle} | Wanderphilia Exclusive Itinerary`,
      description: `Curated luxury travel itinerary by Wanderphilia.`,
    };
  }

  const title = `${itinerary.title.toUpperCase()} | Wanderphilia Exclusive`;
  const description = `${itinerary.duration} - ${itinerary.route}. Curated luxury mountain expedition by Wanderphilia.`;
  const teamImageUrl = 'https://wanderphilia.com/images/team5.jpg';

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://wanderphilia.com/manual-itinerary/${slug}`,
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

export default async function ManualItineraryPage({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = getManualItinerary(slug);

  if (!itinerary) {
    notFound();
  }

  return <ManualItineraryTemplate itinerary={itinerary} />;
}

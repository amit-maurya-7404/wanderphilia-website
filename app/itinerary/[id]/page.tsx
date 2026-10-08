import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { ManualItineraryTemplate } from '@/components/itinerary/manual-itinerary-template';
import {
  getManualItinerary,
  manualItineraryToDocument,
  itineraryDocumentToManualItinerary
} from '@/data/manual-itineraries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getItinerary(id: string): Promise<ItineraryDocument | null> {
  // 1. Check local manual itineraries first
  const manual = getManualItinerary(id);
  if (manual) {
    return manualItineraryToDocument(manual);
  }

  try {
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    const itinerary = await collection.findOne({
      $or: [{ id: id }, { slug: id }]
    });

    if (!itinerary) {
      return null;
    }

    return {
      ...itinerary,
      _id: itinerary._id?.toString(),
      createdAt: itinerary.createdAt ? new Date(itinerary.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: itinerary.updatedAt ? new Date(itinerary.updatedAt).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Error fetching itinerary]:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const itinerary = await getItinerary(id);

  if (!itinerary) {
    return {
      title: 'Itinerary Not Found | Wanderphilia',
      description: 'The requested luxury travel itinerary could not be found.',
    };
  }

  const title = `${itinerary.destination?.toUpperCase()} ITINERARY | Wanderphilia Exclusive`;
  const description = itinerary.description || `Custom luxury travel itinerary for ${itinerary.destination} curated by Wanderphilia.`;
  const teamImageUrl = 'https://wanderphilia.com/images/team5.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wanderphilia.com/itinerary/${id}`,
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

export default async function ItineraryPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Check manual itineraries first (with live DB payment state)
  const manual = getManualItinerary(id);
  if (manual) {
    try {
      const db = await getDb();
      const collection = db.collection<ItineraryDocument>('itineraries');
      const dbDoc = await collection.findOne({ $or: [{ id: id }, { slug: id }] });
      if (dbDoc) {
        manual.advanceAmountPaid = dbDoc.advanceAmountPaid ?? dbDoc.rawZohoData?.Advance_Amount_Paid ?? manual.advanceAmountPaid;
        manual.balancePendingAmount = dbDoc.balancePendingAmount ?? dbDoc.rawZohoData?.Balance_Pending_Amount ?? manual.balancePendingAmount;
        manual.paymentStage = dbDoc.paymentStage ?? manual.paymentStage;
        manual.payments = dbDoc.payments ?? manual.payments;
      }
    } catch (e) {
      console.warn('[Manual Itinerary DB Fetch Error]:', e);
    }
    return <ManualItineraryTemplate itinerary={manual} />;
  }

  // 2. Fetch from DB (Zoho CRM fetched or saved itinerary document)
  const itinerary = await getItinerary(id);

  if (!itinerary) {
    notFound();
  }

  // Convert Zoho / DB ItineraryDocument to ManualItinerary format to render the exact same rich, 6-page Canva-style UI
  const manualItinerary = itineraryDocumentToManualItinerary(itinerary);

  return <ManualItineraryTemplate itinerary={manualItinerary} />;
}

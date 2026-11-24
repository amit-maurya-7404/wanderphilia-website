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
    try {
      const { getDb } = await import('@/lib/mongodb');
      const db = await getDb();
      const mongoTrip = await db.collection('trips').findOne({
        $or: [{ id }, { slug: id }]
      });
      if (mongoTrip) {
        const title = mongoTrip.seo?.title || `${mongoTrip.title} | Wanderphilia`;
        const description = mongoTrip.seo?.description || mongoTrip.description?.slice(0, 160) || '';
        return {
          title,
          description,
        };
      }
    } catch {}

    const cleanTitle = id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${cleanTitle} | Wanderphilia Luxury Itinerary`,
      description: `Luxury travel itinerary by Wanderphilia.`,
    };
  }

  const title = `${itinerary.destination?.toUpperCase()} ITINERARY | Wanderphilia`;
  const description = itinerary.description || `Travel itinerary for ${itinerary.destination} from Wanderphilia.`;
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

async function enrichWithOperationsBooking(manual: any, id: string): Promise<any> {
  try {
    const db = await getDb();
    const criteria: any[] = [{ itineraryDocId: id }, { itineraryDocId: manual.id }];
    if (manual.inquiryId) criteria.push({ inquiryId: manual.inquiryId });
    if (manual.zohoLeadId) criteria.push({ zohoLeadId: manual.zohoLeadId });
    if (id) criteria.push({ itineraryUrl: { $regex: id, $options: 'i' } });

    const opsBooking = await db.collection('operations_bookings').findOne({
      $or: criteria
    });

    if (opsBooking) {
      manual.isHandedOver = true;
      manual.confirmedOptionNumber = Number(opsBooking.selectedOptionNumber || 1);
      manual.confirmedOptionTitle = opsBooking.selectedOptionTitle || `Option ${opsBooking.selectedOptionNumber || 1}`;
      if (opsBooking.advanceAmountPaid !== undefined && opsBooking.advanceAmountPaid > 0) {
        manual.advanceAmountPaid = opsBooking.advanceAmountPaid;
      }
      if (opsBooking.balancePendingAmount !== undefined) {
        manual.balancePendingAmount = opsBooking.balancePendingAmount;
      }
      manual.paymentStage = (opsBooking.balancePendingAmount !== undefined && opsBooking.balancePendingAmount <= 0)
        ? 'fully_paid'
        : 'advance_paid';
      manual.utrNumber = opsBooking.utrNumber;
      manual.paymentMode = opsBooking.paymentMode;
    }
  } catch (err) {
    console.warn('[Enrich with Operations Booking Notice]:', err);
  }
  return manual;
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
    const enrichedManual = await enrichWithOperationsBooking(manual, id);
    return <ManualItineraryTemplate itinerary={enrichedManual} />;
  }

  // 2. Fetch from DB (Zoho CRM fetched or saved itinerary document)
  const itinerary = await getItinerary(id);

  if (!itinerary) {
    notFound();
  }

  // Convert Zoho / DB ItineraryDocument to ManualItinerary format to render the exact same rich, 6-page Canva-style UI
  const manualItinerary = itineraryDocumentToManualItinerary(itinerary);
  const enrichedManualItinerary = await enrichWithOperationsBooking(manualItinerary, id);

  return <ManualItineraryTemplate itinerary={enrichedManualItinerary} />;
}

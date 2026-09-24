import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { generateItineraryContentWithAI } from '@/lib/ai-itinerary';
import { getLuxuryImagesForDestination } from '@/lib/itinerary-images';
import { ItineraryDocument } from '@/types/itinerary';

/**
 * Helper to generate a clean, collision-resistant unique slug/ID (e.g., "wp-k8m9x2a4")
 */
function generateUniqueItineraryId(): string {
  const randomBytes = crypto.randomBytes(4).toString('hex');
  return `wp-${randomBytes}`;
}

/**
 * Normalizes incoming data from Zoho CRM webhooks (handles standard & custom CRM field keys)
 */
function normalizeZohoPayload(body: any): Record<string, any> {
  // If Zoho wrapped data in an array or sub-object (e.g., { data: [{...}] } or { lead: {...} })
  let raw: Record<string, any> = {};

  if (Array.isArray(body)) {
    raw = body[0] || {};
  } else if (body && Array.isArray(body.data)) {
    raw = body.data[0] || {};
  } else if (body && body.lead && typeof body.lead === 'object') {
    raw = body.lead;
  } else if (body && typeof body === 'object') {
    raw = body;
  }

  // Extract common Zoho CRM fields dynamically
  const firstName = raw.First_Name || raw.firstName || raw.first_name || '';
  const lastName = raw.Last_Name || raw.lastName || raw.last_name || '';
  const fullName = raw.Full_Name || raw.name || raw.Name || [firstName, lastName].filter(Boolean).join(' ') || 'Valued Guest';

  const destination = raw.Destination || raw.Destinations || raw.destination || raw.City || raw.city || raw.State || '';
  const hotelName = raw.Hotel_Name || raw.Hotel || raw.hotelName || raw.hotel || raw.Property_Name || raw.stay || '';
  const roomCategory = raw.Room_Category || raw.Room_Type || raw.preferredRoomCategory || raw.roomCategory || raw.room_type || raw.Room || '';
  const mealPlan = raw.Meal_Plan || raw.mealPlan || raw.meal_plan || '';

  const guests = parseInt(String(raw.Number_Of_Guest || raw.Number_Of_Guests || raw.guests || raw.Guest_Count || 2), 10) || 2;
  const startDate = raw.Preferred_Start_date || raw.Start_Date || raw.startDate || raw.start_date || raw.Check_In || '';
  const endDate = raw.Travel_End_Date || raw.End_Date || raw.endDate || raw.end_date || raw.Check_Out || '';
  const duration = raw.Duration || raw.duration || raw.Days || raw.days || (startDate && endDate ? `${startDate} to ${endDate}` : '');

  const travelStyle = raw.Travel_Style || raw.travelStyle || raw.Travel_style || 'Family Trip';
  const tripType = raw.Trip_Type || raw.tripType || raw.Trip_type || 'Customised Trip';
  const noOfDays = parseInt(String(raw.No_of_Days || raw.noOfDays || raw.Days || raw.days || 0), 10) || 0;
  const noOfNights = parseInt(String(raw.No_of_Nights || raw.noOfNights || raw.Nights || raw.nights || 0), 10) || 0;
  const inquiryId = raw.Inquiry_ID || raw.inquiryId || '';

  const email = raw.Email || raw.email || '';
  const phone = raw.Mobile || raw.mobile || raw.Phone || raw.phone || '';
  const notes = raw.Description || raw.description || raw.message || raw.Notes || raw.Special_Requirements || '';

  return {
    ...raw,
    normalized: {
      name: fullName,
      firstName,
      lastName,
      email,
      phone,
      destination,
      hotelName,
      roomCategory,
      mealPlan,
      guests,
      startDate,
      endDate,
      duration,
      travelStyle,
      tripType,
      noOfDays,
      noOfNights,
      inquiryId,
      notes
    }
  };
}

/**
 * POST: Handles incoming Zoho CRM Webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON payload in request body.' },
        { status: 400 }
      );
    }

    console.log('[Zoho Webhook] Received incoming payload:', JSON.stringify(rawBody).slice(0, 300) + '...');

    // 1. Normalize Payload
    const normalizedData = normalizeZohoPayload(rawBody);
    const details = normalizedData.normalized;

    // 2. Generate Complete AI Luxury Itinerary Content using Groq / OpenAI
    const aiContent = await generateItineraryContentWithAI(normalizedData);

    // 3. Generate Unique Secure Slug / ID
    const uniqueId = generateUniqueItineraryId();

    // 4. Resolve Curated Destination Images
    const images = getLuxuryImagesForDestination(details.destination || aiContent.destination);

    // 5. Assemble Itinerary Document for MongoDB
    const itineraryDoc: ItineraryDocument = {
      id: uniqueId,
      slug: uniqueId,
      title: aiContent.title || `${details.noOfNights || 4} Nights / ${details.noOfDays || 5} Days Royal ${details.destination} Escape`,
      subTitle: details.travelStyle || aiContent.subTitle, // Zoho Travel Style
      description: aiContent.description, // Strict one-liner luxury description (NO prices/durations)
      destination: details.destination || aiContent.destination,
      travelStyle: details.travelStyle || aiContent.travelStyle || 'Family Trip',
      tripType: details.tripType || aiContent.tripType || 'Customised Trip',
      noOfDays: details.noOfDays || aiContent.noOfDays || aiContent.dayPlans?.length || 5,
      noOfNights: details.noOfNights || aiContent.noOfNights || ((details.noOfDays || 5) > 1 ? (details.noOfDays || 5) - 1 : 1),
      inquiryId: details.inquiryId,
      hotelName: details.hotelName || aiContent.hotelName,
      roomCategory: details.roomCategory || aiContent.roomCategory,
      mealPlan: details.mealPlan || aiContent.mealPlan,
      leadDetails: {
        name: details.name,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        mobile: details.phone,
        guests: details.guests,
        startDate: details.startDate,
        endDate: details.endDate,
        duration: details.duration,
        noOfDays: details.noOfDays || aiContent.noOfDays,
        noOfNights: details.noOfNights || aiContent.noOfNights,
        travelStyle: details.travelStyle,
        tripType: details.tripType,
        notes: details.notes
      },
      stay: {
        hotelName: details.hotelName || aiContent.hotelName,
        roomCategory: details.roomCategory || aiContent.roomCategory,
        mealPlan: details.mealPlan || aiContent.mealPlan,
        amenities: aiContent.amenities,
        checkIn: '2:00 PM',
        checkOut: '11:00 AM'
      },
      highlights: aiContent.highlights,
      dayPlans: aiContent.dayPlans,
      inclusions: aiContent.inclusions,
      exclusions: aiContent.exclusions,
      amenities: aiContent.amenities,
      heroImage: images.hero,
      galleryImages: images.gallery,
      status: 'active',
      rawZohoData: rawBody,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 6. Save to MongoDB in "itineraries" collection
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    await collection.insertOne(itineraryDoc);

    console.log(`[Zoho Webhook] Successfully created luxury itinerary with ID: ${uniqueId}`);

    // 7. Resolve Site Origin URL
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://wanderphilia.com';
    const cleanOrigin = origin.replace(/\/$/, '');
    const relativeUrl = `/itinerary/${uniqueId}`;
    const publicUrl = `${cleanOrigin}${relativeUrl}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Luxury Itinerary created and processed successfully via AI.',
        id: uniqueId,
        slug: uniqueId,
        url: relativeUrl,
        publicUrl: publicUrl,
        data: {
          title: itineraryDoc.title,
          subTitle: itineraryDoc.subTitle,
          description: itineraryDoc.description,
          destination: itineraryDoc.destination,
          hotelName: itineraryDoc.hotelName,
          roomCategory: itineraryDoc.roomCategory,
          mealPlan: itineraryDoc.mealPlan,
          leadName: details.name,
          daysCount: itineraryDoc.dayPlans?.length || 0
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Zoho Webhook Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error while processing itinerary.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Webhook Connectivity Check & Documentation
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/webhook/zoho',
    description: 'Wanderphilia Zoho CRM Webhook for Automated AI Luxury Itinerary Generation',
    supportedMethods: ['POST'],
    expectedPayloadExample: {
      First_Name: 'Rahul',
      Last_Name: 'Sharma',
      Email: 'rahul.sharma@example.com',
      Mobile: '9876543210',
      Destination: 'Jaisalmer',
      Hotel_Name: 'Suryagarh Palace',
      Room_Category: 'Desert Tent',
      Meal_Plan: 'Breakfast & Dinner',
      Duration: '4 Days / 3 Nights',
      Number_Of_Guest: 2
    }
  });
}

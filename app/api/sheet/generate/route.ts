import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { generateItineraryContentWithAI } from '@/lib/ai-itinerary';
import { getLuxuryImagesForDestination } from '@/lib/itinerary-images';
import { ItineraryDocument } from '@/types/itinerary';
import { generateLeadBasedItinerarySlug } from '@/lib/itinerary-slug';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * POST: Generates Luxury Itinerary from Google Sheet Data
 * Strictly isolated for /sheet-itinerary route
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

    const inquiryId = String(rawBody.inquiryId || rawBody.inquiry_id || rawBody.Inquiry_ID || '').trim();
    const zohoLeadId = String(rawBody.zohoLeadId || rawBody.leadId || rawBody.id || '').trim();
    const firstName = String(rawBody.firstName || rawBody.first_name || '').trim();
    const lastName = String(rawBody.lastName || rawBody.last_name || '').trim();
    const fullName = String(rawBody.fullName || rawBody.full_name || [firstName, lastName].filter(Boolean).join(' ') || 'Valued Guest').trim();
    const email = String(rawBody.email || '').trim();
    const mobile = String(rawBody.mobile || rawBody.phone || '').trim();
    const departureCity = String(rawBody.departureCity || rawBody.departure_city || rawBody.city || '').trim();
    const destination = String(rawBody.destination || rawBody.destinations || 'Rajasthan').trim();
    const destinationType = String(rawBody.destinationType || rawBody.destination_type || 'India').trim();

    const noOfDays = parseInt(String(rawBody.noOfDays || rawBody.no_of_days || 5), 10) || 5;
    const noOfNights = parseInt(String(rawBody.noOfNights || rawBody.no_of_nights || (noOfDays > 1 ? noOfDays - 1 : 1)), 10) || 4;
    const adults = parseInt(String(rawBody.adults || rawBody.no_of_adults || 2), 10) || 2;
    const kids = parseInt(String(rawBody.kids || rawBody.no_of_kids || 0), 10) || 0;
    const numberOfGuests = adults + kids;

    const startDate = String(rawBody.startDate || rawBody.travel_start_date || '').trim();
    const endDate = String(rawBody.endDate || rawBody.travel_end_date || '').trim();
    const duration = startDate && endDate ? `${startDate} to ${endDate}` : `${noOfNights} Nights / ${noOfDays} Days`;

    const travelStyle = String(rawBody.travelStyle || rawBody.travel_style || 'Family Trip').trim();
    const tripType = String(rawBody.tripType || rawBody.trip_type || 'Customised Trip').trim();
    const vehicleType = String(rawBody.vehicleType || rawBody.vehicle_type || 'AC Vehicle').trim();
    const hotelCategory = String(rawBody.hotelCategory || rawBody.hotel_category || 'Deluxe').trim();
    const preferredRoomCategory = String(rawBody.preferredRoomCategory || rawBody.preferred_room_category || 'Deluxe Room').trim();
    const mealPlan = String(rawBody.mealPlan || rawBody.meal_plan || 'Breakfast & Dinner').trim();

    // Option Number (1, 2, or 3)
    let optionNumber = 1;
    const rawOption = rawBody.optionNumber ?? rawBody.option;
    if (rawOption !== undefined && rawOption !== null && rawOption !== '') {
      const parsed = typeof rawOption === 'number' ? rawOption : parseInt(String(rawOption).replace(/\D+/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        optionNumber = parsed;
      }
    }

    // Pricing & Margins
    const baseQuotationAmount = rawBody.baseQuotationAmount !== undefined && rawBody.baseQuotationAmount !== '' && !isNaN(Number(rawBody.baseQuotationAmount))
      ? Number(rawBody.baseQuotationAmount)
      : undefined;
    const marginPercentage = rawBody.marginPercentage !== undefined && rawBody.marginPercentage !== '' && !isNaN(Number(rawBody.marginPercentage))
      ? Number(rawBody.marginPercentage)
      : undefined;
    const finalQuotationAmount = rawBody.finalQuotationAmount !== undefined && rawBody.finalQuotationAmount !== '' && !isNaN(Number(rawBody.finalQuotationAmount))
      ? Number(rawBody.finalQuotationAmount)
      : baseQuotationAmount;

    const perAdultPrice = rawBody.perAdultPrice !== undefined && rawBody.perAdultPrice !== '' && !isNaN(Number(rawBody.perAdultPrice))
      ? Number(rawBody.perAdultPrice)
      : undefined;
    const perKidPrice = rawBody.perKidPrice !== undefined && rawBody.perKidPrice !== '' && !isNaN(Number(rawBody.perKidPrice))
      ? Number(rawBody.perKidPrice)
      : undefined;

    const advanceAmountPaid = rawBody.advanceAmountPaid !== undefined && rawBody.advanceAmountPaid !== '' && !isNaN(Number(rawBody.advanceAmountPaid))
      ? Number(rawBody.advanceAmountPaid)
      : undefined;
    const balancePendingAmount = rawBody.balancePendingAmount !== undefined && rawBody.balancePendingAmount !== '' && !isNaN(Number(rawBody.balancePendingAmount))
      ? Number(rawBody.balancePendingAmount)
      : (finalQuotationAmount && advanceAmountPaid ? Math.max(0, finalQuotationAmount - advanceAmountPaid) : undefined);

    const notes = String(rawBody.specialRequirements || rawBody.notes || rawBody.description || '').trim();

    // Process Hotels (supports 1 to 6 hotels)
    const hotels = Array.isArray(rawBody.hotels) ? rawBody.hotels : [];
    const primaryHotel = hotels[0]?.hotelName || rawBody.hotelName || 'Handpicked Luxury Hotel';
    const primaryRoom = hotels[0]?.roomCategory || preferredRoomCategory;

    // Process Day Activities
    const dayActivities = Array.isArray(rawBody.dayActivities) ? rawBody.dayActivities : [];

    // Normalize for AI Generator
    const normalizedPayload = {
      destination,
      destinationType,
      hotelName: primaryHotel,
      roomCategory: primaryRoom,
      mealPlan,
      noOfDays,
      noOfNights,
      travelStyle,
      tripType,
      vehicleType,
      guests: numberOfGuests,
      adults,
      kids,
      startDate,
      endDate,
      duration,
      finalQuotationAmount,
      baseQuotationAmount,
      marginPercentage,
      perAdultPrice,
      perKidPrice,
      advanceAmountPaid,
      balancePendingAmount,
      notes,
      specialRequirements: notes,
      hotels,
      dayActivities,
      rawLeadData: {
        source: 'google-sheet',
        inquiryId,
        fullName,
        email,
        mobile,
        departureCity,
        destination,
        roomsCount: rawBody.roomsCount || 1,
        sharingType: rawBody.sharingType || 'Double Sharing',
        vegMealCount: rawBody.vegMealCount || 0,
        nonVegMealCount: rawBody.nonVegMealCount || 0,
        jainMealCount: rawBody.jainMealCount || 0,
        childrenDetails: rawBody.childrenDetails || [],
        hotels,
        dayActivities
      },
      normalized: {
        name: fullName,
        firstName,
        lastName,
        email,
        phone: mobile,
        destination,
        hotelName: primaryHotel,
        roomCategory: primaryRoom,
        mealPlan,
        guests: numberOfGuests,
        startDate,
        endDate,
        duration,
        travelStyle,
        tripType,
        noOfDays,
        noOfNights,
        inquiryId,
        notes,
        hotels,
        dayActivities
      }
    };

    // 1. Generate Complete AI Luxury Itinerary Content
    const aiContent = await generateItineraryContentWithAI(normalizedPayload);

    // 2. Generate Unique Secure Slug / ID for this option
    const uniqueId = generateLeadBasedItinerarySlug({
      leadName: fullName || firstName,
      optionNumber: optionNumber,
      destination: destination || aiContent.destination
    });

    // 3. Resolve Curated Destination Images
    const images = getLuxuryImagesForDestination(destination || aiContent.destination);

    // 4. Assemble Itinerary Document
    const itineraryDoc: ItineraryDocument = {
      id: uniqueId,
      slug: uniqueId,
      optionNumber: optionNumber,
      title: aiContent.title || `${noOfNights} Nights / ${noOfDays} Days ${destination} Tour Itinerary`,
      subTitle: travelStyle || aiContent.subTitle,
      description: aiContent.description,
      destination: destination || aiContent.destination,
      travelStyle: travelStyle || aiContent.travelStyle || 'Family Trip',
      tripType: tripType || aiContent.tripType || 'Customised Trip',
      noOfDays: noOfDays || aiContent.noOfDays || 5,
      noOfNights: noOfNights || aiContent.noOfNights || 4,
      inquiryId: inquiryId,
      zohoLeadId: zohoLeadId || undefined,
      hotelName: primaryHotel,
      roomCategory: primaryRoom,
      mealPlan: mealPlan || aiContent.mealPlan,
      finalQuotationAmount: aiContent.finalQuotationAmount || finalQuotationAmount,
      baseQuotationAmount,
      marginPercentage,
      perAdultPrice: aiContent.perAdultPrice || perAdultPrice,
      perKidPrice: aiContent.perKidPrice || perKidPrice,
      adults,
      kids,
      baseAmount: aiContent.baseAmount,
      gstPercentage: aiContent.gstPercentage || 5,
      tcsPercentage: aiContent.tcsPercentage || 0,
      gstAmount: aiContent.gstAmount,
      tcsAmount: aiContent.tcsAmount,
      advanceAmountPaid,
      balancePendingAmount,
      enableOnlineBooking: true,
      leadDetails: {
        name: fullName,
        firstName,
        lastName,
        email,
        phone: mobile,
        mobile,
        guests: numberOfGuests,
        startDate,
        endDate,
        duration,
        noOfDays,
        noOfNights,
        travelStyle,
        tripType,
        finalQuotationAmount: aiContent.finalQuotationAmount || finalQuotationAmount,
        baseQuotationAmount,
        marginPercentage,
        perAdultPrice: aiContent.perAdultPrice || perAdultPrice,
        perKidPrice: aiContent.perKidPrice || perKidPrice,
        adults,
        kids,
        baseAmount: aiContent.baseAmount,
        gstPercentage: aiContent.gstPercentage || 5,
        tcsPercentage: aiContent.tcsPercentage || 0,
        gstAmount: aiContent.gstAmount,
        tcsAmount: aiContent.tcsAmount,
        advanceAmountPaid,
        balancePendingAmount,
        preferredRoomCategory: primaryRoom,
        mealPlan,
        notes
      },
      stay: {
        hotelName: primaryHotel,
        roomCategory: primaryRoom,
        mealPlan: mealPlan || aiContent.mealPlan,
        amenities: aiContent.amenities,
        checkIn: '2:00 PM',
        checkOut: '11:00 AM'
      },
      highlights: aiContent.highlights,
      dayPlans: aiContent.dayPlans,
      inclusions: aiContent.inclusions,
      exclusions: aiContent.exclusions,
      amenities: aiContent.amenities,
      packingTips: aiContent.packingTips,
      importantNotes: aiContent.importantNotes,
      heroImage: images.hero,
      galleryImages: images.gallery,
      status: 'active',
      rawZohoData: {
        source: 'google-sheet',
        id: zohoLeadId || undefined,
        zohoLeadId: zohoLeadId || undefined,
        inquiryId,
        Inquiry_ID: inquiryId,
        Full_Name: fullName,
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Mobile: mobile,
        Departure_City: departureCity,
        Destination: destination,
        Vehicle_Type: vehicleType,
        Travel_Style: travelStyle,
        Trip_Type: tripType,
        Hotel_Name: primaryHotel,
        Room_Category: primaryRoom,
        Meal_Plan: mealPlan,
        Number_Of_Guest: numberOfGuests,
        Adults: adults,
        Kids: kids,
        No_of_Days: noOfDays,
        No_of_Nights: noOfNights,
        Travel_Start_Date: startDate,
        Travel_End_Date: endDate,
        Final_Quotation_Amount: aiContent.finalQuotationAmount || finalQuotationAmount,
        baseQuotationAmount,
        marginPercentage,
        Per_Adult_Price: aiContent.perAdultPrice || perAdultPrice,
        Per_Kid_Price: aiContent.perKidPrice || perKidPrice,
        hotels,
        dayActivities
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 5. Save or Update in MongoDB "itineraries" collection
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    let targetId = uniqueId;
    let existingDoc: ItineraryDocument | null = null;

    if (inquiryId) {
      const optionFilter: any = optionNumber === 1
        ? { $in: [1, '1', null, undefined] }
        : { $in: [optionNumber, String(optionNumber)] };

      existingDoc = await (collection as any).findOne({
        $and: [
          {
            $or: [
              { inquiryId: inquiryId },
              { 'rawZohoData.inquiryId': inquiryId },
              { 'rawZohoData.Inquiry_ID': inquiryId }
            ]
          },
          { optionNumber: optionFilter }
        ]
      });
    }

    if (existingDoc) {
      targetId = existingDoc.id || existingDoc.slug;
      itineraryDoc.id = targetId;
      itineraryDoc.slug = targetId;
      itineraryDoc.createdAt = existingDoc.createdAt || new Date();
      itineraryDoc.updatedAt = new Date();

      await (collection as any).replaceOne(
        { _id: (existingDoc as any)._id },
        itineraryDoc
      );
      console.log(`[Google Sheet Generate] Updated itinerary ID: ${targetId} for Inquiry: ${inquiryId} (Option ${optionNumber})`);
    } else {
      await (collection as any).insertOne(itineraryDoc);
      console.log(`[Google Sheet Generate] Created itinerary ID: ${uniqueId} for Inquiry: ${inquiryId} (Option ${optionNumber})`);
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://wanderphilia.com';
    const cleanOrigin = origin.replace(/\/$/, '');
    const relativeUrl = `/itinerary/${targetId}`;
    const publicUrl = `${cleanOrigin}${relativeUrl}`;

    return NextResponse.json(
      {
        success: true,
        message: existingDoc ? 'Luxury Itinerary updated successfully from Google Sheet data!' : 'Luxury Itinerary generated successfully from Google Sheet data!',
        id: targetId,
        slug: targetId,
        url: relativeUrl,
        publicUrl: publicUrl,
        optionNumber,
        updated: Boolean(existingDoc),
        data: {
          title: itineraryDoc.title,
          subTitle: itineraryDoc.subTitle,
          destination: itineraryDoc.destination,
          leadName: fullName,
          daysCount: itineraryDoc.dayPlans?.length || 0,
          quote: itineraryDoc.finalQuotationAmount
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Google Sheet Generate Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal error while generating itinerary from sheet data.'
      },
      { status: 500 }
    );
  }
}

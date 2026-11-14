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

    // Process Inclusions & Exclusions
    const customInclusions = Array.isArray(rawBody.inclusions) && rawBody.inclusions.length > 0
      ? rawBody.inclusions.map((s: any) => String(s).trim()).filter(Boolean)
      : undefined;
    const customExclusions = Array.isArray(rawBody.exclusions) && rawBody.exclusions.length > 0
      ? rawBody.exclusions.map((s: any) => String(s).trim()).filter(Boolean)
      : undefined;

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
      inclusions: customInclusions,
      exclusions: customExclusions,
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
        dayActivities,
        inclusions: customInclusions,
        exclusions: customExclusions
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

    const customHeroImage = rawBody.heroImage ? String(rawBody.heroImage).trim() : undefined;
    const customGalleryImages = Array.isArray(rawBody.galleryImages) && rawBody.galleryImages.length > 0
      ? rawBody.galleryImages.map((s: any) => String(s).trim()).filter(Boolean)
      : undefined;
    const resolvedHeroImage = customHeroImage || images.hero;
    const resolvedGalleryImages = (customGalleryImages && customGalleryImages.length >= 6)
      ? customGalleryImages.slice(0, 6)
      : (customGalleryImages && customGalleryImages.length > 0 ? [...customGalleryImages, ...images.gallery].slice(0, 6) : images.gallery);

    // Resolve Manual Day Plans if generated from Manual Itinerary Creation Mode
    const isManual = Boolean(rawBody.isManualItinerary || rawBody.creationMode === 'manual');
    let resolvedDayPlans = aiContent.dayPlans;
    let resolvedHighlights = aiContent.highlights;

    if (isManual && Array.isArray(rawBody.manualDayPlans) && rawBody.manualDayPlans.length > 0) {
      const totalDays = rawBody.manualDayPlans.length;

      resolvedDayPlans = rawBody.manualDayPlans.map((mdp: any, idx: number) => {
        const isFirstDay = idx === 0;
        const isLastDay = idx === totalDays - 1;
        const fromCity = String(mdp.fromCity || '').trim();
        const toCity = String(mdp.toCity || mdp.stayCity || mdp.city || '').trim();
        const isCityTransfer = fromCity && toCity && fromCity.toLowerCase() !== toCity.toLowerCase();
        const rawStops = Array.isArray(mdp.enRouteStops) ? mdp.enRouteStops : [];
        const enRouteStops = rawStops.map((s: any) => String(s).trim()).filter(Boolean);

        const rawPoints = Array.isArray(mdp.points) ? mdp.points : [];
        const cleanPoints = rawPoints.map((p: any) => String(p).trim()).filter(Boolean);

        // Meals String
        const mealsArr: string[] = [];
        if (mdp.breakfast) mealsArr.push('Breakfast');
        if (mdp.lunch) mealsArr.push('Lunch');
        if (mdp.dinner) mealsArr.push('Dinner');
        const mealsStr = mealsArr.join(', ') || 'No Meals Included';

        // Check for existing mentions to avoid redundant duplication
        const containsTerm = (terms: string[]) =>
          cleanPoints.some((p: string) => terms.some(t => p.toLowerCase().includes(t.toLowerCase())));

        const hasArrival = containsTerm(['arrive', 'arrival', 'airport', 'railway', 'station', 'welcome', 'meet and greet', 'landing']);
        const hasTransfer = containsTerm(['transfer to', 'drive to', 'proceed to', 'journey to', 'head towards', 'scenic drive', 'depart for', 'en route to']);
        const hasCheckIn = containsTerm(['check in', 'check-in', 'freshen up', 'settle into', 'settle in to']);
        const hasCheckOut = containsTerm(['check out', 'check-out', 'checkout']);
        const hasBreakfast = containsTerm(['breakfast', 'morning meal', 'relish breakfast', 'hearty breakfast']);
        const hasLunch = containsTerm(['lunch', 'afternoon meal', 'midday meal']);
        const hasDinner = containsTerm(['dinner', 'evening meal', 'lavish dinner', 'gourmet dinner', 'delicious dinner']);
        const hasDeparture = containsTerm(['departure', 'drop at airport', 'drop to airport', 'onward flight', 'onward journey', 'fly back', 'farewell']);
        const hasOvernight = containsTerm(['overnight stay', 'night stay', 'rest for the night', 'overnight in']);

        // Build dynamic synthesized timeline based on manual details
        const timeline: string[] = [];

        // 1. Morning, Arrival & Transfers
        if (isFirstDay) {
          if (!hasArrival) {
            timeline.push(`Arrive at the airport / railway station, meet and greet by our representative.`);
          }
          if (isCityTransfer && !hasTransfer) {
            const enRouteNote = enRouteStops.length > 0 ? ` with en-route stop at ${enRouteStops.join(', ')}` : '';
            timeline.push(`Comfortable transfer from ${fromCity} to ${toCity}${enRouteNote}.`);
          } else if (!isCityTransfer && toCity && !hasTransfer && !hasArrival) {
            timeline.push(`Smooth transfer to your hotel in ${toCity}.`);
          }
          if (!hasCheckIn && toCity) {
            timeline.push(`Check in to your hotel in ${toCity}, freshen up and relax after your journey.`);
          }
        } else {
          // Day 2..N Morning
          if (mdp.breakfast && !hasBreakfast) {
            if (isCityTransfer) {
              timeline.push(`Enjoy a delicious breakfast and complete hotel check-out formalities before departure.`);
            } else {
              timeline.push(`Relish a hearty breakfast at the hotel to energize for the day's experiences.`);
            }
          } else if (isCityTransfer && !hasCheckOut) {
            timeline.push(`Complete hotel check-out formalities in ${fromCity} and prepare for the onward journey.`);
          }

          if (isCityTransfer && !hasTransfer) {
            const enRouteNote = enRouteStops.length > 0 ? ` with en-route visits to ${enRouteStops.join(', ')}` : '';
            timeline.push(`Embark on a scenic drive from ${fromCity} towards ${toCity}${enRouteNote}.`);
          }
        }

        // 2. En-Route Stops (if not yet in timeline or cleanPoints)
        if (enRouteStops.length > 0) {
          enRouteStops.forEach((stop: string) => {
            if (!containsTerm([stop]) && !timeline.some(t => t.toLowerCase().includes(stop.toLowerCase()))) {
              timeline.push(`En route, visit and explore ${stop}.`);
            }
          });
        }

        // 3. Hotel Check-In for Transit Days
        if (!isFirstDay && isCityTransfer && !hasCheckIn && toCity) {
          timeline.push(`Arrive in ${toCity}, check in to your hotel, freshen up and unwind.`);
        }

        // 4. Sightseeing Points provided by user / AI
        cleanPoints.forEach((point: string) => {
          const cleaned = point.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '').trim();
          if (cleaned) {
            timeline.push(cleaned);
          }
        });

        // 5. Lunch (if enabled and not mentioned)
        if (mdp.lunch && !hasLunch) {
          timeline.push(`Enjoy a leisurely lunch at a local restaurant.`);
        }

        // 6. Dinner (if enabled and not mentioned)
        if (mdp.dinner && !hasDinner) {
          timeline.push(`In the evening, relish a delightful dinner at the hotel / local venue.`);
        }

        // 7. Evening / Stay / Departure
        if (isLastDay) {
          if (!hasDeparture) {
            timeline.push(`Check out from the hotel and enjoy a comfortable transfer to the airport / railway station for your onward journey.`);
          }
        } else {
          if (!hasOvernight && toCity) {
            timeline.push(`Overnight stay at the hotel in ${toCity}.`);
          }
        }

        // Title and narrative formatting
        const defaultTitle = isCityTransfer
          ? `${fromCity} → ${toCity}`
          : (toCity ? `${toCity} Sightseeing & Exploration` : `Day ${idx + 1}`);
        const dayTitle = mdp.title || defaultTitle;
        const dayDesc = cleanPoints.length > 0
          ? cleanPoints[0]
          : (isCityTransfer ? `Transfer from ${fromCity} to ${toCity}` : `Explore the highlights of ${toCity || destination}`);

        return {
          day: mdp.dayNumber || idx + 1,
          title: dayTitle,
          description: dayDesc,
          stayLocation: toCity || fromCity || '',
          meals: mealsStr,
          activities: cleanPoints.length > 0 ? cleanPoints.slice(0, 4) : [dayTitle],
          timeline: timeline.length > 0 ? timeline : [dayTitle]
        };
      });

      const customHighlights = rawBody.manualDayPlans
        .map((mdp: any) => mdp.title ? String(mdp.title).replace(/^Day\s*\d+\s*[|:–-]\s*/i, '').trim() : '')
        .filter(Boolean);
      if (customHighlights.length > 0) {
        resolvedHighlights = customHighlights.slice(0, 8);
      }
    }

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
      kidsDetails: rawBody.kidsDetails || rawBody.childrenDetails || [],
      childrenDetails: rawBody.childrenDetails || rawBody.kidsDetails || [],
      hotels,
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
        kidsDetails: rawBody.kidsDetails || rawBody.childrenDetails || [],
        childrenDetails: rawBody.childrenDetails || rawBody.kidsDetails || [],
        hotels,
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
      highlights: resolvedHighlights,
      dayPlans: resolvedDayPlans,
      inclusions: customInclusions || aiContent.inclusions,
      exclusions: customExclusions || aiContent.exclusions,
      amenities: aiContent.amenities,
      packingTips: aiContent.packingTips,
      importantNotes: aiContent.importantNotes,
      flightQuotations: Array.isArray(rawBody.flightQuotations) && rawBody.flightQuotations.length > 0
        ? rawBody.flightQuotations
        : (Array.isArray(rawBody.flights) && rawBody.flights.length > 0 ? rawBody.flights : undefined),
      hotelCostDetails: rawBody.hotelCostDetails || undefined,
      hotelQuotations: Array.isArray(rawBody.hotelQuotations) ? rawBody.hotelQuotations : undefined,
      heroImage: resolvedHeroImage,
      galleryImages: resolvedGalleryImages,
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
        heroImage: resolvedHeroImage,
        galleryImages: resolvedGalleryImages,
        flightQuotations: Array.isArray(rawBody.flightQuotations) && rawBody.flightQuotations.length > 0
          ? rawBody.flightQuotations
          : (Array.isArray(rawBody.flights) && rawBody.flights.length > 0 ? rawBody.flights : undefined),
        hotelCostDetails: rawBody.hotelCostDetails || undefined,
        hotelQuotations: Array.isArray(rawBody.hotelQuotations) ? rawBody.hotelQuotations : undefined,
        Hotel_Name: primaryHotel,
        Room_Category: primaryRoom,
        Meal_Plan: mealPlan,
        Number_Of_Guest: numberOfGuests,
        Adults: adults,
        Kids: kids,
        kidsDetails: rawBody.kidsDetails || rawBody.childrenDetails || [],
        childrenDetails: rawBody.childrenDetails || rawBody.kidsDetails || [],
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
        dayActivities,
        isManualItinerary: isManual,
        creationMode: isManual ? 'manual' : 'sheet',
        dayPlans: resolvedDayPlans,
        manualDayPlans: rawBody.manualDayPlans || undefined,
        inclusions: customInclusions || aiContent.inclusions,
        exclusions: customExclusions || aiContent.exclusions
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

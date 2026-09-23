import { ItineraryDayPlan, ItineraryDocument } from '@/types/itinerary';

export interface GeneratedItineraryContent {
  title: string;
  subTitle: string; // Catchy 1-3 words (e.g., "Desert Tent", "Luxury Suite")
  description: string; // Strict one-liner luxury description (NO prices, NO time durations)
  destination: string;
  hotelName: string;
  roomCategory: string;
  mealPlan: string;
  highlights: string[];
  dayPlans: ItineraryDayPlan[];
  inclusions: string[];
  exclusions: string[];
  amenities: string[];
  packingTips?: string[];
  importantNotes?: string[];
  heroImage?: string;
  galleryImages?: string[];
}

/**
 * Clean and sanitize description to strictly ensure NO prices or time durations leak in.
 */
export function sanitizeLuxuryDescription(desc: string): string {
  if (!desc) return '';
  let cleaned = desc.trim();

  // Remove quotes if AI wrapped it
  cleaned = cleaned.replace(/^["']|["']$/g, '');

  // Remove explicit currency/price mentions (₹, INR, Rs., $, USD, etc.)
  cleaned = cleaned.replace(/(?:₹|INR|Rs\.?|\$|USD|EUR|GBP)\s*[\d,]+(?:\.\d+)?/gi, '');
  cleaned = cleaned.replace(/starting (?:at|from)\s*[\d,]+/gi, '');
  cleaned = cleaned.replace(/\b\d+\s*(?:rupees|dollars|euros|inr)\b/gi, '');

  // Remove explicit time duration phrases (e.g., "30-minute", "30 mins", "2 hours", "5-day", "4 nights")
  cleaned = cleaned.replace(/\b\d+[\s-]*(?:minute|min|mins|hour|hr|hrs|day|days|night|nights|week|weeks)\b(?:[\s-]*long)?/gi, '');
  cleaned = cleaned.replace(/\b\d+D\/?\d+N\b/gi, '');

  // Clean up double spaces or awkward leftover punctuation
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?:;])/g, '$1').trim();

  // Ensure it ends with a single clean period
  if (cleaned && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  return cleaned;
}

/**
 * Sanitize subTitle to strictly 1-3 words
 */
export function sanitizeSubTitle(subTitle: string, fallback: string = 'Luxury Suite'): string {
  if (!subTitle) return fallback;
  const words = subTitle.replace(/[^\w\s-]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return fallback;
  return words.slice(0, 3).join(' ');
}

/**
 * Intelligent luxury fallback generator if AI API is temporarily unavailable
 */
export function generateLuxuryFallback(raw: Record<string, any>): GeneratedItineraryContent {
  const dest = raw.destination || raw.Destination || raw.Destinations || raw.city || 'Exotic Destination';
  const hotel = raw.hotelName || raw.Hotel_Name || raw.Hotel || raw.stay || 'Curated 5-Star Luxury Resort';
  const room = raw.roomCategory || raw.Room_Category || raw.Room_Type || raw.Room || 'Royal Luxury Suite';
  const guests = raw.guests || raw.Number_Of_Guest || raw.Number_Of_Guests || 2;
  const duration = raw.duration || raw.Days || raw.days || 4;

  const defaultSubTitle = sanitizeSubTitle(room || hotel || 'Luxury Suite');
  const defaultDesc = sanitizeLuxuryDescription(
    `Indulge in an exclusive private journey through ${dest}, featuring handpicked 5-star hospitality, bespoke cultural encounters, and breathtaking scenic splendor.`
  );

  const dayPlans: ItineraryDayPlan[] = [];
  const numDays = Math.max(3, Math.min(Number(duration) || 4, 10));

  for (let i = 1; i <= numDays; i++) {
    if (i === 1) {
      dayPlans.push({
        day: 1,
        title: `Arrival in ${dest} & Royal Welcome`,
        description: `Arrive in ${dest} where your private chauffeur welcomes you. Transfer seamlessly to ${hotel}, check into your ${room}, and unwind with high tea as the sun sets.`,
        stayLocation: `${hotel}, ${dest}`,
        meals: 'Welcome Refreshments & Royal Dinner',
        activities: ['Private Chauffeur Airport Transfer', 'VIP Express Check-in', 'Sunset Welcome High Tea', 'Gourmet Dinner Experience']
      });
    } else if (i === numDays) {
      dayPlans.push({
        day: i,
        title: `Leisure Morning & Scenic Farewell`,
        description: `Savor a lavish gourmet breakfast overlooking pristine landscapes. Enjoy leisurely boutique shopping and souvenir exploration before your private transfer to the departure terminal.`,
        stayLocation: `${dest}`,
        meals: 'Artisanal Breakfast',
        activities: ['Gourmet Breakfast with Panoramic Views', 'Boutique Handicraft Exploration', 'Private Chauffeur Transfer to Airport/Station']
      });
    } else {
      dayPlans.push({
        day: i,
        title: `Curated Sightseeing & Bespoke Experiences in ${dest}`,
        description: `Immerse yourself in the most iconic architectural landmarks, private guided cultural heritage walks, and handpicked local gastronomy tailored exclusively for you.`,
        stayLocation: `${hotel}, ${dest}`,
        meals: 'Breakfast & Chef-Curated Dinner',
        activities: ['Private Guided Heritage Exploration', 'Scenic Photography Stops', 'Exclusive Local Cultural Immersion', 'Candlelit Evening Dinner']
      });
    }
  }

  return {
    title: `Exclusive Luxury Escape to ${dest}`,
    subTitle: defaultSubTitle,
    description: defaultDesc,
    destination: dest,
    hotelName: hotel,
    roomCategory: room,
    mealPlan: raw.mealPlan || raw.Meal_Plan || 'Breakfast & Dinner (MAP Plan)',
    highlights: [
      `Stay in handcrafted luxury at ${hotel} (${room})`,
      `Chauffeured travel in dedicated private luxury AC vehicle`,
      `VIP access & personalized storytelling by certified heritage guides`,
      `Chef-curated dinners celebrating authentic regional delicacies`,
      `24/7 dedicated Wanderphilia concierge support on WhatsApp`
    ],
    dayPlans,
    inclusions: [
      `Premium accommodation in ${room} at ${hotel}`,
      `Daily gourmet breakfast and chef-special dinner`,
      `Dedicated private chauffeur-driven AC transport for all transfers and sightseeing`,
      `Complimentary VIP welcome drinks and fruit basket on arrival`,
      `All toll taxes, parking fees, driver allowances, and fuel charges`,
      `24/7 round-the-clock on-trip Concierge and local assistance`
    ],
    exclusions: [
      `Airfare or train fare unless explicitly booked`,
      `Personal expenses (laundry, telephone calls, alcoholic beverages, mini-bar)`,
      `Entry tickets to monuments not mentioned in inclusions`,
      `Any travel insurance or medical expenses`,
      `Anything not explicitly listed in the inclusions`
    ],
    amenities: [
      'Complimentary High-Speed Wi-Fi',
      'Infinity Swimming Pool & Spa Access',
      '24-Hour In-Room In-Dining Service',
      'Personalized Welcome Amenities',
      'Daily Housekeeping & Turn-Down Service',
      'Panoramic Balcony / Garden Views'
    ],
    packingTips: [
      'Light comfortable cotton wear for day tours',
      'A warm jacket or shawl for cool evenings and air-conditioned travel',
      'Comfortable walking shoes for heritage monuments',
      'Sunscreen, UV sunglasses, and a camera for scenic shots'
    ],
    importantNotes: [
      'Standard check-in time is 2:00 PM and check-out is 11:00 AM.',
      'A valid government-approved Photo ID is required for all guests at check-in.',
      'Early check-in and late check-out are subject to hotel availability.'
    ]
  };
}

/**
 * Generate complete luxury travel itinerary content using Groq / OpenAI / Gemini
 */
export async function generateItineraryContentWithAI(rawZohoData: Record<string, any>): Promise<GeneratedItineraryContent> {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI Itinerary] No AI API Key found in environment. Using high-end luxury fallback generator.');
    return generateLuxuryFallback(rawZohoData);
  }

  const promptData = {
    guestName: rawZohoData.leadName || rawZohoData.Full_Name || (rawZohoData.First_Name ? `${rawZohoData.First_Name || ''} ${rawZohoData.Last_Name || ''}`.trim() : rawZohoData.name || 'Valued Guest'),
    inquiryId: rawZohoData.inquiryId || rawZohoData.Inquiry_ID || '',
    destination: rawZohoData.destinations || rawZohoData.destination || rawZohoData.Destination || rawZohoData.Destinations || rawZohoData.city || 'Rajasthan',
    destinationType: rawZohoData.destinationType || rawZohoData.Destination_Type || 'India',
    travelStyle: rawZohoData.travelStyle || rawZohoData.Travel_Style || 'Family Trip',
    roomCategory: rawZohoData.preferredRoomCategory || rawZohoData.Preferred_Room_Category || rawZohoData.roomCategory || rawZohoData.Room_Category || 'Deluxe',
    mealPlan: rawZohoData.mealPlan || rawZohoData.Meal_Plan || 'Breakfast & Dinner',
    duration: rawZohoData.noOfDays ? `${rawZohoData.noOfDays} Days / ${rawZohoData.noOfNights || rawZohoData.noOfDays - 1} Nights` : rawZohoData.duration || rawZohoData.Days || '5 Days / 4 Nights',
    guests: rawZohoData.numberOfGuests || rawZohoData.Number_Of_Guest || rawZohoData.Number_Of_Guests || 2,
    startDate: rawZohoData.travelStartDate || rawZohoData.Preferred_Start_date || rawZohoData.Start_Date || '',
    endDate: rawZohoData.travelEndDate || rawZohoData.Travel_End_Date || rawZohoData.End_Date || '',
    hotels: rawZohoData.hotels && rawZohoData.hotels.length > 0 ? rawZohoData.hotels : (rawZohoData.hotelName ? [{ hotelName: rawZohoData.hotelName, city: rawZohoData.destination }] : []),
    dayActivities: rawZohoData.dayActivities && rawZohoData.dayActivities.length > 0 ? rawZohoData.dayActivities : [],
    notes: rawZohoData.notes || rawZohoData.message || rawZohoData.Description || rawZohoData.Specific_Requirements || ''
  };

  const systemPrompt = `You are the Master Travel Curator & Luxury Copywriter for "Wanderphilia" (a high-end luxury experiential travel brand akin to Thrillophilia Luxe / Aman / Relais & Châteaux).

Your task is to take incoming raw lead/booking data from Zoho CRM (including multi-hotel stays and the day-by-day "Activities and Experiences" subform) and generate a COMPLETE, evocative, world-class luxury itinerary template in strictly valid JSON format.

CRITICAL MANDATORY RULES:
1. "subTitle": MUST be a very short, catchy 1 to 3 word luxury title/theme (e.g., "Desert Tent", "Luxury Suite", "Royal Palace", "Himalayan Villa", "Overwater Haven"). Maximum 3 words!
2. "description": MUST be a strict, clean, professional ONE-LINER luxury description summarizing the bespoke holiday experience.
   - ABSOLUTE PROHIBITION: Under NO circumstances should you include ANY prices/amounts (e.g. ₹500, Rs. 10000, $, USD, free, per person) OR ANY time durations (e.g. 30-minute, 2-hour, 5-day, 4-night, 30 mins) in the description!
   - Focus on pure elegance, scenic beauty, royal comfort, bespoke luxury stays, and seamless private hospitality. Exactly 1 sentence.
3. "title": A grand, evocative luxury trip title (e.g., "Bespoke Royal Heritage Escape to Jodhpur & Jaipur").
4. "highlights": An array of 4 to 6 compelling luxury highlights.
5. "dayPlans": An array of detailed day objects structured as a sequential FLOW-CHART TIMELINE so the client clearly understands what they will do step-by-step from morning to night. Each day must contain:
   - "day": integer (1, 2, 3...)
   - "title": A comprehensive, compelling day headline summarizing the day's key experiences (e.g., "Jodhpur Arrival, Rao Jodha Desert Rock Park & Sunset Boating at Kalyana Lake")
   - "description": 2-3 sentences of rich sensory storytelling explaining the day's highlights
   - "stayLocation": hotel and city name (e.g., "Amit Residensy, Jodhpur")
   - "meals": meal description (e.g., "Artisanal Breakfast & Royal Dinner")
   - "activities": array of 3-4 key curated activity bullet points from the Zoho experiences
   - "timeline": array of 4 to 6 sequential, chronological flowchart milestones from morning to night (e.g., ["Arrive at Jodhpur Airport/Station, meet your private chauffeur, and transfer to your hotel.", "Check-in at Amit Residensy and refresh with welcome amenities.", "Embark on a guided exploration of the dramatic Rao Jodha Desert Rock Park with a certified heritage guide.", "Enjoy a relaxed sunset boating experience on the calm waters of Kalyana Lake.", "Evening at leisure exploring the vibrant local clock tower markets.", "Overnight stay at Amit Residensy, Jodhpur."])
6. "inclusions": 5 to 7 high-end inclusions.
7. "exclusions": 4 to 5 standard exclusions.
8. "amenities": 5 to 6 luxury hotel/room amenities.
9. "packingTips": 3 to 4 destination-tailored packing suggestions.
10. "importantNotes": 3 essential travel notes.

OUTPUT FORMAT:
Output ONLY valid, parseable JSON with NO markdown code fences, NO explanation, NO comments. Follow this schema exactly:
{
  "title": "...",
  "subTitle": "1-3 words",
  "description": "One sentence luxury description without any prices or time durations.",
  "destination": "...",
  "hotelName": "...",
  "roomCategory": "...",
  "mealPlan": "...",
  "highlights": ["..."],
  "dayPlans": [
    {
      "day": 1,
      "title": "...",
      "description": "...",
      "stayLocation": "...",
      "meals": "...",
      "activities": ["..."],
      "timeline": [
        "Milestone 1 (Morning / Arrival)...",
        "Milestone 2 (Check-in / Transit)...",
        "Milestone 3 (Sightseeing / Activity 1)...",
        "Milestone 4 (Activity 2 / Leisure)...",
        "Milestone 5 (Evening highlight / Dining)...",
        "Milestone 6 (Overnight stay)..."
      ]
    }
  ],
  "inclusions": ["..."],
  "exclusions": ["..."],
  "amenities": ["..."],
  "packingTips": ["..."],
  "importantNotes": ["..."]
}`;

  const userPrompt = `Here is the raw data from Zoho CRM:
${JSON.stringify(promptData, null, 2)}

Generate the complete luxury itinerary template JSON now.`;

  try {
    let rawJsonResponse = '';

    // Check if Groq API is available (preferred, ultra-fast)
    if (process.env.GROQ_API_KEY) {
      const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
      let lastErr: any = null;

      for (const model of groqModels) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.6,
              max_tokens: 3500,
            }),
          });

          if (groqResponse.ok) {
            const groqData = await groqResponse.json();
            rawJsonResponse = groqData.choices?.[0]?.message?.content || '';
            if (rawJsonResponse) break;
          } else {
            lastErr = await groqResponse.text();
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (!rawJsonResponse && lastErr) {
        console.warn('[Groq API Attempt Failed]:', lastErr);
      }
    }

    if (!rawJsonResponse && process.env.OPENAI_API_KEY) {
      // OpenAI Fallback
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        rawJsonResponse = openaiData.choices?.[0]?.message?.content || '';
      }
    }

    if (!rawJsonResponse) {
      throw new Error('Empty response from AI API');
    }

    // Clean JSON if needed
    const cleanedJsonStr = rawJsonResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed: GeneratedItineraryContent = JSON.parse(cleanedJsonStr);

    // Apply strict sanitizations on critical fields
    parsed.subTitle = sanitizeSubTitle(parsed.subTitle || promptData.roomCategory);
    parsed.description = sanitizeLuxuryDescription(parsed.description);

    // Ensure all mandatory arrays exist
    parsed.destination = parsed.destination || promptData.destination;
    parsed.hotelName = parsed.hotelName || (promptData.hotels?.[0]?.hotelName || 'Curated 5-Star Luxury Resort');
    parsed.roomCategory = parsed.roomCategory || promptData.roomCategory;
    parsed.mealPlan = parsed.mealPlan || promptData.mealPlan;
    parsed.highlights = Array.isArray(parsed.highlights) && parsed.highlights.length > 0 ? parsed.highlights : [
      `Stay in handcrafted luxury at ${parsed.hotelName}`,
      `Private luxury AC chauffeur for entire journey`,
      `Curated heritage storytelling & personalized experiences`
    ];
    parsed.dayPlans = Array.isArray(parsed.dayPlans) && parsed.dayPlans.length > 0 ? parsed.dayPlans : generateLuxuryFallback(rawZohoData).dayPlans;
    parsed.inclusions = Array.isArray(parsed.inclusions) && parsed.inclusions.length > 0 ? parsed.inclusions : generateLuxuryFallback(rawZohoData).inclusions;
    parsed.exclusions = Array.isArray(parsed.exclusions) && parsed.exclusions.length > 0 ? parsed.exclusions : generateLuxuryFallback(rawZohoData).exclusions;
    parsed.amenities = Array.isArray(parsed.amenities) && parsed.amenities.length > 0 ? parsed.amenities : generateLuxuryFallback(rawZohoData).amenities;

    return parsed;
  } catch (error) {
    console.error('[AI Generation Failed, using Luxury Fallback]:', error);
    return generateLuxuryFallback(rawZohoData);
  }
}

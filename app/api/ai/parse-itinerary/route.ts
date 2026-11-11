import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeParsedData(raw: any) {
  if (!raw || typeof raw !== 'object') return {};

  const get = (key: string, altKey?: string) => {
    if (raw[key] !== undefined) return raw[key];
    if (altKey && raw[altKey] !== undefined) return raw[altKey];
    const keyLower = key.toLowerCase();
    for (const k of Object.keys(raw)) {
      if (k.toLowerCase() === keyLower) return raw[k];
      if (altKey && k.toLowerCase() === altKey.toLowerCase()) return raw[k];
    }
    return undefined;
  };

  const title = get('title') || '';
  const destination = get('destination') || '';
  const rawTripType = String(get('tripType') || 'India').toLowerCase();
  const tripType: 'India' | 'International' =
    rawTripType.includes('intl') || rawTripType.includes('international') ? 'International' : 'India';

  const rawTourType = String(get('tourType') || 'Group').toLowerCase();
  const tourType: 'Group' | 'Customized' = rawTourType.includes('custom') ? 'Customized' : 'Group';

  const durationObj = get('duration') || {};
  let durationDays = Number(get('durationDays') || durationObj.durationDays || durationObj.days) || 0;
  let durationNights = Number(get('durationNights') || durationObj.durationNights || durationObj.nights) || 0;

  const rawDayPlans = get('dayPlans') || get('itinerary') || [];
  const dayPlans = Array.isArray(rawDayPlans)
    ? rawDayPlans.map((dp: any, idx: number) => ({
        day: Number(dp.day || dp.Day || idx + 1),
        title: dp.title || dp.Title || `Day ${dp.day || idx + 1}`,
        city: dp.city || dp.City || '',
        stayHotel: dp.stayHotel || dp.StayHotel || dp.hotel || dp.Hotel || '',
        meals: {
          breakfast: Boolean(dp.meals?.breakfast ?? dp.Meals?.breakfast),
          lunch: Boolean(dp.meals?.lunch ?? dp.Meals?.lunch),
          dinner: Boolean(dp.meals?.dinner ?? dp.Meals?.dinner ?? true)
        },
        timeline: Array.isArray(dp.timeline || dp.Timeline)
          ? (dp.timeline || dp.Timeline).filter((t: any) => typeof t === 'string' && t.trim().length > 0)
          : typeof dp.description === 'string'
          ? dp.description.split(/\n|\.\s+/).filter(Boolean)
          : []
      }))
    : [];

  if (!durationDays && dayPlans.length > 0) {
    durationDays = dayPlans.length;
  }
  if (!durationNights && durationDays > 0) {
    durationNights = Math.max(1, durationDays - 1);
  }
  if (durationDays === 0) durationDays = 5;
  if (durationNights === 0) durationNights = 4;

  const pricingObj = get('pricing') || {};
  const rawPrice = get('price') || pricingObj.basePrice || pricingObj.price || 0;
  const price = typeof rawPrice === 'number' ? rawPrice : parseInt(String(rawPrice).replace(/\D+/g, ''), 10) || 0;

  let rawPricingOptions = get('pricingOptions') || pricingObj.pricingOptions || [];
  if (!Array.isArray(rawPricingOptions) || rawPricingOptions.length === 0) {
    if (price > 0) {
      rawPricingOptions = [{ label: 'Double Sharing Basis', defaultPrice: String(price), checked: true }];
    } else {
      rawPricingOptions = [
        { label: 'Double Sharing Basis', defaultPrice: '24999', checked: true },
        { label: 'Triple Sharing Basis', defaultPrice: '21999', checked: true }
      ];
    }
  }

  const pricingOptions = rawPricingOptions.map((po: any) => ({
    label: po.label || 'Sharing Basis',
    defaultPrice: String(po.defaultPrice || po.price || price || '0').replace(/[^\d]/g, '') || '0',
    checked: po.checked !== false
  }));

  const rawHotels = get('hotelStays') || get('hotels') || [];
  const hotelStays = Array.isArray(rawHotels)
    ? rawHotels.map((h: any) => ({
        city: h.city || h.City || '',
        nights: Number(h.nights || h.Nights || 1),
        category: h.category || h.Category || 'Deluxe',
        hotelName: h.hotelName || h.HotelName || h.name || h.Name || '',
        roomCategory: h.roomCategory || h.RoomCategory || 'Deluxe Room'
      }))
    : [];

  const inclusions = Array.isArray(get('inclusions') || get('included'))
    ? get('inclusions') || get('included')
    : [];
  const exclusions = Array.isArray(get('exclusions') || get('notIncluded'))
    ? get('exclusions') || get('notIncluded')
    : [];
  const highlights = Array.isArray(get('highlights')) ? get('highlights') : [];

  const rawBatches = get('batchDates') || get('batches') || [];
  const batchDates = Array.isArray(rawBatches)
    ? rawBatches.map((b: any) => ({
        month: b.month || b.Month || 'Upcoming',
        ranges: Array.isArray(b.ranges || b.Ranges) ? b.ranges || b.Ranges : []
      }))
    : [];

  const rawDifficulty = String(get('difficulty') || 'Moderate').toLowerCase();
  let difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Easy to Moderate' = 'Moderate';
  if (rawDifficulty.includes('easy to mod')) difficulty = 'Easy to Moderate';
  else if (rawDifficulty.includes('easy')) difficulty = 'Easy';
  else if (rawDifficulty.includes('hard') || rawDifficulty.includes('diff')) difficulty = 'Hard';

  const groupSize = Number(get('groupSize') || 15);
  const description = get('description') || '';
  const route = get('route') || '';
  const staySummary = get('staySummary') || '';
  const vehicleType = get('vehicleType') || 'AC Innova Crysta / Tempo Traveller';
  const mealPlan = get('mealPlan') || 'Breakfast & Dinner';

  return {
    title,
    destination,
    tripType,
    tourType,
    durationDays,
    durationNights,
    price: price || (pricingOptions[0] ? parseInt(pricingOptions[0].defaultPrice, 10) : 19999),
    pricingOptions,
    difficulty,
    groupSize,
    description,
    route,
    staySummary,
    highlights,
    dayPlans,
    hotelStays,
    inclusions,
    exclusions,
    batchDates,
    vehicleType,
    mealPlan
  };
}

/**
 * POST /api/ai/parse-itinerary
 * Parses raw unstructured itinerary write-up text into structured JSON using Groq AI.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 15) {
      return NextResponse.json(
        { success: false, error: 'Please provide itinerary write-up text (minimum 15 characters).' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Groq API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert travel data extraction AI for Wanderphilia.
Extract structured trip details from the provided raw itinerary write-up into a complete, clean, production-ready JSON object.
Extract exact information wherever present in the text:
1. title: Full tour package title
2. destination: Primary destination (e.g. Rajasthan, Spiti Valley, Ladakh, Meghalaya, Kashmir, Vietnam, Thailand, Bali, etc.)
3. tripType: "India" or "International"
4. tourType: "Group" or "Customized"
5. durationDays: number of days
6. durationNights: number of nights
7. price: starting numeric price
8. pricingOptions: array of { label: string, defaultPrice: string, checked: boolean }
9. difficulty: "Easy", "Moderate", "Hard", or "Easy to Moderate"
10. groupSize: max group size number (default 15)
11. description: 2-3 sentence engaging overview
12. route: "City1 → City2 → City3"
13. staySummary: "2N City1 • 1N City2"
14. highlights: string[] of 4-8 top highlights
15. dayPlans: array of { day: number, title: string, city: string, stayHotel: string, meals: { breakfast: boolean, lunch: boolean, dinner: boolean }, timeline: string[] }
16. hotelStays: array of { city: string, nights: number, category: string, hotelName: string, roomCategory: string }
17. inclusions: string[]
18. exclusions: string[]
19. batchDates: array of { month: string, ranges: string[] }
20. vehicleType: string
21. mealPlan: string

Return ONLY valid JSON. No markdown ticks, no preamble.`;

    const userPrompt = `Extract this raw itinerary write-up into structured JSON:\n\n${text.trim()}`;

    let parsedResult: any = null;
    let lastError: any = null;

    // Try Groq Models
    if (process.env.GROQ_API_KEY) {
      const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

      for (const model of groqModels) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.15
            })
          });

          if (res.ok) {
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content || '';
            if (content) {
              parsedResult = JSON.parse(content);
              if (parsedResult) break;
            }
          } else {
            lastError = await res.text();
          }
        } catch (e: any) {
          lastError = e?.message || e;
        }
      }
    }

    // Fallback to OpenAI if Groq was not available or failed
    if (!parsedResult && process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            parsedResult = JSON.parse(content);
          }
        }
      } catch (e: any) {
        lastError = e?.message || e;
      }
    }

    if (!parsedResult) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse itinerary write-up: ' + (lastError || 'Unknown AI error') },
        { status: 500 }
      );
    }

    const normalized = normalizeParsedData(parsedResult);

    return NextResponse.json({
      success: true,
      data: normalized
    });
  } catch (error: any) {
    console.error('[AI Parse Itinerary Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while parsing itinerary.' },
      { status: 500 }
    );
  }
}

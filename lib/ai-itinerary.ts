import { ItineraryDayPlan } from '@/types/itinerary';
import { ZohoDayActivity, ZohoHotelStay, ZohoExperienceItem } from './zoho-fetch';

export interface GeneratedItineraryContent {
  title: string;
  subTitle: string; // Catchy 1-3 words (e.g., "Desert Tent", "Luxury Suite")
  description: string; // Strict one-liner luxury description (NO prices, NO time durations)
  destination: string;
  travelStyle?: string;
  tripType?: string;
  noOfDays?: number;
  noOfNights?: number;
  hotelName: string;
  roomCategory: string;
  mealPlan: string;
  finalQuotationAmount?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
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
 * Detects if trip is International or Indian based on destination name or destination type
 */
export function isInternationalTrip(destination: string = '', destinationType: string = ''): boolean {
  const typeStr = destinationType.toLowerCase();
  if (typeStr.includes('international') || typeStr.includes('outbound') || typeStr.includes('abroad')) {
    return true;
  }
  if (typeStr.includes('india') || typeStr.includes('domestic') || typeStr.includes('inbound')) {
    return false;
  }

  const intlKeywords = [
    'bali', 'indonesia', 'thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'samui', 'singapore',
    'malaysia', 'kuala lumpur', 'langkawi', 'vietnam', 'hanoi', 'da nang', 'hoi an', 'saigon',
    'dubai', 'uae', 'abu dhabi', 'maldives', 'mauritius', 'sri lanka', 'colombo', 'kandy', 'bentota',
    'bhutan', 'paro', 'thimphu', 'punakha', 'nepal', 'kathmandu', 'pokhara', 'turkey', 'istanbul',
    'cappadocia', 'georgia', 'tbilisi', 'baku', 'azerbaijan', 'kazakhstan', 'almaty', 'uzbekistan',
    'tashkent', 'samarkand', 'europe', 'paris', 'france', 'switzerland', 'zurich', 'lucerne', 'interlaken',
    'italy', 'rome', 'venice', 'florence', 'greece', 'athens', 'santorini', 'london', 'uk', 'scotland',
    'usa', 'new york', 'california', 'japan', 'tokyo', 'kyoto', 'osaka', 'australia', 'sydney', 'melbourne',
    'new zealand', 'auckland', 'queenstown', 'egypt', 'cairo', 'south africa', 'cape town', 'kenya', 'tanzania', 'seychelles'
  ];

  const destLower = destination.toLowerCase();
  return intlKeywords.some(k => destLower.includes(k));
}

/**
 * Route transit distance and duration table for popular tourist circuits
 */
const KNOWN_ROUTES: Record<string, { km: number; duration: string; mode?: string }> = {
  // Rajasthan
  'jaipur|ranthambore': { km: 160, duration: '3.5 - 4 Hrs' },
  'jaipur|sawai madhopur': { km: 160, duration: '3.5 - 4 Hrs' },
  'ranthambore|agra': { km: 260, duration: '5.5 - 6 Hrs' },
  'sawai madhopur|agra': { km: 260, duration: '5.5 - 6 Hrs' },
  'jaipur|agra': { km: 240, duration: '4.5 - 5 Hrs' },
  'delhi|agra': { km: 230, duration: '3.5 - 4 Hrs' },
  'delhi|jaipur': { km: 280, duration: '5 - 5.5 Hrs' },
  'agra|delhi': { km: 230, duration: '3.5 - 4 Hrs' },
  'jaipur|jodhpur': { km: 330, duration: '5.5 - 6 Hrs' },
  'jodhpur|jaisalmer': { km: 285, duration: '4.5 - 5 Hrs' },
  'jaisalmer|bikaner': { km: 330, duration: '5.5 - 6 Hrs' },
  'bikaner|jaipur': { km: 330, duration: '5.5 - 6 Hrs' },
  'jodhpur|udaipur': { km: 250, duration: '4.5 - 5 Hrs' },
  'jaipur|udaipur': { km: 395, duration: '6.5 - 7 Hrs' },
  'udaipur|mount abu': { km: 165, duration: '3 - 3.5 Hrs' },
  'mount abu|ahmedabad': { km: 225, duration: '4.5 - 5 Hrs' },
  'jaipur|pushkar': { km: 145, duration: '2.5 - 3 Hrs' },
  'jaipur|ajmer': { km: 135, duration: '2.5 Hrs' },
  'pushkar|jodhpur': { km: 185, duration: '3.5 - 4 Hrs' },
  'udaipur|kumbhalgarh': { km: 85, duration: '2 - 2.5 Hrs' },
  'kumbhalgarh|ranakpur': { km: 50, duration: '1.5 Hrs' },
  'ranakpur|jodhpur': { km: 155, duration: '3 Hrs' },
  'ranakpur|udaipur': { km: 95, duration: '2 Hrs' },
  // Uttarakhand & Himachal
  'delhi|rishikesh': { km: 240, duration: '4.5 - 5 Hrs' },
  'delhi|haridwar': { km: 220, duration: '4 - 4.5 Hrs' },
  'haridwar|rishikesh': { km: 25, duration: '45 Mins' },
  'rishikesh|mussoorie': { km: 75, duration: '2.5 Hrs' },
  'dehradun|mussoorie': { km: 35, duration: '1.5 Hrs' },
  'delhi|nainital': { km: 300, duration: '6.5 - 7 Hrs' },
  'nainital|corbett': { km: 65, duration: '2 Hrs' },
  'delhi|corbett': { km: 245, duration: '5 - 5.5 Hrs' },
  'delhi|shimla': { km: 350, duration: '7 - 8 Hrs' },
  'chandigarh|shimla': { km: 115, duration: '3.5 - 4 Hrs' },
  'shimla|manali': { km: 250, duration: '7 - 8 Hrs' },
  'manali|dharamshala': { km: 215, duration: '6.5 - 7 Hrs' },
  'dharamshala|dalhousie': { km: 120, duration: '4 Hrs' },
  'dalhousie|amritsar': { km: 200, duration: '4.5 - 5 Hrs' },
  'manali|chandigarh': { km: 290, duration: '7.5 - 8.5 Hrs' },
  'delhi|manali': { km: 530, duration: '11 - 12 Hrs' },
  // Kashmir & Ladakh
  'srinagar|gulmarg': { km: 50, duration: '1.5 - 2 Hrs' },
  'srinagar|pahalgam': { km: 90, duration: '2.5 - 3 Hrs' },
  'pahalgam|srinagar': { km: 90, duration: '2.5 - 3 Hrs' },
  'srinagar|sonmarg': { km: 80, duration: '2.5 Hrs' },
  'srinagar|doodhpathri': { km: 45, duration: '1.5 Hrs' },
  'leh|nubra valley': { km: 160, duration: '5 - 6 Hrs' },
  'nubra valley|pangong lake': { km: 240, duration: '6 - 7 Hrs' },
  'pangong lake|leh': { km: 225, duration: '5.5 - 6 Hrs' },
  'leh|sham valley': { km: 70, duration: '2 Hrs' },
  // Kerala & South India
  'cochin|munnar': { km: 130, duration: '3.5 - 4 Hrs' },
  'kochi|munnar': { km: 130, duration: '3.5 - 4 Hrs' },
  'munnar|thekkady': { km: 90, duration: '3 Hrs' },
  'thekkady|alleppey': { km: 140, duration: '3.5 - 4 Hrs' },
  'thekkady|alappuzha': { km: 140, duration: '3.5 - 4 Hrs' },
  'thekkady|kumarakom': { km: 125, duration: '3.5 Hrs' },
  'alleppey|cochin': { km: 55, duration: '1.5 Hrs' },
  'alappuzha|kochi': { km: 55, duration: '1.5 Hrs' },
  'alleppey|kovalam': { km: 160, duration: '4 - 4.5 Hrs' },
  'trivandrum|kovalam': { km: 18, duration: '45 Mins' },
  'kovalam|kanyakumari': { km: 85, duration: '2.5 Hrs' },
  'bangalore|mysore': { km: 145, duration: '2.5 - 3 Hrs' },
  'mysore|coorg': { km: 120, duration: '3 - 3.5 Hrs' },
  'mysore|ooty': { km: 125, duration: '3.5 - 4 Hrs' },
  'bangalore|ooty': { km: 270, duration: '6 - 6.5 Hrs' },
  'chennai|mahabalipuram': { km: 55, duration: '1.5 Hrs' },
  'mahabalipuram|pondicherry': { km: 100, duration: '2 - 2.5 Hrs' },
  'madurai|rameshwaram': { km: 170, duration: '3.5 Hrs' },
  'rameshwaram|kanyakumari': { km: 310, duration: '6 Hrs' },
  // North East & Islands
  'guwahati|shillong': { km: 100, duration: '3 Hrs' },
  'shillong|cherrapunjee': { km: 55, duration: '2 Hrs' },
  'cherrapunjee|dawki': { km: 85, duration: '2.5 - 3 Hrs' },
  'shillong|kaziranga': { km: 250, duration: '5.5 - 6 Hrs' },
  'guwahati|kaziranga': { km: 190, duration: '4 - 4.5 Hrs' },
  'bagdogra|gangtok': { km: 125, duration: '4 - 4.5 Hrs' },
  'gangtok|darjeeling': { km: 100, duration: '3.5 - 4 Hrs' },
  'darjeeling|bagdogra': { km: 70, duration: '2.5 - 3 Hrs' },
  'port blair|havelock': { km: 45, duration: '1.5 - 2 Hrs', mode: 'Ferry' },
  'havelock|neil island': { km: 20, duration: '1 Hr', mode: 'Ferry' },
  // International
  'hanoi|halong bay': { km: 160, duration: '2.5 - 3 Hrs' },
  'da nang|hoi an': { km: 30, duration: '45 Mins' },
  'da nang|hue': { km: 100, duration: '2 - 2.5 Hrs' },
  'bangkok|pattaya': { km: 150, duration: '2 Hrs' },
  'phuket|krabi': { km: 160, duration: '2.5 - 3 Hrs' },
  'kuta|ubud': { km: 35, duration: '1.5 Hrs' },
  'seminyak|ubud': { km: 35, duration: '1.5 Hrs' },
  'colombo|kandy': { km: 115, duration: '3.5 Hrs' },
  'kandy|nuwara eliya': { km: 80, duration: '2.5 - 3 Hrs' },
  'nuwara eliya|bentota': { km: 210, duration: '5 - 5.5 Hrs' },
  'paro|thimphu': { km: 50, duration: '1.5 Hrs' },
  'thimphu|punakha': { km: 75, duration: '2.5 - 3 Hrs' },
  'punakha|paro': { km: 125, duration: '3.5 - 4 Hrs' },
  'dubai|abu dhabi': { km: 140, duration: '1.5 Hrs' },
  'baku|gabala': { km: 220, duration: '3.5 Hrs' },
  'tbilisi|kazbegi': { km: 150, duration: '3 Hrs' },
  'zurich|lucerne': { km: 50, duration: '45 Mins' },
  'lucerne|interlaken': { km: 70, duration: '1 - 1.5 Hrs' }
};

export function getRouteTransitInfo(city1: string, city2: string): { distanceKm: number; duration: string; mode: string; badge: string } | null {
  if (!city1 || !city2) return null;
  const c1 = city1.toLowerCase().trim();
  const c2 = city2.toLowerCase().trim();
  if (c1 === c2) return null;

  const key1 = `${c1}|${c2}`;
  const key2 = `${c2}|${c1}`;
  let match = KNOWN_ROUTES[key1] || KNOWN_ROUTES[key2];

  if (!match) {
    for (const [k, v] of Object.entries(KNOWN_ROUTES)) {
      const [from, to] = k.split('|');
      if ((c1.includes(from) || from.includes(c1)) && (c2.includes(to) || to.includes(c2))) {
        match = v;
        break;
      }
      if ((c2.includes(from) || from.includes(c2)) && (c1.includes(to) || to.includes(c1))) {
        match = v;
        break;
      }
    }
  }

  if (match) {
    const mode = match.mode || 'Drive';
    return {
      distanceKm: match.km,
      duration: match.duration,
      mode,
      badge: `(Approx. ${match.km} KM | ${match.duration} ${mode})`
    };
  }

  return {
    distanceKm: 150,
    duration: '3.5 - 4 Hrs',
    mode: 'Drive',
    badge: `(Inter-city Scenic Drive)`
  };
}

/**
 * Calculates day-specific meal inclusion based strictly on Indian vs International Trip rules:
 * - Indian Trips: Breakfast & Dinner (except Day 1 breakfast and Last Day dinner) -> Day 1 = "Dinner Only", Middle = "Breakfast & Dinner", Last = "Breakfast Only"
 * - International Trips: Breakfast only (except Day 1 breakfast) -> Day 1 = "No Meals Included", Day 2..N = "Breakfast Only"
 */
export function getMealPlanForDay(
  dayIndex: number,
  totalDays: number,
  isInternational: boolean
): string {
  const isFirstDay = dayIndex === 1;
  const isLastDay = dayIndex === totalDays;

  if (isInternational) {
    if (isFirstDay) {
      return 'No Meals Included';
    }
    return 'Breakfast Only';
  } else {
    if (totalDays <= 1) {
      return 'Breakfast & Dinner';
    }
    if (isFirstDay) {
      return 'Dinner Only';
    }
    if (isLastDay) {
      return 'Breakfast Only';
    }
    return 'Breakfast & Dinner';
  }
}

/**
 * Frames a rich, engaging sentence explaining what happens in that experience based on Zoho CRM data
 */
export function frameExperienceSentence(exp: ZohoExperienceItem, city: string = ''): string {
  const name = (exp.name || '').trim();
  if (!name) return '';

  const detail = (exp.inclusionDescription || exp.description || exp.subTitle || '').trim();

  // If Zoho CRM provided a detailed description that is not just repeating the name
  if (detail && detail.toLowerCase() !== name.toLowerCase()) {
    const cleanedDetail = detail.replace(/^["']|["']$/g, '').trim();
    if (cleanedDetail.toLowerCase().startsWith(name.toLowerCase())) {
      return cleanedDetail.endsWith('.') ? cleanedDetail : `${cleanedDetail}.`;
    }
    return `**${name}**: ${cleanedDetail.endsWith('.') ? cleanedDetail : `${cleanedDetail}.`}`;
  }

  // Natural descriptive framing based on experience name keywords
  const nLower = name.toLowerCase();
  if (nLower.includes('safari') || nLower.includes('jungle')) {
    return `Embark on an exhilarating **${name}** in an open-top gypsy accompanied by a certified naturalist to spot wildlife and diverse flora.`;
  }
  if (nLower.includes('fort') || nLower.includes('palace') || nLower.includes('mahal')) {
    return `Explore the historic **${name}**, discovering its royal architectural grandeur, ornate courtyards, and rich heritage.`;
  }
  if (nLower.includes('temple') || nLower.includes('dargah') || nLower.includes('monastery') || nLower.includes('shrine')) {
    return `Visit the revered **${name}**, experiencing its spiritual ambiance, intricate carvings, and peaceful surroundings.`;
  }
  if (nLower.includes('lake') || nLower.includes('river') || nLower.includes('boating') || nLower.includes('shikara') || nLower.includes('cruise')) {
    return `Enjoy a scenic **${name}**, taking in tranquil waterfront vistas and picturesque natural landscapes.`;
  }
  if (nLower.includes('waterfall') || nLower.includes('falls')) {
    return `Witness the cascading beauty of **${name}**, surrounded by lush green foliage and refreshing mist.`;
  }
  if (nLower.includes('market') || nLower.includes('bazaar') || nLower.includes('shopping')) {
    return `Stroll through the vibrant **${name}**, exploring local handicrafts, authentic souvenirs, and regional delicacies.`;
  }
  if (nLower.includes('garden') || nLower.includes('plantation') || nLower.includes('valley') || nLower.includes('viewpoint') || nLower.includes('peak')) {
    return `Visit **${name}** to enjoy panoramic views, fresh mountain air, and lush landscapes.`;
  }
  if (nLower.includes('museum') || nLower.includes('gallery')) {
    return `Discover curated historical artifacts, art collections, and cultural exhibits at **${name}**.`;
  }

  return `Visit and experience **${name}** with guided exploration.`;
}

/**
 * Frames a rich sentence explaining what happens in an en-route experience
 */
export function frameEnRouteExperienceSentence(enRoute: string = ''): string {
  const clean = enRoute.trim();
  if (!clean) return '';

  const lower = clean.toLowerCase();

  if (lower.includes('vrindavan') || lower.includes('mathura')) {
    return `**En-Route Visit: ${clean}** — Stop at holy ${clean} to seek divine blessings at iconic temples and experience the sacred spiritual ambiance.`;
  }
  if (lower.includes('fatehpur') || lower.includes('sikri')) {
    return `**En-Route Visit: ${clean}** — Explore the UNESCO World Heritage red sandstone Mughal city, Buland Darwaza, and Salim Chishti Dargah.`;
  }
  if (lower.includes('abhaneri') || lower.includes('chand baori') || lower.includes('stepwell')) {
    return `**En-Route Visit: ${clean}** — Stop to marvel at the ancient architectural wonder of geometric stepwells.`;
  }
  if (lower.includes('ranakpur')) {
    return `**En-Route Visit: ${clean}** — Visit the renowned Ranakpur Jain Temples, famous for 1,444 uniquely carved white marble pillars.`;
  }
  if (lower.includes('kumbhalgarh')) {
    return `**En-Route Visit: ${clean}** — Explore the historic hill fortress of Kumbhalgarh, boasting the world's second longest continuous wall.`;
  }
  if (lower.includes('darshan') || lower.includes('temple') || lower.includes('dargah') || lower.includes('monastery') || lower.includes('shrine') || lower.includes('mandir')) {
    return `**En-Route Visit: ${clean}** — Enjoy a spiritual en-route stop for darshan and blessings at ${clean}.`;
  }
  if (lower.includes('fort') || lower.includes('palace') || lower.includes('monument') || lower.includes('heritage')) {
    return `**En-Route Visit: ${clean}** — Stop en route to explore the rich history and architectural heritage of ${clean}.`;
  }
  if (lower.includes('lake') || lower.includes('waterfall') || lower.includes('falls') || lower.includes('viewpoint') || lower.includes('valley')) {
    return `**En-Route Stop: ${clean}** — Take a scenic en-route break to admire the panoramic natural vistas of ${clean}.`;
  }

  return `**En-Route Experience: ${clean}** — Enjoy a curated en-route stop at ${clean} to explore local highlights and culture.`;
}

/**
 * Normalizes raw subform rows from Zoho CRM into ZohoDayActivity format if needed
 */
export function parseRawSubformToDayActivities(rawSubform: any[]): ZohoDayActivity[] {
  if (!Array.isArray(rawSubform)) return [];

  const dayActivities: ZohoDayActivity[] = [];

  rawSubform.forEach((row, idx) => {
    const dayText = String(row.Days || `Day ${idx + 1}`).trim();
    const dayMatch = dayText.match(/\d+/);
    const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : idx + 1;
    const city = String(row.City || '').trim();

    const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? row.Transit_city ?? '';
    const city2 = (typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '')).trim();

    const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? row.En_Route_Experiences ?? row.En_route ?? row.Enroute ?? row.en_route_experiences ?? '';
    const enRouteExperiences = (typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : String(rawEnRoute || '')).trim();
    const pdfDescription = String(row.PDF_Description || '').trim();

    const experiences: ZohoExperienceItem[] = [];
    const seenExpNames = new Set<string>();

    for (let e = 1; e <= 10; e++) {
      const expKey = e === 1 ? (row.Experiences_and_activities || row.Experiences_1) : row[`Experiences_${e}`];
      if (!expKey) continue;
      const expName = (typeof expKey === 'object' && expKey !== null ? expKey.name : (typeof expKey === 'string' ? expKey : '')).trim();

      if (expName && !seenExpNames.has(expName.toLowerCase())) {
        seenExpNames.add(expName.toLowerCase());
        experiences.push({
          name: expName,
          subTitle: String(row[`Sub_Title_${e}`] || '').trim(),
          description: String(row[`Description_for_template_${e}`] || '').trim(),
          inclusionDescription: String(row[`Inclusions_Description_${e}`] || '').trim()
        });
      }
    }

    dayActivities.push({
      dayNumber,
      dayText,
      city,
      city2: city2 || undefined,
      enRouteExperiences: enRouteExperiences || undefined,
      experiences,
      pdfDescription: pdfDescription || undefined
    });
  });

  dayActivities.sort((a, b) => a.dayNumber - b.dayNumber);
  return dayActivities;
}

/**
 * Builds accurate, clean, professional day plans directly from Zoho CRM subform data.
 * Adheres strictly to:
 * 1. Indian vs International meal plan rules (Indian: D1 dinner only, middle B+D, last B only; Intl: D1 no meals, D2..N B only).
 * 2. Inter-city transit distances and driving durations in headings and sequential flow.
 * 3. First day arrival at airport/railway station and transfer to hotel.
 * 4. Rich experience sentences framing actual Zoho CRM experience data.
 */
export function buildCleanDayPlansFromZoho(
  dayActivities: ZohoDayActivity[] = [],
  hotels: ZohoHotelStay[] = [],
  destination: string = '',
  totalDays: number = 0,
  fallbackMealPlan: string = '',
  destinationType: string = ''
): ItineraryDayPlan[] {
  const isIntl = isInternationalTrip(destination, destinationType);
  const totalCount = Math.max(dayActivities.length, totalDays || 0, 1);

  const totalHotelNights = hotels.reduce((sum, h) => sum + (Number(h.nights) || 0), 0);

  // Helper to determine stay location for each day based on hotel list or city
  const getStayForDay = (dayNum: number, currentCity: string): string | undefined => {
    // 1. If hotel nights are specified:
    if (totalHotelNights > 0) {
      if (dayNum > totalHotelNights) {
        return undefined; // No hotel stay on this day (e.g. Departure Day)
      }

      let cumulativeNights = 0;
      for (const h of hotels) {
        const n = Number(h.nights) || 0;
        if (n > 0) {
          if (dayNum > cumulativeNights && dayNum <= cumulativeNights + n) {
            if (h.hotelName) {
              return `${h.hotelName}, ${h.city || currentCity || destination}`;
            } else if (h.city) {
              return `Selected Hotel, ${h.city}`;
            }
          }
          cumulativeNights += n;
        }
      }
    }

    // 2. If hotels exist without explicit nights:
    if (hotels.length > 0) {
      if (dayNum >= totalCount && totalCount > 1) {
        return undefined; // Departure day on multi-day trip
      }
      if (currentCity) {
        const match = hotels.find(
          h => h.city && h.city.toLowerCase().trim() === currentCity.toLowerCase().trim()
        );
        if (match && match.hotelName) {
          return `${match.hotelName}, ${match.city || currentCity}`;
        }
      }
      if (hotels.length === 1 && hotels[0].hotelName) {
        return `${hotels[0].hotelName}, ${currentCity || destination}`;
      }
    }

    // 3. Fallback when no hotels entered:
    if (dayNum >= totalCount && totalCount > 1) {
      return undefined; // Departure day on multi-day trip
    }

    return currentCity ? `Selected Hotel, ${currentCity}` : (destination ? `Selected Hotel, ${destination}` : undefined);
  };

  if (!dayActivities || dayActivities.length === 0) {
    const plans: ItineraryDayPlan[] = [];
    for (let i = 1; i <= totalCount; i++) {
      const isFirst = i === 1;
      const isLast = i === totalCount;
      const stayLocation = getStayForDay(i, destination);
      const dayMeals = getMealPlanForDay(i, totalCount, isIntl);

      const title = isFirst
        ? `Arrival in ${destination} — Hotel Check-in & Leisure`
        : (isLast ? `${destination} — Leisure & Departure Transfer` : `${destination} — Sightseeing & Cultural Highlights`);

      const timeline: string[] = [];
      if (isFirst) {
        timeline.push(
          isIntl
            ? `Arrival at ${destination} International Airport, meet our local representative, and transfer to your hotel.`
            : `Arrival at ${destination} Airport / Railway Station, meet our tour representative, and transfer to your hotel.`
        );
        if (stayLocation) {
          timeline.push(`Complete smooth hotel check-in formalities and refresh at ${stayLocation}.`);
          timeline.push(isIntl ? `Spend the evening at leisure and overnight stay at ${stayLocation}.` : `Enjoy dinner and an overnight stay at ${stayLocation}.`);
        } else {
          timeline.push(`Complete smooth check-in formalities and spend the evening at leisure.`);
        }
      } else if (isLast) {
        timeline.push(`Enjoy breakfast at the accommodation and complete check-out formalities.`);
        timeline.push(
          isIntl
            ? `Transfer to ${destination} International Airport for your return flight with unforgettable memories.`
            : `Transfer to ${destination} Airport / Railway Station for your onward departure journey.`
        );
      } else {
        timeline.push(`Enjoy breakfast at the hotel before proceeding for local sightseeing in ${destination}.`);
        timeline.push(`Explore prime attractions and scenic cultural landmarks across ${destination}.`);
        if (stayLocation) {
          timeline.push(isIntl ? `Return to the hotel for an overnight stay at ${stayLocation}.` : `Return to the hotel for dinner and an overnight stay at ${stayLocation}.`);
        } else {
          timeline.push(`Enjoy your evening at leisure in ${destination}.`);
        }
      }

      plans.push({
        day: i,
        title,
        description: isFirst ? `Arrive in ${destination} and settle into your luxury accommodation.` : (isLast ? `Check out and transfer for your departure journey.` : `Explore key highlights of ${destination}.`),
        stayLocation,
        meals: dayMeals,
        activities: isFirst ? [`Arrival & Hotel Check-in`] : (isLast ? [`Breakfast & Departure Transfer`] : [`${destination} Sightseeing`]),
        timeline
      });
    }
    return plans;
  }

  const dayPlans: ItineraryDayPlan[] = [];

  dayActivities.forEach((act, idx) => {
    const dayNum = act.dayNumber || idx + 1;
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === totalCount;

    const city1 = (act.city || destination || '').trim();
    const city2 = (act.city2 || '').trim();
    const enRoute = (act.enRouteExperiences || '').trim();

    // Check if intercity transit is explicit via city2 OR implicit via city change from previous day
    let isInterCityTravel = false;
    let fromCity = city1;
    let toCity = city2;

    if (city2 && city2.toLowerCase() !== city1.toLowerCase()) {
      isInterCityTravel = true;
      fromCity = city1;
      toCity = city2;
    } else if (idx > 0) {
      const prevAct = dayActivities[idx - 1];
      const prevCity = (prevAct.city2 || prevAct.city || '').trim();
      if (prevCity && city1 && prevCity.toLowerCase() !== city1.toLowerCase()) {
        isInterCityTravel = true;
        fromCity = prevCity;
        toCity = city1;
      }
    }

    const targetCity = isInterCityTravel ? toCity : city1;
    const stayLocation = getStayForDay(dayNum, targetCity);
    const dayMeals = getMealPlanForDay(dayNum, totalCount, isIntl);

    const transitInfo = isInterCityTravel ? getRouteTransitInfo(fromCity, toCity) : null;
    const transitBadge = transitInfo?.badge ? ` ${transitInfo.badge}` : '';

    // Deduplicate experiences for this day
    const uniqueExps: ZohoExperienceItem[] = [];
    const seenNames = new Set<string>();
    (act.experiences || []).forEach(exp => {
      const n = (exp.name || '').trim();
      if (n && !seenNames.has(n.toLowerCase())) {
        seenNames.add(n.toLowerCase());
        uniqueExps.push(exp);
      }
    });

    const expNames = uniqueExps.map(e => e.name);

    const joinWithAmp = (items: string[]) => {
      if (items.length <= 1) return items[0] || '';
      if (items.length === 2) return `${items[0]} & ${items[1]}`;
      return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
    };

    const joinWithAnd = (items: string[]) => {
      if (items.length <= 1) return items[0] || '';
      if (items.length === 2) return `${items[0]} and ${items[1]}`;
      return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
    };

    // 1. DAY HEADING (Accurately capturing City_2, En_route_Experiences, and Experiences)
    let title = '';
    if (isInterCityTravel) {
      if (enRoute && expNames.length > 0) {
        title = `${fromCity} to ${toCity} via ${enRoute} — ${joinWithAmp(expNames)}${transitBadge}`;
      } else if (enRoute) {
        title = isLastDay
          ? `${fromCity} to ${toCity} via ${enRoute} — En-Route Visit & Departure Transfer${transitBadge}`
          : `${fromCity} to ${toCity} via ${enRoute}${transitBadge}`;
      } else if (expNames.length > 0) {
        title = `${fromCity} to ${toCity} — ${joinWithAmp(expNames)}${transitBadge}`;
      } else if (isLastDay) {
        title = `${fromCity} to ${toCity} — Departure Transfer${transitBadge}`;
      } else {
        title = `${fromCity} to ${toCity} — Transfer & Sightseeing${transitBadge}`;
      }
    } else if (city1) {
      if (enRoute && expNames.length > 0) {
        title = `${city1} via ${enRoute} — ${joinWithAmp(expNames)}`;
      } else if (enRoute) {
        title = `${city1} — En-Route ${enRoute} Visit`;
      } else if (expNames.length > 0) {
        title = isFirstDay
          ? `${city1} — Arrival, ${joinWithAmp(expNames)}`
          : (isLastDay ? `${city1} — ${joinWithAmp(expNames)} & Departure` : `${city1} — ${joinWithAmp(expNames)}`);
      } else {
        title = isFirstDay
          ? `${city1} — Arrival & Hotel Check-in`
          : (isLastDay ? `${city1} — Leisure & Departure Transfer` : `${city1} — Sightseeing & Leisure`);
      }
    } else {
      title = expNames.length > 0 ? joinWithAmp(expNames) : `Day ${dayNum} Exploration`;
    }

    // 2. DAY DESCRIPTION (Cleanly framed by AI / smart rules)
    let description = '';
    if (act.pdfDescription && act.pdfDescription.trim()) {
      description = act.pdfDescription.trim();
    } else if (isInterCityTravel) {
      if (enRoute && isLastDay && expNames.length === 0) {
        description = `Travel from ${fromCity} to ${toCity} with a memorable en-route stop at ${enRoute}, before transferring for your departure journey.`;
      } else if (enRoute && expNames.length > 0) {
        description = `Travel from ${fromCity} to ${toCity} with an en-route visit to ${enRoute}, followed by curated visits to ${joinWithAnd(expNames)}.`;
      } else if (enRoute) {
        description = `Travel from ${fromCity} to ${toCity} with an en-route stop at ${enRoute}, settling in upon arrival in ${toCity}.`;
      } else if (expNames.length > 0) {
        description = `Travel from ${fromCity} to ${toCity}, followed by curated visits to ${joinWithAnd(expNames)}.`;
      } else {
        description = isLastDay
          ? `Travel from ${fromCity} to ${toCity} and complete check-out transfers for your onward journey.`
          : `Travel from ${fromCity} to ${toCity} and settle into your accommodation.`;
      }
    } else if (expNames.length > 0) {
      description = isFirstDay
        ? `Arrive in ${city1} and experience ${joinWithAnd(expNames)}.`
        : (isLastDay ? `Experience ${joinWithAnd(expNames)} before your departure transfer.` : `Explore ${city1} with curated visits to ${joinWithAnd(expNames)}.`);
    } else {
      description = isFirstDay
        ? (isIntl
            ? `Arrive at ${city1} International Airport, meet your representative, and transfer to your hotel.`
            : `Arrive at ${city1} Airport / Railway Station, meet your representative, and transfer to your hotel.`)
        : (isLastDay ? `Enjoy breakfast before completing check-out and transferring for your departure journey.` : `Spend the day discovering key attractions and cultural highlights in ${city1}.`);
    }

    // 3. DAY ACTIVITIES (Bullet list)
    const activities: string[] = [];
    if (isFirstDay) {
      activities.push(`Arrival in ${city1} & Hotel Check-in`);
    }
    if (isInterCityTravel) {
      activities.push(`Transfer from ${fromCity} to ${toCity}${transitBadge ? ` ${transitBadge}` : ''}`);
    }
    if (enRoute) {
      activities.push(`En-route Stop: ${enRoute}`);
    }
    uniqueExps.forEach(exp => {
      activities.push(exp.name);
    });
    if (isLastDay && uniqueExps.length === 0) {
      activities.push(`Departure Transfer`);
    }

    // 4. DAY TIMELINE (Flowchart Step Milestones) - Sequential Day Flow
    const timeline: string[] = [];

    // Step 1: Morning Start / Arrival / Departure
    if (isFirstDay) {
      timeline.push(
        isIntl
          ? `Arrival at ${city1} International Airport, meet our local representative after immigration, and transfer to your hotel.`
          : `Arrival at ${city1} Airport / Railway Station, meet our tour representative, and transfer to your hotel.`
      );
      if (stayLocation) {
        timeline.push(`Complete smooth hotel check-in formalities and refresh at ${stayLocation}.`);
      } else {
        timeline.push(`Complete smooth check-in formalities and refresh.`);
      }
    } else if (isInterCityTravel) {
      timeline.push(`Enjoy a wholesome breakfast and complete check-out formalities in ${fromCity}.`);
      timeline.push(
        `Depart from ${fromCity} and proceed on a scenic drive towards ${toCity}${enRoute ? ` via ${enRoute}` : ''}${transitBadge ? ` ${transitBadge}` : ''}.`
      );
    } else {
      timeline.push(`Enjoy breakfast at the hotel before proceeding for the day's curated sightseeing in ${city1}.`);
    }

    // Step 2: En-route experience milestone (well framed)
    if (enRoute) {
      timeline.push(frameEnRouteExperienceSentence(enRoute));
    }

    // Step 3: Destination Hotel Check-in (if intercity and not departure day)
    if (isInterCityTravel && !isLastDay) {
      if (stayLocation) {
        timeline.push(`Arrive in ${toCity} and complete check-in formalities at ${stayLocation}.`);
      } else {
        timeline.push(`Arrive in ${toCity} and complete check-in formalities.`);
      }
    }

    // Step 4: Zoho Experiences with proper sentence framing explaining what is happening
    uniqueExps.forEach(exp => {
      const sentence = frameExperienceSentence(exp, targetCity);
      if (sentence) {
        timeline.push(sentence);
      }
    });

    // Step 5: Evening & Overnight / Departure
    if (isLastDay) {
      if (!isInterCityTravel) {
        timeline.push(
          isIntl
            ? `Transfer to ${city1} International Airport for your onward flight with wonderful memories.`
            : `Transfer to ${city1} Airport / Railway Station for your onward journey home with wonderful memories.`
        );
      } else {
        timeline.push(
          isIntl
            ? `Arrive in ${toCity} and transfer directly to the International Airport for your departure flight.`
            : `Arrive in ${toCity} and transfer directly to the Airport / Railway Station for your departure journey.`
        );
      }
    } else {
      if (stayLocation) {
        if (isIntl) {
          timeline.push(`Spend the evening at leisure followed by an overnight stay at ${stayLocation}.`);
        } else {
          timeline.push(`Enjoy dinner and a comfortable overnight stay at ${stayLocation}.`);
        }
      } else {
        if (isIntl) {
          timeline.push(`Spend the evening at leisure.`);
        } else {
          timeline.push(`Enjoy dinner and spend the evening relaxing at your leisure.`);
        }
      }
    }

    dayPlans.push({
      day: dayNum,
      title,
      description,
      stayLocation,
      meals: dayMeals,
      activities,
      timeline
    });
  });

  return dayPlans;
}

/**
 * Intelligent fallback generator based strictly on fetched Zoho data
 */
export function generateLuxuryFallback(raw: Record<string, any>): GeneratedItineraryContent {
  const dest = (raw.destination || raw.Destination || raw.Destinations || raw.city || '').trim() || 'Curated Itinerary';
  const destType = (raw.destinationType || raw.Destination_Type || '').trim();
  const hotel = (raw.hotelName || raw.Hotel_Name || raw.Hotel || raw.stay || '').trim() || 'Selected Hotel';
  const room = (raw.roomCategory || raw.Room_Category || raw.preferredRoomCategory || raw.Room_Type || raw.Room || '').trim() || 'Selected Room Category';
  const duration = raw.duration || raw.noOfDays || raw.Days || raw.days || 0;
  const mealPlan = (raw.mealPlan || raw.Meal_Plan || '').trim() || (isInternationalTrip(dest, destType) ? 'Breakfast Only' : 'Breakfast & Dinner');

  // Extract dayActivities if present
  let dayActivities: ZohoDayActivity[] = raw.dayActivities || [];
  if (dayActivities.length === 0 && Array.isArray(raw.rawLeadData?.Activities_and_Experiences_1)) {
    dayActivities = parseRawSubformToDayActivities(raw.rawLeadData.Activities_and_Experiences_1);
  } else if (dayActivities.length === 0 && Array.isArray(raw.Activities_and_Experiences_1)) {
    dayActivities = parseRawSubformToDayActivities(raw.Activities_and_Experiences_1);
  }

  const rawDays = Number(raw.noOfDays || raw.No_of_Days || raw.Days || raw.days || duration) || 0;
  const noOfDays = rawDays > 0 ? rawDays : (dayActivities.length > 0 ? dayActivities.length : 5);
  const rawNights = Number(raw.noOfNights || raw.No_of_Nights) || 0;
  const noOfNights = rawNights > 0 ? rawNights : (noOfDays > 1 ? noOfDays - 1 : 1);
  const travelStyle = (raw.travelStyle || raw.Travel_Style || 'Family Trip').trim();
  const tripType = (raw.tripType || raw.Trip_Type || 'Customised Trip').trim();

  const hotels: ZohoHotelStay[] = raw.hotels || (hotel ? [{ index: 1, hotelName: hotel, city: dest, nights: noOfNights, stayDates: '' }] : []);

  const defaultSubTitle = travelStyle || sanitizeSubTitle(room || hotel || 'Royal Retreat');
  const defaultDesc = sanitizeLuxuryDescription(
    `Private curated travel experience for ${dest}, featuring handpicked stays and personalized day-wise experiences.`
  );

  const dayPlans = buildCleanDayPlansFromZoho(
    dayActivities,
    hotels,
    dest,
    noOfDays,
    mealPlan,
    destType
  );

  const standardTitle = `${noOfNights} Nights / ${noOfDays} Days Royal ${dest} Escape`;

  const vehicle = (raw.vehicleType || raw.Vehicle_Type || raw.vehicle || raw.Cab_Type || 'AC Vehicle').trim();

  // Extract all unique experience names and en-route experiences from the day activities
  const uniqueExpList: string[] = [];
  const seenExp = new Set<string>();

  (dayActivities || []).forEach(d => {
    // 1. En-route experiences
    if (d.enRouteExperiences) {
      const er = String(d.enRouteExperiences).trim();
      if (er && !seenExp.has(er.toLowerCase())) {
        seenExp.add(er.toLowerCase());
        uniqueExpList.push(er.toLowerCase().startsWith('en-route') ? er : `En-route Experience: ${er}`);
      }
    }

    // 2. Experiences 1, 2, 3, 4...
    (d.experiences || []).forEach(e => {
      const n = (e.name || '').trim();
      if (n && !seenExp.has(n.toLowerCase())) {
        seenExp.add(n.toLowerCase());
        uniqueExpList.push(n);
      }
    });
  });

  const exactInclusions: string[] = [
    `Private ${vehicle} for the complete ${dest} itinerary and Airport Transfers.`,
    `Accomodation in ${room} Properties For ${noOfNights} Nights.`,
    `Meals ${mealPlan ? mealPlan : 'Breakfast & Dinner'} ( Breakfast Except 1st Day , Dinner Last Day )`,
    `Driver allowance, fuel, toll taxes, parking charges and applicable road taxes.`,
    `All transfers and sightseeing as per the day-wise itinerary. Entry fees are excluded unless specifically mentioned.`,
    ...uniqueExpList,
    `Assistance during hotel check-in and check-out.`,
    `Applicable taxes included in the quoted package, wherever applicable.`
  ];

  const exactExclusions: string[] = [
    `5% GST.`,
    `Early check-in (Before 1:00 PM) & Late Check-out (After 11:00 AM) at the hotel.`,
    `Any additional expenses of personal nature.`,
    `Additional accommodation/food costs incurred due to any delayed travel.`,
    `Any lunch and other meals not mentioned in Package Inclusions.`,
    `Any Airfare / Rail fare other than what is mentioned in "Inclusions" or any type of transportation.`,
    `Monument entry fees during Sightseeing.`,
    `Additional Costs due to Flight Cancellations, Landslides, Roadblocks, and other natural calamities.`,
    `Any other services not specified above in inclusions.`
  ];

  const finalQuotationAmount = raw.finalQuotationAmount !== undefined ? Number(raw.finalQuotationAmount) : (raw.Final_Quotation_Amount ? Number(raw.Final_Quotation_Amount) : (raw.Total_Package_Cost ? Number(raw.Total_Package_Cost) : (raw.Quotation_Amount ? Number(raw.Quotation_Amount) : (raw.Expected_Revenue ? Number(raw.Expected_Revenue) : (raw.Amount ? Number(raw.Amount) : undefined)))));
  const perAdultPrice = raw.perAdultPrice !== undefined ? Number(raw.perAdultPrice) : (raw.Per_Adult_Price ? Number(raw.Per_Adult_Price) : (raw.Per_Adult_Cost ? Number(raw.Per_Adult_Cost) : (raw.Price_Per_Adult ? Number(raw.Price_Per_Adult) : (raw.Adult_Price ? Number(raw.Adult_Price) : undefined))));
  const perKidPrice = raw.perKidPrice !== undefined ? Number(raw.perKidPrice) : (raw.Per_Kid_Price ? Number(raw.Per_Kid_Price) : (raw.Per_Child_Price ? Number(raw.Per_Child_Price) : (raw.Price_Per_Kid ? Number(raw.Price_Per_Kid) : (raw.Child_Price ? Number(raw.Child_Price) : undefined))));
  const adults = Number(raw.adults || raw.Adults || raw.Number_Of_Guest || raw.numberOfGuests) || 2;
  const kids = Number(raw.kids || raw.Kids || raw.Children || raw.Number_Of_Children || 0);
  const advanceAmountPaid = raw.advanceAmountPaid !== undefined ? Number(raw.advanceAmountPaid) : (raw.Advance_Amount_Paid ? Number(raw.Advance_Amount_Paid) : undefined);
  const balancePendingAmount = raw.balancePendingAmount !== undefined ? Number(raw.balancePendingAmount) : (raw.Balance_Pending_Amount ? Number(raw.Balance_Pending_Amount) : undefined);

  return {
    title: standardTitle,
    subTitle: defaultSubTitle,
    description: defaultDesc,
    destination: dest,
    travelStyle,
    tripType,
    noOfDays,
    noOfNights,
    hotelName: hotel,
    roomCategory: room,
    mealPlan: mealPlan,
    finalQuotationAmount,
    perAdultPrice,
    perKidPrice,
    adults,
    kids,
    advanceAmountPaid,
    balancePendingAmount,
    highlights: [
      hotel ? `Accommodation at ${hotel} (${room})` : `Curated accommodation in ${dest}`,
      `Dedicated private vehicle for all transfers and sightseeing`,
      `Sightseeing & experiences as per customized day-wise schedule`,
      `Verified local guidance and 24/7 dedicated trip support`
    ],
    dayPlans,
    inclusions: exactInclusions,
    exclusions: exactExclusions,
    amenities: [
      'High-Speed Wi-Fi',
      'Front Desk & In-Dining Service',
      'Air-Conditioned Comfort',
      'Daily Housekeeping Service',
      'Room & Stay Amenities'
    ],
    packingTips: [
      'Comfortable clothing suitable for day tours and sightseeing',
      'A light jacket or shawl for air-conditioned travel and cooler evenings',
      'Comfortable footwear for monument visits and walking tours',
      'Sunscreen, sunglasses, and a camera for photos'
    ],
    importantNotes: [
      'Standard hotel check-in time is 2:00 PM and check-out is 11:00 AM.',
      'A valid government-approved Photo ID is required for all guests at check-in.',
      'Early check-in and late check-out are subject to hotel room availability.'
    ]
  };
}

/**
 * Generate complete luxury travel itinerary content
 */
export async function generateItineraryContentWithAI(rawZohoData: Record<string, any>): Promise<GeneratedItineraryContent> {
  const dest = (rawZohoData.destinations || rawZohoData.destination || rawZohoData.Destination || rawZohoData.Destinations || rawZohoData.city || '').trim() || 'Curated Itinerary';
  const destType = (rawZohoData.destinationType || rawZohoData.Destination_Type || '').trim();
  const hotel = (rawZohoData.hotelName || rawZohoData.Hotel_Name || rawZohoData.Hotel || rawZohoData.stay || '').trim() || 'Selected Hotel';
  const room = (rawZohoData.preferredRoomCategory || rawZohoData.Room_Category || rawZohoData.Room_Type || rawZohoData.Room || '').trim() || 'Selected Room Category';
  const mealPlan = (rawZohoData.mealPlan || rawZohoData.Meal_Plan || '').trim() || (isInternationalTrip(dest, destType) ? 'Breakfast Only' : 'Breakfast & Dinner');
  const totalDays = Number(rawZohoData.noOfDays || rawZohoData.Days || rawZohoData.days) || 0;

  // Extract dayActivities from all possible locations
  let dayActivities: ZohoDayActivity[] = rawZohoData.dayActivities || [];
  if (dayActivities.length === 0 && Array.isArray(rawZohoData.rawLeadData?.Activities_and_Experiences_1)) {
    dayActivities = parseRawSubformToDayActivities(rawZohoData.rawLeadData.Activities_and_Experiences_1);
  } else if (dayActivities.length === 0 && Array.isArray(rawZohoData.Activities_and_Experiences_1)) {
    dayActivities = parseRawSubformToDayActivities(rawZohoData.Activities_and_Experiences_1);
  }

  const hotels: ZohoHotelStay[] = rawZohoData.hotels || (hotel ? [{ index: 1, hotelName: hotel, city: dest, nights: totalDays || 3, stayDates: '' }] : []);

  // ALWAYS generate clean, accurate day plans directly from Zoho CRM subform adhering to Indian vs Intl rules
  const cleanDayPlans = buildCleanDayPlansFromZoho(
    dayActivities,
    hotels,
    dest,
    totalDays || (dayActivities.length > 0 ? dayActivities.length : 4),
    mealPlan,
    destType
  );

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = generateLuxuryFallback(rawZohoData);
    fallback.dayPlans = cleanDayPlans;
    return fallback;
  }

  const promptData = {
    guestName: rawZohoData.leadName || rawZohoData.Full_Name || (rawZohoData.First_Name ? `${rawZohoData.First_Name || ''} ${rawZohoData.Last_Name || ''}`.trim() : rawZohoData.name || 'Valued Guest'),
    inquiryId: rawZohoData.inquiryId || rawZohoData.Inquiry_ID || '',
    destination: dest,
    destinationType: destType || 'India',
    travelStyle: rawZohoData.travelStyle || rawZohoData.Travel_Style || 'Family Trip',
    roomCategory: room,
    mealPlan: mealPlan,
    duration: totalDays ? `${totalDays} Days / ${rawZohoData.noOfNights || totalDays - 1} Nights` : rawZohoData.duration || '5 Days / 4 Nights',
    guests: rawZohoData.numberOfGuests || rawZohoData.Number_Of_Guest || rawZohoData.Number_Of_Guests || 2,
    hotels,
    dayActivitiesSummary: cleanDayPlans.map(d => `Day ${d.day}: ${d.title} (${d.timeline?.join(' | ') || d.description})`)
  };

  const systemPrompt = `You are the Master Travel Curator & Copywriter for "Wanderphilia".
Generate the overall trip title, 1-3 word subTitle, one-liner luxury description, highlights, inclusions, exclusions, and amenities in strictly valid JSON format.

CRITICAL MANDATORY RULES:
1. "subTitle": MUST be a short, catchy 1 to 3 word title (e.g. "Desert Tent", "Luxury Suite", "Royal Palace", "Himalayan Haven"). Maximum 3 words!
2. "description": MUST be a clean, genuine, professional ONE-LINER description summarizing the holiday experience.
   - ABSOLUTE PROHIBITION: Under NO circumstances include ANY prices/amounts (₹, Rs., $, USD, etc.) OR ANY time durations (e.g. 30-minute, 2-hour, 5-day) in the description! Exactly 1 sentence.
3. "title": A grand, professional trip title (e.g., "Exclusive Travel Itinerary to ${dest}").
4. "highlights": An array of 4 to 5 genuine tour highlights based on the hotels and destination.
5. "inclusions": 5 to 6 standard inclusions (Accommodation, meal plan, private AC vehicle, driver allowance & tolls, concierge support).
6. "exclusions": 4 to 5 standard exclusions (Airfare/train fare, personal expenses, monument entry tickets not mentioned, travel insurance).
7. "amenities": 5 to 6 hotel/stay amenities.

OUTPUT FORMAT:
Output ONLY valid, parseable JSON with NO markdown code fences, NO explanation, NO comments. Follow this schema:
{
  "title": "...",
  "subTitle": "1-3 words",
  "description": "One sentence description without any prices or time durations.",
  "destination": "${dest}",
  "hotelName": "${hotel}",
  "roomCategory": "${room}",
  "mealPlan": "${mealPlan}",
  "highlights": ["..."],
  "inclusions": ["..."],
  "exclusions": ["..."],
  "amenities": ["..."],
  "packingTips": ["..."],
  "importantNotes": ["..."]
}`;

  const userPrompt = `Here is the trip summary:
${JSON.stringify(promptData, null, 2)}

Generate the clean itinerary JSON now.`;

  try {
    let rawJsonResponse = '';

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
              temperature: 0.5,
              max_tokens: 2000,
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
          temperature: 0.5,
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

    const cleanedJsonStr = rawJsonResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedJsonStr);

    const fallback = generateLuxuryFallback(rawZohoData);
    const noOfDays = fallback.noOfDays || totalDays || (cleanDayPlans.length > 0 ? cleanDayPlans.length : 5);
    const noOfNights = fallback.noOfNights || (noOfDays > 1 ? noOfDays - 1 : 1);
    const travelStyle = fallback.travelStyle || (rawZohoData.travelStyle || rawZohoData.Travel_Style || 'Family Trip').trim();
    const tripType = fallback.tripType || (rawZohoData.tripType || rawZohoData.Trip_Type || 'Customised Trip').trim();
    const standardTitle = `${noOfNights} Nights / ${noOfDays} Days Royal ${dest} Escape`;

    return {
      title: standardTitle,
      subTitle: travelStyle || sanitizeSubTitle(parsed.subTitle || room),
      description: sanitizeLuxuryDescription(parsed.description || fallback.description),
      destination: dest,
      travelStyle,
      tripType,
      noOfDays,
      noOfNights,
      hotelName: hotel,
      roomCategory: room,
      mealPlan: mealPlan,
      finalQuotationAmount: fallback.finalQuotationAmount,
      perAdultPrice: fallback.perAdultPrice,
      perKidPrice: fallback.perKidPrice,
      adults: fallback.adults,
      kids: fallback.kids,
      advanceAmountPaid: fallback.advanceAmountPaid,
      balancePendingAmount: fallback.balancePendingAmount,
      highlights: Array.isArray(parsed.highlights) && parsed.highlights.length > 0 ? parsed.highlights : fallback.highlights,
      dayPlans: cleanDayPlans, // STRICT: ALWAYS uses the genuine Zoho-mapped day plans
      inclusions: Array.isArray(parsed.inclusions) && parsed.inclusions.length > 0 ? parsed.inclusions : fallback.inclusions,
      exclusions: Array.isArray(parsed.exclusions) && parsed.exclusions.length > 0 ? parsed.exclusions : fallback.exclusions,
      amenities: Array.isArray(parsed.amenities) && parsed.amenities.length > 0 ? parsed.amenities : fallback.amenities,
      packingTips: Array.isArray(parsed.packingTips) && parsed.packingTips.length > 0 ? parsed.packingTips : fallback.packingTips,
      importantNotes: Array.isArray(parsed.importantNotes) && parsed.importantNotes.length > 0 ? parsed.importantNotes : fallback.importantNotes,
    };
  } catch (error) {
    console.error('[AI Generation Failed, using Clean Fallback]:', error);
    const fallback = generateLuxuryFallback(rawZohoData);
    fallback.dayPlans = cleanDayPlans;
    return fallback;
  }
}

/**
 * Centralized Dynamic Inclusions and Exclusions Engine for Wanderphilia
 * Used across both /sheet-itinerary and /admin/website-itinerary
 */

export const POPULAR_INCLUSIONS_PRESETS = [
  'Private AC Vehicle for all transfers & sightseeing',
  'Accommodation in verified Deluxe / Luxury hotels',
  'Daily Buffet Breakfast at all hotels',
  'Daily Buffet Breakfast & Dinner (MAP Plan)',
  'Airport / Railway Station Pickup & Drop-off Transfers',
  'Driver allowance, fuel, toll taxes, parking & state permits',
  'All transfers & sightseeing as per day-wise itinerary',
  'English Speaking Local Tour Guide for sightseeing tours',
  'All Monument & Heritage Sightseeing Entry Tickets',
  'Complimentary Shikara Ride / Camel Safari experience',
  '24/7 Dedicated On-Trip Ground Support & Concierge',
  'Applicable hotel taxes included in quoted package'
];

export const POPULAR_EXCLUSIONS_PRESETS = [
  '5% GST (unless specifically included in quote breakdown)',
  'Airfare / Train fare (Domestic & International)',
  'Monument & Activity Entry Tickets during sightseeing',
  'Personal expenses (laundry, room service, telephone, tips)',
  'Early check-in (before 2:00 PM) & Late check-out (after 11:00 AM)',
  'Any lunch, snacks, or drinks not specified in inclusions',
  'Travel & Medical Emergency Insurance',
  'Adventure activities, rides & camera fees',
  'Unforeseen expenses due to flight delays, weather or roadblocks'
];

export interface BuildInclusionsParams {
  destination?: string;
  tripType?: 'India' | 'International';
  tourType?: 'Group' | 'Customized';
  vehicleType?: string;
  mealPlan?: string;
  noOfNights?: number;
  roomCategory?: string;
  masterHotelCategory?: string;
  // Day sources: either sheet dayRows or website dayPlans
  dayRows?: any[];
  dayPlans?: any[];
}

/**
 * Extracts pure clean experience title without description or logistics text.
 * E.g. "Jaigarh Fort: Explore the impressive Jaigarh Fort, known for..." -> "Jaigarh Fort"
 * E.g. "Nahargarh Fort With RTDC Durg Cafeteria...: Enjoy a spectacular..." -> "Nahargarh Fort With RTDC Durg Cafeteria..."
 */
export function extractCleanExperienceTitle(raw: string): string {
  let text = (raw || '').trim();
  if (!text) return '';

  // Check if it is logistics or non-experience
  const isLogistics = /^(upon arrival|arrival|arrive|meet our|complete smooth|hotel check|check-?in|check in|check-?out|complete check|freshen up|departure|return flight|drop-?off|drop off|overnight stay|overnight journey|wake up to|enjoy morning breakfast|board your|meals?|transit|scenic drive|accommodation:|transfer to|in the evening,?\s*board)/i.test(text);
  if (isLogistics) return '';

  // Check if en-route
  const isEnRoute = /^(en[- ]?route(?:\s*visit)?:\s*)/i.test(text);
  if (isEnRoute) {
    text = text.replace(/^(en[- ]?route(?:\s*visit)?:\s*)/i, '').trim();
  }

  // If "Title: Description" format, extract ONLY Title
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 120) {
    text = text.slice(0, colonIdx).trim();
  } else if (text.includes(' - ') || text.includes(' – ')) {
    // If "Title - Description" format
    const parts = text.split(/\s+[-–—]\s+/);
    if (parts[0].trim().length > 0 && parts[0].trim().length < 80) {
      text = parts[0].trim();
    }
  } else {
    // If no colon or dash, it is general logistics/narrative sentence, not a structured experience
    return '';
  }

  // Remove any remaining description clause after a colon
  text = text.replace(/:\s*.*$/, '').trim();

  // Strip leading action verbs if needed
  text = text.replace(/^(visit\s+(?:to\s+)?|explore\s+|discover\s+|enjoy\s+|witness\s+|guided\s+tour\s+of\s+|en-route:?|sightseeing(?:\s+of)?:\s*|sightseeing\s+of\s+|sightseeing:?\s*)/i, '').trim();

  if (!text || text.length < 3) return '';

  // Re-prefix en-route if applicable
  if (isEnRoute) {
    return `En-route: ${text.charAt(0).toUpperCase() + text.slice(1)}`;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Cleans an inclusion row: if it contains an experience with a long description,
 * strips the description and keeps ONLY the title.
 */
export function cleanInclusionItem(item: string): string {
  const trimmed = (item || '').trim();
  if (!trimmed) return '';

  // Standard system inclusions (transfers, stay, meals, driver, taxes, assistance)
  if (
    /^(private|dedicated|ac\s+vehicle|accommodation|hotel|meals|daily\s+buffet|driver|fuel|assistance|applicable\s+hotel|first-aid|all\s+transfers|airport|railway|english\s+speaking|5%|unforeseen)/i.test(trimmed)
  ) {
    return trimmed;
  }

  // If it's an experience item with "Title: Description"
  const colonIdx = trimmed.indexOf(':');
  if (colonIdx > 0 && colonIdx < 120 && trimmed.length > colonIdx + 5) {
    const titleCandidate = trimmed.slice(0, colonIdx).trim();
    // Verify it's not a note or meals line
    if (!/^(note|meals|important|timing)/i.test(titleCandidate)) {
      const clean = extractCleanExperienceTitle(trimmed);
      return clean || titleCandidate;
    }
  }

  return trimmed;
}

/**
 * Builds the exact, rich, dynamic package inclusions matching the sheet-itinerary standard.
 * Experiences only show Title (e.g. "Jaigarh Fort", "Patrika Gate"), without descriptions.
 */
export function buildDynamicDefaultInclusions(params: BuildInclusionsParams): string[] {
  const dest = (params.destination || 'Rajasthan').trim() || 'Rajasthan';
  const isIntl = params.tripType === 'International' ||
    /bali|vietnam|thailand|singapore|dubai|maldives|mauritius|sri lanka|bhutan|nepal|turkey|georgia|baku|europe/i.test(dest);
  const isGroup = params.tourType === 'Group';

  // Vehicle framing
  let cleanVehicle = '';
  if (params.vehicleType && params.vehicleType.trim()) {
    const rawVeh = params.vehicleType.trim();
    cleanVehicle = rawVeh.toLowerCase().startsWith('private') || rawVeh.toLowerCase().startsWith('dedicated')
      ? rawVeh
      : (isGroup ? `Dedicated ${rawVeh}` : `Private ${rawVeh}`);
  } else {
    cleanVehicle = isGroup ? 'Dedicated Tempo Traveller / SUV vehicle' : 'Private AC Vehicle';
  }

  const nights = Number(params.noOfNights) > 0 ? Number(params.noOfNights) : 4;
  const room = (params.roomCategory || params.masterHotelCategory || 'Deluxe').trim();
  const meal = (params.mealPlan || (isIntl ? 'Breakfast Only' : 'Breakfast & Dinner')).trim();

  // Extract distinct sightseeing / experiences from day plans or day rows (TITLE ONLY)
  const uniqueExperiences: string[] = [];
  const seen = new Set<string>();

  // 1. If dayRows from sheet-itinerary
  if (Array.isArray(params.dayRows)) {
    params.dayRows.forEach(row => {
      const isGuided = Boolean(row.guidedTour);

      if (Array.isArray(row.enRouteExperiences)) {
        row.enRouteExperiences.forEach((er: string) => {
          const title = extractCleanExperienceTitle(er);
          if (title && !seen.has(title.toLowerCase())) {
            seen.add(title.toLowerCase());
            const hasGuidedTag = /\(\s*guided\s*tour\s*\)/i.test(title);
            uniqueExperiences.push(isGuided && !hasGuidedTag ? `${title} (Guided Tour)` : title);
          }
        });
      }

      if (Array.isArray(row.experiences)) {
        row.experiences.forEach((exp: string) => {
          const title = extractCleanExperienceTitle(exp);
          if (title && !seen.has(title.toLowerCase())) {
            seen.add(title.toLowerCase());
            const hasGuidedTag = /\(\s*guided\s*tour\s*\)/i.test(title);
            uniqueExperiences.push(isGuided && !hasGuidedTag ? `${title} (Guided Tour)` : title);
          }
        });
      }
    });
  }

  // 2. If dayPlans from website-itinerary
  if (Array.isArray(params.dayPlans)) {
    params.dayPlans.forEach(dp => {
      const lines: string[] = Array.isArray(dp.description)
        ? dp.description
        : (Array.isArray(dp.timeline)
            ? dp.timeline
            : (typeof dp.description === 'string' ? dp.description.split('\n') : []));

      lines.forEach((pt: string) => {
        const raw = (pt || '').trim();
        if (raw) {
          const title = extractCleanExperienceTitle(raw);
          if (title) {
            const lower = title.toLowerCase();
            if (!seen.has(lower) && uniqueExperiences.length < 35) {
              seen.add(lower);
              uniqueExperiences.push(title);
            }
          }
        }
      });
    });
  }

  const hasLunch = /lunch|all\s*meals|apai/i.test(meal);
  const isBreakfastOnly = /cp|breakfast\s*only/i.test(meal) || (isIntl && !/dinner|map/i.test(meal));

  let mealDesc = '';
  if (hasLunch) {
    mealDesc = `Meals ${meal} (Breakfast, Lunch & Dinner as per itinerary schedule).`;
  } else if (isBreakfastOnly) {
    mealDesc = `Daily Buffet Breakfast at all hotels (CP Plan).`;
  } else {
    mealDesc = `Meals ${meal} (Breakfast except 1st Day, Dinner on last day).`;
  }

  const list: string[] = [
    `${cleanVehicle} for the complete ${dest} itinerary and Airport / Station Transfers.`,
    `Accommodation in verified ${room} Properties For ${nights} Nights.`,
    mealDesc,
    `Driver allowance, fuel charges, state permits, toll taxes and parking charges.`,
    `All transfers and sightseeing tours as per the day-wise itinerary schedule.`
  ];

  if (uniqueExperiences.length > 0) {
    list.push(...uniqueExperiences);
  }

  list.push(
    `Assistance during hotel check-in and check-out.`,
    `Applicable hotel taxes included in the quoted package.`
  );

  return list;
}

/**
 * Builds the exact, rich, dynamic package exclusions matching the sheet-itinerary standard.
 */
export function buildDynamicDefaultExclusions(params?: { mealPlan?: string; tripType?: string }): string[] {
  const meal = typeof params === 'string' ? params : (params?.mealPlan || '');
  const isIntl = params && typeof params === 'object' && params.tripType === 'International';
  const hasLunch = /lunch|all\s*meals|apai/i.test(meal);

  return [
    isIntl
      ? `5% GST & applicable TCS (unless explicitly included in pricing breakdown).`
      : `5% GST (unless explicitly included in pricing breakdown).`,
    `Early check-in (before 2:00 PM) & late check-out (after 11:00 AM) at hotels.`,
    `Airfare or Train fare other than specifically mentioned in inclusions.`,
    `Monument entry tickets, camera fees, or audio guides during sightseeing.`,
    `Personal expenses (room service, laundry, telephone calls, tips & alcoholic drinks).`,
    hasLunch
      ? `Any additional meals, snacks, or alcoholic drinks not mentioned in the Package Inclusions.`
      : `Any lunch or additional meals not mentioned in the Package Inclusions.`,
    `Unforeseen costs due to flight delays, weather conditions, landslides or roadblocks.`
  ];
}


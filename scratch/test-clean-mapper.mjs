import { MongoClient } from 'mongodb';

export function isInternationalTrip(destination = '', destinationType = '') {
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

const KNOWN_ROUTES = {
  // Rajasthan & Golden Triangle
  'jaipur|ranthambore': { km: 160, duration: '3.5 - 4 Hrs' },
  'jaipur|sawai madhopur': { km: 160, duration: '3.5 - 4 Hrs' },
  'ranthambore|agra': { km: 260, duration: '5.5 - 6 Hrs' },
  'sawai madhopur|agra': { km: 260, duration: '5.5 - 6 Hrs' },
  'jaipur|agra': { km: 240, duration: '4.5 - 5 Hrs' },
  'delhi|agra': { km: 230, duration: '3.5 - 4 Hrs' },
  'agra|delhi': { km: 230, duration: '3.5 - 4 Hrs' },
  'delhi|jaipur': { km: 280, duration: '5 - 5.5 Hrs' },
  'jaipur|delhi': { km: 280, duration: '5 - 5.5 Hrs' },
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

export function getRouteTransitInfo(city1, city2) {
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

export function getMealPlanForDay(dayIndex, totalDays, isInternational) {
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
 * Frames a rich sentence explaining what happens in an en-route experience
 */
export function frameEnRouteExperienceSentence(enRoute = '') {
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

export function frameExperienceSentence(exp, city = '') {
  const name = (exp.name || '').trim();
  if (!name) return '';

  const detail = (exp.inclusionDescription || exp.description || exp.subTitle || '').trim();

  if (detail && detail.toLowerCase() !== name.toLowerCase()) {
    const cleanedDetail = detail.replace(/^["']|["']$/g, '').trim();
    if (cleanedDetail.toLowerCase().startsWith(name.toLowerCase())) {
      return cleanedDetail.endsWith('.') ? cleanedDetail : `${cleanedDetail}.`;
    }
    return `**${name}**: ${cleanedDetail.endsWith('.') ? cleanedDetail : `${cleanedDetail}.`}`;
  }

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

export function parseRawSubformToDayActivities(rawSubform) {
  if (!Array.isArray(rawSubform)) return [];

  const dayActivities = [];

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

    const experiences = [];
    const seenExpNames = new Set();

    for (let e = 1; e <= 4; e++) {
      const expKey = e === 1 ? (row.Experiences_and_activities || row.Experiences_1) : row[`Experiences_${e}`];
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

export function buildCleanDayPlansFromZoho(
  dayActivities = [],
  hotels = [],
  destination = '',
  totalDays = 0,
  fallbackMealPlan = '',
  destinationType = ''
) {
  const isIntl = isInternationalTrip(destination, destinationType);
  const totalCount = Math.max(dayActivities.length, totalDays || 0, 1);

  const getStayForDay = (dayNum, currentCity) => {
    if (currentCity) {
      const match = hotels.find(
        h => h.city && h.city.toLowerCase().trim() === currentCity.toLowerCase().trim()
      );
      if (match && match.hotelName) {
        return `${match.hotelName}, ${match.city || currentCity}`;
      }
    }
    if (hotels.length > 0) {
      let cumulativeNights = 0;
      for (const h of hotels) {
        cumulativeNights += (h.nights || 0);
        if (dayNum <= cumulativeNights && h.hotelName) {
          if (!h.city || !currentCity || h.city.toLowerCase().trim() === currentCity.toLowerCase().trim()) {
            return `${h.hotelName}, ${h.city || currentCity || destination}`;
          }
        }
      }
      if (hotels.length === 1 && !hotels[0].city && hotels[0].hotelName) {
        return `${hotels[0].hotelName}, ${currentCity || destination}`;
      }
    }
    return currentCity ? `Selected Hotel, ${currentCity}` : destination || 'Selected Hotel';
  };

  const dayPlans = [];

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

    const uniqueExps = [];
    const seenNames = new Set();
    (act.experiences || []).forEach(exp => {
      const n = (exp.name || '').trim();
      if (n && !seenNames.has(n.toLowerCase())) {
        seenNames.add(n.toLowerCase());
        uniqueExps.push(exp);
      }
    });

    const expNames = uniqueExps.map(e => e.name);

    const joinWithAmp = (items) => {
      if (items.length <= 1) return items[0] || '';
      if (items.length === 2) return `${items[0]} & ${items[1]}`;
      return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
    };

    const joinWithAnd = (items) => {
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
    const activities = [];
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
    const timeline = [];

    // Step 1: Morning Start / Arrival / Departure
    if (isFirstDay) {
      timeline.push(
        isIntl
          ? `Arrival at ${city1} International Airport, meet our local representative after immigration, and transfer to your hotel.`
          : `Arrival at ${city1} Airport / Railway Station, meet our tour representative, and transfer to your hotel.`
      );
      timeline.push(`Complete smooth hotel check-in formalities and refresh at ${stayLocation}.`);
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
      timeline.push(`Arrive in ${toCity} and complete check-in formalities at ${stayLocation}.`);
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
      if (isIntl) {
        timeline.push(`Spend the evening at leisure followed by an overnight stay at ${stayLocation}.`);
      } else {
        timeline.push(`Enjoy dinner and a comfortable overnight stay at ${stayLocation}.`);
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

// Test with Bhavin Thakker's exact screenshot subform:
const bhavinSubform = [
  { Days: 'Day 1', City: 'Jaipur', City_2: '', En_route_Experiences: '', Experiences_1: 'Nahagarh Sunset Experience', Inclusions_Description_1: 'Nahgarh sits on the Aravalli ridge overlooking jaipur and offers spectacular city views.' },
  { Days: 'Day 2', City: 'Jaipur', City_2: '', En_route_Experiences: '', Experiences_1: 'Jaipur City Tour', Inclusions_Description_1: 'Hawa Mahal, City Palace, Amber Fort.', Experiences_2: 'Elephant Village Experience', Inclusions_Description_2: 'Can enjoy elephant Feeding,baithing & painting.', Experiences_3: 'Jaipur Pink City Bazaar Tour', Inclusions_Description_3: 'Social Food Local Interaction.' },
  { Days: 'Day 3', City: 'Jaipur', City_2: 'Ranthambore', En_route_Experiences: '', Experiences_1: 'Evening Leisure', Inclusions_Description_1: 'Enjoy the peaceful surrounding, soak in the tranquil wilderness of Ranthambore.' },
  { Days: 'Day 4', City: 'Ranthambore', City_2: 'Agra', En_route_Experiences: '', Experiences_1: 'Evening Leisure', Inclusions_Description_1: 'Enjoy the peaceful surrounding, soak in the tranquil wilderness of Ranthambore.' },
  { Days: 'Day 5', City: 'Agra', City_2: '', En_route_Experiences: '', Experiences_1: 'Taj Mahal Visit with City Tour', Inclusions_Description_1: 'Guided Taj Mahal and city Tour.', Experiences_2: 'Evening Sunset at Mehta Bagh' },
  { Days: 'Day 6', City: 'Agra', City_2: 'Delhi', En_route_Experiences: 'Vrindavan Darshan' }
];

const parsedAct = parseRawSubformToDayActivities(bhavinSubform);
const hotels = [
  { hotelName: 'Standard Hotel', city: 'Jaipur', nights: 2 },
  { hotelName: 'Selected Wildlife Resort', city: 'Ranthambore', nights: 1 },
  { hotelName: 'Curated Heritage Stay', city: 'Agra', nights: 2 }
];

const plans = buildCleanDayPlansFromZoho(parsedAct, hotels, 'Rajasthan & Agra', 6, '', 'India');
console.log('=== BHAVIN THAKKER SCREENSHOT RESULT ===');
console.log(JSON.stringify(plans, null, 2));

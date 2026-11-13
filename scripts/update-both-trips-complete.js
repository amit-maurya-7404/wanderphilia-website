const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

function extractCleanExperienceTitle(raw) {
  let text = (raw || '').trim();
  if (!text) return '';

  const isLogistics = /^(upon arrival|arrival|arrive|meet our|complete smooth|hotel check|check-?in|check in|check-?out|complete check|freshen up|departure|return flight|drop-?off|drop off|overnight stay|overnight journey|wake up to|enjoy morning breakfast|board your|meals?|transit|scenic drive|accommodation:|transfer to|in the evening,?\s*board)/i.test(text);
  if (isLogistics) return '';

  const isEnRoute = /^(en[- ]?route(?:\s*visit)?:\s*)/i.test(text);
  if (isEnRoute) {
    text = text.replace(/^(en[- ]?route(?:\s*visit)?:\s*)/i, '').trim();
  }

  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 120) {
    text = text.slice(0, colonIdx).trim();
  } else if (text.includes(' - ') || text.includes(' – ')) {
    const parts = text.split(/\s+[-–—]\s+/);
    if (parts[0].trim().length > 0 && parts[0].trim().length < 80) {
      text = parts[0].trim();
    }
  } else {
    return '';
  }

  text = text.replace(/:\s*.*$/, '').trim();
  text = text.replace(/^(visit\s+(?:to\s+)?|explore\s+|discover\s+|enjoy\s+|witness\s+|guided\s+tour\s+of\s+|en-route:?|sightseeing(?:\s+of)?:\s*|sightseeing\s+of\s+|sightseeing:?\s*)/i, '').trim();

  if (!text || text.length < 3) return '';

  if (isEnRoute) {
    return `En-route: ${text.charAt(0).toUpperCase() + text.slice(1)}`;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildDynamicDefaultInclusions(params) {
  const dest = (params.destination || 'Rajasthan').trim() || 'Rajasthan';
  const isIntl = params.tripType === 'International' ||
    /bali|vietnam|thailand|singapore|dubai|maldives|mauritius|sri lanka|bhutan|nepal|turkey|georgia|baku|europe/i.test(dest);
  const isGroup = params.tourType === 'Group';

  let cleanVehicle = '';
  if (params.vehicleType && params.vehicleType.trim()) {
    const rawVeh = params.vehicleType.trim();
    cleanVehicle = rawVeh.toLowerCase().startsWith('private') || rawVeh.toLowerCase().startsWith('dedicated')
      ? rawVeh
      : (isGroup ? `Dedicated ${rawVeh}` : `Private ${rawVeh}`);
  } else {
    cleanVehicle = isGroup ? 'Dedicated Tempo Traveller / SUV vehicle' : 'Private AC Vehicle';
  }

  const nights = Number(params.noOfNights) > 0 ? Number(params.noOfNights) : 7;
  const room = (params.roomCategory || params.masterHotelCategory || 'Deluxe').trim();
  const meal = (params.mealPlan || (isIntl ? 'Breakfast Only' : 'Breakfast & Dinner')).trim();

  const uniqueExperiences = [];
  const seen = new Set();

  if (Array.isArray(params.dayPlans)) {
    params.dayPlans.forEach(dp => {
      const lines = Array.isArray(dp.description)
        ? dp.description
        : (Array.isArray(dp.timeline)
            ? dp.timeline
            : (typeof dp.description === 'string' ? dp.description.split('\n') : []));

      lines.forEach(pt => {
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

  const list = [
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

function buildDynamicDefaultExclusions(params) {
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

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const trips = await db.collection('trips').find({}).toArray();

  for (const t of trips) {
    const dayPlans = t.itinerary || t.dayPlans || [];
    const nights = (dayPlans.length > 1) ? dayPlans.length - 1 : 7;
    const isGroup = t.tourType === 'Group' || (t.id && t.id.toLowerCase().includes('group'));
    const vehicleType = t.vehicleType || (isGroup ? 'Dedicated Tempo Traveller / SUV vehicle' : 'Private AC Vehicle');
    const roomCategory = t.globalHotelCategory || t.roomCategory || (t.id && t.id.toLowerCase().includes('exclusive') ? 'Super Deluxe' : 'Deluxe');
    const mealPlan = t.globalMealPlan || t.mealPlan || 'Breakfast & Dinner';

    const newInclusions = buildDynamicDefaultInclusions({
      destination: t.destination || 'Rajasthan',
      tripType: t.category === 'International' ? 'International' : 'India',
      tourType: isGroup ? 'Group' : 'Customized',
      vehicleType: vehicleType,
      mealPlan: mealPlan,
      noOfNights: Number(nights),
      roomCategory: roomCategory,
      dayPlans: dayPlans
    });

    const newExclusions = buildDynamicDefaultExclusions({
      mealPlan: mealPlan,
      tripType: t.category === 'International' ? 'International' : 'India'
    });

    console.log(`\nUpdating Trip: ${t.title}`);
    console.log('Inclusions count:', newInclusions.length);
    console.log('Exclusions count:', newExclusions.length);

    // Update ALL 4 inclusion/exclusion fields in trips collection
    const res = await db.collection('trips').updateOne(
      { _id: t._id },
      {
        $set: {
          included: newInclusions,
          inclusions: newInclusions,
          notIncluded: newExclusions,
          exclusions: newExclusions,
          updatedAt: new Date()
        }
      }
    );

    console.log('Trip update acknowledged:', res.acknowledged, 'modifiedCount:', res.modifiedCount);

    // Also update in itineraries collection if present
    await db.collection('itineraries').updateMany(
      { $or: [{ id: t.id }, { slug: t.slug }, { id: t.slug }] },
      {
        $set: {
          included: newInclusions,
          inclusions: newInclusions,
          notIncluded: newExclusions,
          exclusions: newExclusions,
          updatedAt: new Date()
        }
      }
    );
  }

  await client.close();
}

run().catch(console.error);


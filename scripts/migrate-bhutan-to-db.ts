import fs from 'fs';
import { MongoClient } from 'mongodb';
import { trips } from '../lib/data';

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!uriLine) throw new Error('MONGODB_URI not found');
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const bhutanIds = ['15', '16', '17', '18'];
  const targets = trips.filter(t => bhutanIds.includes(t.id));

  console.log(`Found ${targets.length} Bhutan trips in lib/data.ts:`);

  for (const t of targets) {
    const isGroup = t.id === '15' || t.id === '16';

    const placements = {
      homepage: true,
      indiaTrips: false,
      internationalTrips: true,
      upcomingTours: isGroup,
      honeymoon: false,
      christmasNewYear: false,
      destinationPage: true,
      destinationCategory: 'bhutan',
      sections: {
        available: true,
        group: isGroup,
        family: false,
        honeymoon: false,
        custom: false,
        related: false,
      }
    };

    // Calculate fallback price if 0 from costingDetails
    let price = t.price;
    if (!price || price === 0) {
      if (t.costingDetails && t.costingDetails.length > 0) {
        const val = t.costingDetails[0].value.replace(/[^0-9]/g, '');
        if (val) price = parseInt(val, 10);
      }
      if (!price || price === 0) price = 31000;
    }

    // Keep ALL existing fields 100% untouched
    const tripDoc = {
      ...t,
      price,
      tourType: isGroup ? 'Group' : 'Customized',
      inclusions: t.inclusions || t.included || [],
      exclusions: t.exclusions || t.notIncluded || [],
      placements,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'mongodb'
    };

    console.log(`\n--- UPLOADING TRIP ${t.id}: "${t.title}" ---`);
    console.log(`  Slug: ${t.slug}`);
    console.log(`  Duration: ${t.duration} Days`);
    console.log(`  Price: ₹${tripDoc.price}`);
    console.log(`  TourType: ${tripDoc.tourType}`);
    console.log(`  Days in itinerary: ${t.itinerary?.length || 0}`);
    console.log(`  Inclusions count: ${tripDoc.inclusions.length}`);
    console.log(`  Exclusions count: ${tripDoc.exclusions.length}`);
    console.log(`  Sections:`, placements.sections);

    const res = await db.collection('trips').updateOne(
      { $or: [{ slug: t.slug }, { id: t.id }] },
      { $set: tripDoc },
      { upsert: true }
    );

    console.log(`  MongoDB Result: matched=${res.matchedCount}, modified=${res.modifiedCount}, upsertedId=${res.upsertedId}`);
  }

  const totalCount = await db.collection('trips').countDocuments();
  console.log(`\n========================================`);
  console.log(`Total trips in MongoDB now: ${totalCount}`);

  const allDbTrips = await db.collection('trips').find({}, { projection: { id: 1, title: 1, destination: 1, tourType: 1 } }).toArray();
  allDbTrips.forEach((t, i) => {
    console.log(`${i + 1}. [${t.destination}] (${t.tourType}) ${t.title} (ID: ${t.id})`);
  });

  await client.close();
}

run().catch(console.error);


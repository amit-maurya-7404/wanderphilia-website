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

  const sikkimIds = ['24', '25', '26', '27', '28'];
  const targets = trips.filter(t => sikkimIds.includes(t.id));

  console.log(`Found ${targets.length} Sikkim trips in lib/data.ts:`);

  for (const t of targets) {
    // Determine section flags based on their exact current mapping:
    // 24: Family, Custom, Available
    // 25: Couple/Honeymoon, Custom, Available
    // 26: Family, Custom, Available
    // 27: Custom, Available
    // 28: Couple/Honeymoon, Custom, Available
    const isCouple = t.id === '25' || t.id === '28';
    const isFamily = t.id === '24' || t.id === '26';
    const isGroup = false;

    const placements = {
      homepage: true,
      indiaTrips: true,
      internationalTrips: false,
      upcomingTours: false,
      honeymoon: isCouple,
      christmasNewYear: false,
      destinationPage: true,
      destinationCategory: 'sikkim',
      sections: {
        available: true,
        group: isGroup,
        family: isFamily,
        honeymoon: isCouple,
        custom: true,
        related: false,
      }
    };

    // Keep ALL existing fields 100% exactly as they are in lib/data.ts
    const tripDoc = {
      ...t,
      // Ensure tourType is set
      tourType: t.tourType || 'Customized',
      // Ensure inclusions and exclusions alias fields are populated matching included / notIncluded
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
    console.log(`  Price: ₹${t.price}`);
    console.log(`  Days in itinerary: ${t.itinerary?.length || 0}`);
    console.log(`  Inclusions count: ${tripDoc.inclusions.length}`);
    console.log(`  Exclusions count: ${tripDoc.exclusions.length}`);
    console.log(`  Sections:`, placements.sections);

    // Upsert into db.collection('trips') by slug or id
    const res = await db.collection('trips').updateOne(
      { $or: [{ slug: t.slug }, { id: t.id }] },
      { $set: tripDoc },
      { upsert: true }
    );

    console.log(`  MongoDB Result: matched=${res.matchedCount}, modified=${res.modifiedCount}, upsertedId=${res.upsertedId}`);
  }

  // Verify total trips in database now
  const count = await db.collection('trips').countDocuments();
  console.log(`\n========================================`);
  console.log(`Total trips in MongoDB now: ${count}`);
  
  const allDbTrips = await db.collection('trips').find({}, { projection: { id: 1, title: 1, destination: 1, 'placements.destinationCategory': 1 } }).toArray();
  allDbTrips.forEach((t, i) => {
    console.log(`${i + 1}. [${t.destination || (t.placements as any)?.destinationCategory}] ${t.title} (ID: ${t.id})`);
  });

  await client.close();
}

run().catch(console.error);


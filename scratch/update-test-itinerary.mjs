import { MongoClient } from 'mongodb';
import { generateItineraryContentWithAI } from '../lib/ai-itinerary.js';

// We will load the doc from MongoDB, run generateLuxuryFallback/generateItineraryContentWithAI on rawZohoData, and update the doc
async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const collection = db.collection('itineraries');

  const doc = await collection.findOne({ id: 'wp-ca994fc4' });
  if (!doc) {
    console.error('Doc wp-ca994fc4 not found');
    await client.close();
    return;
  }

  console.log('Original Day Plans in DB:');
  console.log(JSON.stringify(doc.dayPlans, null, 2));

  // Re-generate dayPlans using clean builder
  const rawData = doc.rawZohoData || {};
  const content = await generateItineraryContentWithAI(rawData);

  console.log('\n--- CLEAN GENERATED DAY PLANS ---');
  console.log(JSON.stringify(content.dayPlans, null, 2));

  await collection.updateOne(
    { id: 'wp-ca994fc4' },
    {
      $set: {
        title: content.title,
        subTitle: content.subTitle,
        description: content.description,
        dayPlans: content.dayPlans,
        highlights: content.highlights,
        inclusions: content.inclusions,
        exclusions: content.exclusions,
        amenities: content.amenities,
        updatedAt: new Date()
      }
    }
  );

  console.log('\nSuccessfully updated wp-ca994fc4 in MongoDB!');
  await client.close();
}

main().catch(console.error);

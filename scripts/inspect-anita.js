const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');
  const doc = await db.collection('itineraries').findOne({
    $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }]
  });
  console.log('Found doc:', JSON.stringify({
    id: doc?.id,
    slug: doc?.slug,
    title: doc?.title,
    destination: doc?.destination,
    noOfDays: doc?.noOfDays,
    noOfNights: doc?.noOfNights,
    highlights: doc?.highlights,
    inclusions: doc?.inclusions,
    exclusions: doc?.exclusions,
    dayPlans: doc?.dayPlans,
    hotels: doc?.hotels,
    finalQuotationAmount: doc?.finalQuotationAmount,
    perAdultPrice: doc?.perAdultPrice,
    rawZohoData: doc?.rawZohoData ? 'exists' : undefined
  }, null, 2));
  await client.close();
}

run().catch(console.error);


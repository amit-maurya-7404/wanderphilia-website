import { MongoClient } from 'mongodb';

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const collection = db.collection('itineraries');
  
  const doc = await collection.findOne({ id: 'wp-ca994fc4' });
  console.log('--- FOUND ITINERARY wp-ca994fc4 ---');
  console.log(JSON.stringify(doc, null, 2));

  await client.close();
}

main().catch(console.error);

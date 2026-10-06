import fs from 'fs';
import { MongoClient } from 'mongodb';

let uri = '';
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    if (line.trim().startsWith('MONGODB_URI=')) {
      uri = line.trim().substring('MONGODB_URI='.length).replace(/^['"]|['"]$/g, '').trim();
    }
  }
}

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');
  const doc = await db.collection('itineraries').findOne({ id: 'wp-4002b3f4' });
  console.log(JSON.stringify(doc, null, 2));
  await client.close();
}

run();

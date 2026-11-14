import fs from 'fs';
import { MongoClient } from 'mongodb';
import { blogs } from '../lib/data';

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!uriLine) throw new Error('MONGODB_URI not found');
const uri = uriLine.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');

async function seedBlogs() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    const db = client.db('wanderphilia');
    const collection = db.collection('blogs');

    await collection.createIndex({ slug: 1 }, { unique: true });
    console.log('Unique index on slug verified.');

    for (const blog of blogs) {
      const doc = {
        ...blog,
        status: 'published',
        updatedAt: new Date().toISOString(),
      };

      await collection.updateOne(
        { slug: blog.slug },
        { 
          $set: doc,
          $setOnInsert: { createdAt: new Date().toISOString() }
        },
        { upsert: true }
      );
      console.log(`Synced blog: "${blog.title}" (${blog.slug})`);
    }

    const count = await collection.countDocuments();
    console.log(`Done! Total blogs in database: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedBlogs();

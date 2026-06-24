const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const matched = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (matched) {
      const key = matched[1];
      let value = matched[2] || '';
      // Remove surrounding quotes if any
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  console.log('Attempting to connect to MongoDB Atlas...');
  console.log('URI:', uri.replace(/:([^@]+)@/, ':****@')); // Mask password

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');
    
    // Parse database name
    const url = new URL(uri.trim());
    const dbName = url.pathname.replace('/', '') || 'wanderphilia';
    console.log('Database Name:', dbName);

    const db = client.db(dbName);
    
    // Test fetch reviews count
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(col => console.log(` - ${col.name}`));

    const count = await db.collection('reviews').countDocuments();
    console.log(`\nFound ${count} reviews in 'reviews' collection.`);
    
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error message:', error.message);
    if (error.message.includes('IP') || error.message.includes('whitelist') || error.name === 'MongoServerSelectionError') {
      console.log('\nTIP: This error typically means the IP address is blocked by MongoDB Atlas Network Access rules, or credentials are invalid.');
    }
  } finally {
    await client.close();
  }
}

run();

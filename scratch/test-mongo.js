const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://testuser:testpassword123@wanderphilia.2frlzgl.mongodb.net/wanderphilia?appName=wanderphilia";

async function run() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    autoSelectFamily: false
  });
  
  try {
    console.log("Attempting to connect to MongoDB Atlas with testuser...");
    await client.connect();
    console.log("Connected successfully!");
    
    const db = client.db('wanderphilia');
    console.log("Database Name:", db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const reviewsCount = await db.collection('reviews').countDocuments();
    console.log("Reviews Count:", reviewsCount);
    
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

run();

const { MongoClient } = require('mongodb');

async function testConnection(uri, label) {
  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 3000,
    autoSelectFamily: false
  });
  
  try {
    console.log(`\n--- Testing: ${label} ---`);
    await client.connect();
    console.log("SUCCESS!");
    const db = client.db('wanderphilia');
    console.log("Connected to Database:", db.databaseName);
    return true;
  } catch (error) {
    console.error("FAILED:", error.message || error);
    return false;
  } finally {
    await client.close();
  }
}

async function run() {
  const uris = [
    {
      label: "Standard URI (no database path)",
      uri: "mongodb+srv://testuser:testpassword123@wanderphilia.2frlzgl.mongodb.net/?appName=wanderphilia"
    },
    {
      label: "URI with database path",
      uri: "mongodb+srv://testuser:testpassword123@wanderphilia.2frlzgl.mongodb.net/wanderphilia?appName=wanderphilia"
    },
    {
      label: "URI with authSource=admin",
      uri: "mongodb+srv://testuser:testpassword123@wanderphilia.2frlzgl.mongodb.net/wanderphilia?authSource=admin&appName=wanderphilia"
    },
    {
      label: "URI with authSource=wanderphilia",
      uri: "mongodb+srv://testuser:testpassword123@wanderphilia.2frlzgl.mongodb.net/wanderphilia?authSource=wanderphilia&appName=wanderphilia"
    }
  ];

  for (const item of uris) {
    const success = await testConnection(item.uri, item.label);
    if (success) {
      console.log(`\n🎉 Connection succeeded using: ${item.label}`);
      break;
    }
  }
}

run();

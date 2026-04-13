import { MongoClient, MongoClientOptions } from 'mongodb'

type MongoGlobal = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalMongo = globalThis as MongoGlobal

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
}

function getMongoUri() {
  let uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in .env.local or Vercel environment variables.')
  }

  uri = uri.trim()
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim()
  }

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in .env.local or Vercel environment variables.')
  }

  return uri
}

function getDatabaseName() {
  const explicitDb = process.env.MONGODB_DB
  if (explicitDb) {
    return explicitDb
  }

  const uri = getMongoUri()
  try {
    const url = new URL(uri)
    const pathname = url.pathname.replace('/', '')
    if (pathname) {
      return pathname
    }
  } catch {
    // Not a standard URL object, fall back to parse path manually
  }

  const afterSlash = uri.split('/').slice(3).join('/')
  const [databaseName] = afterSlash.split('?')
  return databaseName || 'wanderphilia'
}

function createMongoClient() {
  return new MongoClient(getMongoUri(), options)
}

function getClientPromise() {
  if (!globalMongo._mongoClientPromise) {
    globalMongo._mongoClientPromise = createMongoClient().connect()
  }
  return globalMongo._mongoClientPromise
}

export async function getDb() {
  const client = await getClientPromise()
  return client.db(getDatabaseName())
}

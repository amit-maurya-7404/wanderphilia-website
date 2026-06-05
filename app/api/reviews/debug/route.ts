import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { syncGoogleReviews } from '@/lib/google-reviews'

export const dynamic = 'force-dynamic'

function obfuscateUri(uri: string | undefined) {
  if (!uri) return null
  return uri.replace(/:([^:@]+)@/, ':****@')
}

function getPasswordLength(uri: string | undefined) {
  if (!uri) return 0
  const match = uri.match(/:([^:@]+)@/)
  return match ? match[1].length : 0
}

function getPasswordHint(uri: string | undefined) {
  if (!uri) return null
  const match = uri.match(/:([^:@]+)@/)
  if (!match) return null
  const pwd = match[1]
  if (pwd.length === 0) return null
  return `${pwd[0]}...${pwd[pwd.length - 1]}`
}

function getPasswordCharCodes(uri: string | undefined) {
  if (!uri) return []
  const match = uri.match(/:([^:@]+)@/)
  if (!match) return []
  const pwd = match[1]
  return Array.from(pwd).map(c => c.charCodeAt(0))
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  const mongoUri = process.env.MONGODB_URI
  const mongodbDb = process.env.MONGODB_DB

  let mongoStatus = 'unknown'
  let mongoError = null
  let dbName = null
  try {
    const db = await getDb()
    mongoStatus = 'connected'
    dbName = db.databaseName
  } catch (err: any) {
    mongoStatus = 'error'
    mongoError = err.message || String(err)
  }

  let syncResult = null
  try {
    syncResult = await syncGoogleReviews(true)
  } catch (err: any) {
    syncResult = { success: false, error: err.message || String(err) }
  }

  return NextResponse.json({
    env: {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 6) + '...' : null,
      hasPlaceId: !!placeId,
      placeId: placeId || null,
      hasMongoUri: !!mongoUri,
      mongoUriLength: mongoUri ? mongoUri.length : 0,
      obfuscatedMongoUri: obfuscateUri(mongoUri),
      passwordLength: getPasswordLength(mongoUri),
      passwordHint: getPasswordHint(mongoUri),
      passwordCharCodes: getPasswordCharCodes(mongoUri),
      mongodbDb: mongodbDb || null,
    },
    mongodb: {
      status: mongoStatus,
      dbName,
      error: mongoError,
    },
    syncResult,
  })
}

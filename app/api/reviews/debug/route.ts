import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { syncGoogleReviews } from '@/lib/google-reviews'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  const mongoUri = process.env.MONGODB_URI

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
    },
    mongodb: {
      status: mongoStatus,
      dbName,
      error: mongoError,
    },
    syncResult,
  })
}

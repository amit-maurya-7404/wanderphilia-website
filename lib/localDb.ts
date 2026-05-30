import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

type LocalCollectionName = 'gallery' | 'reels' | 'reviews'

interface LocalDbShape {
  gallery: Array<Record<string, unknown>>
  reels: Array<Record<string, unknown>>
  reviews: Array<Record<string, unknown>>
  metadata?: Record<string, unknown>
}

const localDbPath = path.join(process.cwd(), 'data', 'local-db.json')

const defaultLocalDb: LocalDbShape = {
  gallery: [],
  reels: [],
  reviews: [],
  metadata: {},
}

async function ensureLocalDb() {
  const dir = path.dirname(localDbPath)
  if (!fs.existsSync(dir)) {
    await fsPromises.mkdir(dir, { recursive: true })
  }

  if (!fs.existsSync(localDbPath)) {
    await fsPromises.writeFile(localDbPath, JSON.stringify(defaultLocalDb, null, 2), 'utf8')
  }
}

async function readLocalDb(): Promise<LocalDbShape> {
  await ensureLocalDb()

  const fileContents = await fsPromises.readFile(localDbPath, 'utf8')
  try {
    const parsed = JSON.parse(fileContents) as Partial<LocalDbShape>
    return {
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
      reels: Array.isArray(parsed.reels) ? parsed.reels : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      metadata: parsed.metadata && typeof parsed.metadata === 'object' ? parsed.metadata : {},
    }
  } catch {
    return defaultLocalDb
  }
}

async function writeLocalDb(data: LocalDbShape) {
  await ensureLocalDb()
  await fsPromises.writeFile(localDbPath, JSON.stringify(data, null, 2), 'utf8')
}

export async function readLocalCollection(collection: LocalCollectionName) {
  const db = await readLocalDb()
  return db[collection]
}

export async function saveLocalDocument(collection: LocalCollectionName, document: Record<string, unknown>) {
  const db = await readLocalDb()
  const stored = {
    ...document,
    _id: typeof document._id === 'string' ? document._id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: typeof document.createdAt === 'string' ? document.createdAt : new Date().toISOString(),
  }

  db[collection] = [stored, ...(db[collection] ?? [])]
  await writeLocalDb(db)
  return stored
}

export async function readLocalMetadata() {
  const db = await readLocalDb()
  return db.metadata || {}
}

export async function writeLocalMetadata(metadata: Record<string, unknown>) {
  const db = await readLocalDb()
  db.metadata = {
    ...(db.metadata || {}),
    ...metadata,
  }
  await writeLocalDb(db)
  return db.metadata
}

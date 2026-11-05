import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { BUILTIN_DESTINATIONS, DestinationPageItem } from '@/lib/destinations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const db = await getDb();
    const collection = db.collection('destinations');

    if (slug) {
      const cleanSlug = slug.toLowerCase().trim();
      // 1. Try DB first
      const destination = await collection.findOne({ slug: cleanSlug });
      if (destination) {
        return NextResponse.json({
          ...destination,
          _id: destination._id.toString(),
        });
      }

      // 2. Fallback to builtin
      const builtin = BUILTIN_DESTINATIONS.find((b) => b.slug.toLowerCase() === cleanSlug);
      if (builtin) {
        return NextResponse.json(builtin);
      }

      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Return list of all active destinations
    const dbDestinations = await collection.find({ isActive: { $ne: false } }).toArray();
    const dbMap = new Map<string, DestinationPageItem>();

    dbDestinations.forEach((item: any) => {
      dbMap.set(item.slug.toLowerCase(), {
        ...item,
        _id: item._id.toString(),
      });
    });

    const combined: DestinationPageItem[] = [];
    dbMap.forEach((val) => combined.push(val));

    BUILTIN_DESTINATIONS.forEach((builtin) => {
      if (!dbMap.has(builtin.slug.toLowerCase())) {
        combined.push(builtin);
      }
    });

    return NextResponse.json(combined);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const placement = searchParams.get('placement');

    const db = await getDb();
    const collection = db.collection('trips');

    if (slug) {
      const trip = await collection.findOne({
        $or: [{ slug: slug }, { id: slug }]
      });
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json(trip);
    }

    if (id) {
      let query: any = { $or: [{ id: id }, { slug: id }] };
      if (ObjectId.isValid(id)) {
        query.$or.push({ _id: new ObjectId(id) });
      }
      const trip = await collection.findOne(query);
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json(trip);
    }

    let query: any = {};

    if (category) {
      query.$or = [
        { category: { $regex: category, $options: 'i' } },
        { destination: { $regex: category, $options: 'i' } },
        { region: { $regex: category, $options: 'i' } },
        { 'placements.destinationCategory': { $regex: category, $options: 'i' } }
      ];
    }

    if (placement) {
      query[`placements.${placement}`] = true;
    }

    const trips = await collection.find(query).sort({ updatedAt: -1, createdAt: -1 }).toArray();
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection('trips');
    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const cleanSlug = String(body.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const tripId = body.id || `WNDP-${Date.now().toString(36).toUpperCase()}`;

    // Normalize trip object to strictly match Trip interface
    const tripData = {
      ...body,
      id: tripId,
      slug: cleanSlug,
      title: String(body.title).trim(),
      updatedAt: new Date()
    };

    // Remove MongoDB _id from payload if present to avoid immutable field error during upsert
    delete (tripData as any)._id;

    // Check if trip already exists by slug or id
    const existing = await collection.findOne({
      $or: [{ slug: cleanSlug }, { id: tripId }]
    });

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: tripData
        }
      );
      return NextResponse.json({
        success: true,
        message: 'Trip updated successfully in database.',
        trip: { ...tripData, _id: existing._id }
      });
    } else {
      tripData.createdAt = new Date();
      const result = await collection.insertOne(tripData);
      return NextResponse.json(
        {
          success: true,
          message: 'Trip created and published to database.',
          trip: { ...tripData, _id: result.insertedId }
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Error saving trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save trip' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Trip ID or slug is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('trips');

    const filter: any = { $or: [] };
    if (id) {
      filter.$or.push({ id });
      if (ObjectId.isValid(id)) filter.$or.push({ _id: new ObjectId(id) });
    }
    if (slug) {
      filter.$or.push({ slug });
    }

    const result = await collection.deleteOne(filter);
    return NextResponse.json({
      success: true,
      message: 'Trip deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete trip' }, { status: 500 });
  }
}

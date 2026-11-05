import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { BUILTIN_DESTINATIONS, DestinationPageItem } from '@/lib/destinations';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to verify admin
async function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const result = await verifyAdminSessionToken(cookie);
  return result.valid;
}

export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const collection = db.collection('destinations');
    const dbDestinations = await collection.find({}).sort({ updatedAt: -1, createdAt: -1 }).toArray();

    // Map DB destinations
    const dbMap = new Map<string, DestinationPageItem>();
    dbDestinations.forEach((item: any) => {
      dbMap.set(item.slug.toLowerCase(), {
        ...item,
        _id: item._id.toString(),
        isCustom: item.isCustom !== false,
      });
    });

    // Merge with built-in destinations (if not already overridden in DB)
    const combined: DestinationPageItem[] = [];

    // Add DB destinations
    dbMap.forEach((val) => {
      combined.push(val);
    });

    // Add built-ins that are not yet in DB
    BUILTIN_DESTINATIONS.forEach((builtin) => {
      if (!dbMap.has(builtin.slug.toLowerCase())) {
        combined.push({
          ...builtin,
          isCustom: false,
        });
      }
    });

    return NextResponse.json(combined);
  } catch (error) {
    console.error('Error fetching admin destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let {
      slug,
      name,
      destination,
      region = 'Domestic',
      tagline = '',
      description = '',
      startingPrice,
      heroImages = [],
      sections,
      sectionTitles,
      customPackageIds,
      faqs = [],
      galleryImages = [],
      isActive = true,
    } = body;

    if (!slug || !name || !destination) {
      return NextResponse.json({ error: 'Slug, name, and destination are required' }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid URL slug' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('destinations');

    const now = new Date().toISOString();

    const destinationDoc: Partial<DestinationPageItem> = {
      slug: cleanSlug,
      name: name.trim(),
      destination: destination.trim(),
      region,
      tagline: tagline.trim(),
      description: description.trim(),
      startingPrice: Number(startingPrice) || 0,
      heroImages: Array.isArray(heroImages) && heroImages.length > 0 ? heroImages.filter(Boolean) : ['/images/banner1.jpg'],
      sections: sections || {
        available: true,
        family: true,
        custom: true,
        related: true,
        durationFilter: true,
        reviews: true,
        gallery: true,
        faqs: true,
      },
      sectionTitles: sectionTitles || {
        availableTitle: 'Available Tour Packages',
        availableSubtitle: 'Curated Experiences',
        familyTitle: 'Family Special Packages',
        familySubtitle: 'Memorable Journeys',
        customTitle: 'Customized Tour Packages',
        customSubtitle: 'Tailored For You',
        relatedTitle: 'Trending India Tour Packages',
        relatedSubtitle: 'Explore More',
      },
      customPackageIds: customPackageIds || {},
      faqs: Array.isArray(faqs) ? faqs.filter((f: any) => f.question?.trim()) : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages.filter((g: any) => g.image?.trim()) : [],
      isActive: Boolean(isActive),
      isCustom: true,
      updatedAt: now,
    };

    const existing = await collection.findOne({ slug: cleanSlug });
    if (existing) {
      await collection.updateOne({ slug: cleanSlug }, { $set: destinationDoc });
    } else {
      (destinationDoc as any).createdAt = now;
      await collection.insertOne(destinationDoc as any);
    }

    return NextResponse.json({
      success: true,
      destination: destinationDoc,
      message: 'Destination page saved successfully',
    });
  } catch (error) {
    console.error('Error saving destination:', error);
    return NextResponse.json({ error: 'Failed to save destination' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('destinations');

    const result = await collection.deleteOne({ slug: slug.toLowerCase() });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}

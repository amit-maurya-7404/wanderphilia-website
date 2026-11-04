import { NextRequest, NextResponse } from 'next/server';
import { destinationLuxuryImages, availableDummyImages } from '@/lib/itinerary-images';
import { destinationItineraryImages } from '@/lib/section-mappings';
import { readdir } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const DESTINATION_IMAGE_MAP: Record<string, string[]> = {};

// Merge all destination images from itinerary-images and section-mappings
Object.entries(destinationLuxuryImages).forEach(([k, list]) => {
  const normKey = k.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (!DESTINATION_IMAGE_MAP[normKey]) DESTINATION_IMAGE_MAP[normKey] = [];
  list.forEach(img => {
    if (!DESTINATION_IMAGE_MAP[normKey].includes(img)) {
      DESTINATION_IMAGE_MAP[normKey].push(img);
    }
  });
});

Object.entries(destinationItineraryImages).forEach(([k, list]) => {
  const normKey = k.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (!DESTINATION_IMAGE_MAP[normKey]) DESTINATION_IMAGE_MAP[normKey] = [];
  list.forEach(img => {
    if (!DESTINATION_IMAGE_MAP[normKey].includes(img)) {
      DESTINATION_IMAGE_MAP[normKey].push(img);
    }
  });
});

// Common fallbacks
DESTINATION_IMAGE_MAP['general'] = availableDummyImages;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationQuery = (searchParams.get('destination') || '').toLowerCase().trim();

    // Check if uploads folder has images
    let uploadedImages: string[] = [];
    try {
      const uploadsDir = join(process.cwd(), 'public', 'images', 'uploads');
      const files = await readdir(uploadsDir);
      uploadedImages = files
        .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
        .map(f => `/images/uploads/${f}`);
    } catch {
      // directory might not exist yet
    }

    const allDestinations = Array.from(new Set([
      'Rajasthan',
      'Leh Ladakh',
      'Spiti',
      'Kashmir',
      'Himachal',
      'Bali',
      'Vietnam',
      'Thailand',
      'Bhutan',
      'Meghalaya',
      'Singapore',
      'Sri Lanka',
      'Tadoba',
      'Uploaded Images',
      'General / All'
    ])).sort();

    if (destinationQuery === 'uploaded images' || destinationQuery === 'uploads') {
      return NextResponse.json({
        success: true,
        destinations: allDestinations,
        images: uploadedImages
      });
    }

    if (destinationQuery) {
      let matchedImages: string[] = [];
      const cleanQ = destinationQuery.replace(/[^a-z0-9]/g, '');

      Object.entries(DESTINATION_IMAGE_MAP).forEach(([key, imgs]) => {
        const cleanKey = key.replace(/[^a-z0-9]/g, '');
        if (cleanKey.includes(cleanQ) || cleanQ.includes(cleanKey)) {
          imgs.forEach(i => {
            if (!matchedImages.includes(i)) matchedImages.push(i);
          });
        }
      });

      if (matchedImages.length === 0) {
        matchedImages = availableDummyImages;
      }

      return NextResponse.json({
        success: true,
        destinations: allDestinations,
        images: matchedImages
      });
    }

    return NextResponse.json({
      success: true,
      destinations: allDestinations,
      allImagesMap: DESTINATION_IMAGE_MAP,
      uploadedImages
    });
  } catch (error: any) {
    console.error('[Destination Images API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


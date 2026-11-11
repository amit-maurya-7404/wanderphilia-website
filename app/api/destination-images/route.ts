import { NextRequest, NextResponse } from 'next/server';
import { destinationLuxuryImages, availableDummyImages } from '@/lib/itinerary-images';
import { destinationItineraryImages } from '@/lib/section-mappings';
import { getCuratedUnsplashImages } from '@/lib/destination-unsplash-library';
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

// Common fallbacks removed - authentic destination photos only
// DESTINATION_IMAGE_MAP['general'] = availableDummyImages;

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
      'Jaipur',
      'Udaipur',
      'Jodhpur',
      'Jaisalmer',
      'Jawai',
      'Leh Ladakh',
      'Spiti Valley',
      'Kashmir',
      'Himachal Pradesh',
      'Meghalaya',
      'Kerala',
      'Goa',
      'Andaman & Nicobar',
      'Uttarakhand',
      'Bali',
      'Vietnam',
      'Thailand',
      'Dubai & Abu Dhabi',
      'Singapore',
      'Sri Lanka',
      'Bhutan',
      'Nepal',
      'Tadoba',
      'Uploaded Images',
      'General / All'
    ])).sort();

    if (destinationQuery === 'uploaded images' || destinationQuery === 'uploads') {
      return NextResponse.json({
        success: true,
        destinations: allDestinations,
        images: uploadedImages,
        localCount: uploadedImages.length,
        unsplashCount: 0,
        totalCount: uploadedImages.length
      });
    }

    // 1. Match local project images
    const localMatchedImages: string[] = [];
    if (destinationQuery && destinationQuery !== 'general / all') {
      const cleanQ = destinationQuery.replace(/[^a-z0-9]/g, '');

      Object.entries(DESTINATION_IMAGE_MAP).forEach(([key, imgs]) => {
        const cleanKey = key.replace(/[^a-z0-9]/g, '');
        if (cleanKey.includes(cleanQ) || cleanQ.includes(cleanKey)) {
          imgs.forEach(i => {
            if (!localMatchedImages.includes(i)) localMatchedImages.push(i);
          });
        }
      });
    }

    let finalImages: string[] = [];
    if (localMatchedImages.length > 0) {
      // Return ONLY real, authentic images for this destination - ZERO random images
      finalImages = localMatchedImages;
    } else if (destinationQuery === 'general / all' || !destinationQuery) {
      // Return authentic local images across all destinations
      const allLocal = new Set<string>();
      Object.entries(DESTINATION_IMAGE_MAP).forEach(([key, imgs]) => {
        if (key !== 'general') {
          imgs.forEach(i => allLocal.add(i));
        }
      });
      finalImages = Array.from(allLocal);
    } else {
      // For destinations without local images yet, check if destination-specific unsplash collection exists
      const targetQuery = destinationQuery || '';
      const unsplashImages = getCuratedUnsplashImages(targetQuery);
      finalImages = unsplashImages;
    }

    return NextResponse.json({
      success: true,
      destinations: allDestinations,
      images: finalImages,
      localCount: localMatchedImages.length,
      unsplashCount: 0,
      totalCount: finalImages.length
    });
  } catch (error: any) {
    console.error('[Destination Images API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

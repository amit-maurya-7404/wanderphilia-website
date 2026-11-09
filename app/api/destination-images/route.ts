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
      'Jaipur',
      'Udaipur',
      'Jodhpur',
      'Jaisalmer',
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

    // 2. Curated 25-30 Unsplash HD images for this destination
    const targetQuery = destinationQuery || 'rajasthan';
    const unsplashImages = getCuratedUnsplashImages(targetQuery);

    // 3. Dynamic Unsplash API search if user has configured UNSPLASH_ACCESS_KEY
    let dynamicUnsplash: string[] = [];
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey && destinationQuery && destinationQuery !== 'general / all') {
      try {
        const uRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destinationQuery)}&per_page=30`,
          {
            headers: { Authorization: `Client-ID ${unsplashKey}` }
          }
        );
        if (uRes.ok) {
          const uData = await uRes.json();
          if (Array.isArray(uData.results)) {
            dynamicUnsplash = uData.results
              .map((r: any) => r.urls?.regular || r.urls?.full)
              .filter(Boolean);
          }
        }
      } catch (err) {
        console.warn('[Unsplash Dynamic Search Warning]:', err);
      }
    }

    // Combine local images first, then dynamic & curated Unsplash images
    const combinedSet = new Set<string>();
    localMatchedImages.forEach(img => combinedSet.add(img));
    dynamicUnsplash.forEach(img => combinedSet.add(img));
    unsplashImages.forEach(img => combinedSet.add(img));

    let finalImages = Array.from(combinedSet);
    if (finalImages.length === 0) {
      finalImages = availableDummyImages;
    }

    return NextResponse.json({
      success: true,
      destinations: allDestinations,
      images: finalImages,
      localCount: localMatchedImages.length,
      unsplashCount: unsplashImages.length + dynamicUnsplash.length,
      totalCount: finalImages.length
    });
  } catch (error: any) {
    console.error('[Destination Images API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

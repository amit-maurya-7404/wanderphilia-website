import type { Metadata } from 'next';
import { trips } from '@/lib/data';
import { getDb } from '@/lib/mongodb';
import { BUILTIN_DESTINATIONS } from '@/lib/destinations';
import { generateItinerarySeo } from '@/lib/seo-generator';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Tour Package | Wanderphilia',
      description: 'Explore handcrafted tour packages with Wanderphilia.',
    };
  }

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check static trips in catalog
  const staticTrip = trips.find((t) => t.slug === cleanSlug || t.id === cleanSlug || t.id === slug);
  if (staticTrip) {
    const seoTitle = (staticTrip as any).seo?.title || `${staticTrip.title} | Wanderphilia`;
    const seoDesc = (staticTrip as any).seo?.description || staticTrip.description?.slice(0, 160) || `Experience ${staticTrip.title} with Wanderphilia.`;
    const heroImg = staticTrip.image || staticTrip.heroMedia?.[0]?.src || 'https://wanderphilia.com/images/banner1.jpg';

    return {
      title: seoTitle,
      description: seoDesc,
      keywords: (staticTrip as any).seo?.keywords || [`${staticTrip.destination} tour`, `${staticTrip.title}`, 'Wanderphilia'],
      alternates: {
        canonical: `https://wanderphilia.com/trips/${cleanSlug}`,
      },
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: `https://wanderphilia.com/trips/${cleanSlug}`,
        images: [{ url: heroImg }],
        siteName: 'Wanderphilia',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDesc,
        images: [heroImg],
      },
    };
  }

  // 2. Check MongoDB trips collection
  try {
    const db = await getDb();
    const mongoTrip = await db.collection('trips').findOne({
      $or: [{ slug: cleanSlug }, { id: slug }, { id: cleanSlug }]
    });

    if (mongoTrip) {
      let seoTitle = mongoTrip.seo?.title || mongoTrip.metaTitle;
      let seoDesc = mongoTrip.seo?.description || mongoTrip.metaDescription;
      let keywords = mongoTrip.seo?.keywords;

      // If SEO metadata is not yet populated, generate it on the fly
      if (!seoTitle || !seoDesc) {
        try {
          const aiSeo = await generateItinerarySeo(mongoTrip as any);
          seoTitle = aiSeo.title;
          seoDesc = aiSeo.description;
          keywords = aiSeo.keywords;
        } catch {
          seoTitle = `${mongoTrip.title} | Wanderphilia`;
          seoDesc = mongoTrip.description?.slice(0, 160) || `Book ${mongoTrip.title} with Wanderphilia.`;
        }
      }

      const heroImg = mongoTrip.image || mongoTrip.heroMedia?.[0]?.src || 'https://wanderphilia.com/images/banner1.jpg';

      return {
        title: seoTitle,
        description: seoDesc,
        keywords: keywords || [`${mongoTrip.destination || 'India'} tour`, mongoTrip.title, 'Wanderphilia'],
        alternates: {
          canonical: `https://wanderphilia.com/trips/${cleanSlug}`,
        },
        openGraph: {
          title: seoTitle,
          description: seoDesc,
          url: `https://wanderphilia.com/trips/${cleanSlug}`,
          images: [{ url: heroImg }],
          siteName: 'Wanderphilia',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoTitle,
          description: seoDesc,
          images: [heroImg],
        },
      };
    }

    // 3. Check MongoDB destinations collection
    const mongoDest = await db.collection('destinations').findOne({ slug: cleanSlug });
    if (mongoDest) {
      const title = `${mongoDest.name || mongoDest.destination + ' Tour Packages 2026'} | Wanderphilia`;
      const desc = mongoDest.description || `Explore handcrafted ${mongoDest.destination} tour packages with Wanderphilia.`;
      const heroImg = mongoDest.heroImages?.[0] || 'https://wanderphilia.com/images/banner1.jpg';

      return {
        title,
        description: desc,
        alternates: {
          canonical: `https://wanderphilia.com/trips/${cleanSlug}`,
        },
        openGraph: {
          title,
          description: desc,
          url: `https://wanderphilia.com/trips/${cleanSlug}`,
          images: [{ url: heroImg }],
          siteName: 'Wanderphilia',
        },
      };
    }
  } catch (err) {
    console.error('Error generating metadata in trips layout:', err);
  }

  // 4. Check builtin destinations
  const builtinDest = BUILTIN_DESTINATIONS.find((b) => b.slug.toLowerCase() === cleanSlug);
  if (builtinDest) {
    const title = `${builtinDest.name} | Wanderphilia`;
    const desc = builtinDest.description;
    const heroImg = builtinDest.heroImages[0] || 'https://wanderphilia.com/images/banner1.jpg';

    return {
      title,
      description: desc,
      alternates: {
        canonical: `https://wanderphilia.com/trips/${cleanSlug}`,
      },
      openGraph: {
        title,
        description: desc,
        url: `https://wanderphilia.com/trips/${cleanSlug}`,
        images: [{ url: heroImg }],
        siteName: 'Wanderphilia',
      },
    };
  }

  // 5. Graceful default
  return {
    title: 'Tour Package & Itinerary | Wanderphilia',
    description: 'Explore handcrafted tour packages and itineraries across India and International destinations with Wanderphilia.',
  };
}

export default function TripSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

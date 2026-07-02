const fs = require('fs');
const path = require('path');

const destinations = {
  'bali': {
    name: 'Bali',
    title: 'Bali Tour Packages 2026 | Group & Customised Trips | Wanderphilia',
    description: 'Book best Bali tour packages for 2026. Explore group & customised trips to Ubud, Nusa Dua, Seminyak, Kuta, Gili and Nusa Penida with Wanderphilia.'
  },
  'bhutan': {
    name: 'Bhutan',
    title: 'Bhutan Tour Packages | Bhutan Group & Customised Trips | Wanderphilia',
    description: 'Explore the land of happiness with Bhutan tour packages from Wanderphilia. Handcrafted itineraries for group tours and custom packages to Thimphu, Paro, and Punakha.'
  },
  'himachal': {
    name: 'Himachal',
    title: 'Himachal Tour Packages | Group Trips & Custom Holidays | Wanderphilia',
    description: 'Book scenic Himachal tour packages with Wanderphilia. Explore Shimla, Manali, Dharamshala, Dalhousie, and Kasol in curated group tours or customized family packages.'
  },
  'iceland': {
    name: 'Iceland',
    title: 'Iceland Tour Packages | Northern Lights & Custom Trips | Wanderphilia',
    description: 'Discover the land of fire and ice with our Iceland tour packages. Experience the Golden Circle, Northern Lights, glaciers, and waterfalls in comfort with Wanderphilia.'
  },
  'indonesia': {
    name: 'Indonesia',
    title: 'Indonesia Tour Packages | Group Trips & Custom Holidays | Wanderphilia',
    description: 'Explore Indonesia beyond Bali. Book custom Indonesia tour packages covering Jakarta, Komodo Island, Yogyakarta, and Mount Bromo with Wanderphilia.'
  },
  'japan': {
    name: 'Japan',
    title: 'Japan Tour Packages | Cherry Blossom & Customised Tours | Wanderphilia',
    description: 'Experience the perfect blend of tradition and future with Japan tour packages. Curated itineraries for Tokyo, Kyoto, Osaka, Mount Fuji, and Cherry Blossom season.'
  },
  'kashmir': {
    name: 'Kashmir',
    title: 'Kashmir Tour Packages | Heaven on Earth Group & Custom Trips | Wanderphilia',
    description: 'Explore the beauty of Kashmir with our custom and group tour packages. Boat rides on Dal Lake, scenic views in Gulmarg, Pahalgam, and Srinagar with Wanderphilia.'
  },
  'leh-ladakh': {
    name: 'Leh Ladakh',
    title: 'Leh Ladakh Tour Packages | Ladakh Bike Trips & Group Tours | Wanderphilia',
    description: 'Experience the ultimate adventure with Ladakh tour packages. Join Leh Ladakh group tours, bike trips to Pangong Lake, Nubra Valley, and Khardung La with Wanderphilia.'
  },
  'meghalaya': {
    name: 'Meghalaya',
    title: 'Meghalaya Tour Packages | Shillong & Cherrapunji Trips | Wanderphilia',
    description: 'Explore the abode of clouds with Meghalaya tour packages. Discover living root bridges, crystal clear rivers of Dawki, and majestic waterfalls of Cherrapunji.'
  },
  'nepal': {
    name: 'Nepal',
    title: 'Nepal Tour Packages | Kathmandu & Pokhara Group Tours | Wanderphilia',
    description: 'Book Nepal tour packages with Wanderphilia. Hand-curated itineraries for trekking, heritage sightseeing in Kathmandu, and scenic lakeside views of Pokhara.'
  },
  'peru': {
    name: 'Peru',
    title: 'Peru Tour Packages | Machu Picchu & Cusco Holidays | Wanderphilia',
    description: 'Embark on an epic journey to Peru with Wanderphilia. Explore the ancient ruins of Machu Picchu, Cusco, Sacred Valley, and Lima in custom tours.'
  },
  'sikkim': {
    name: 'Sikkim',
    title: 'Sikkim Tour Packages | Gangtok & North Sikkim Group Trips | Wanderphilia',
    description: 'Discover the pristine beauty of Northeast India with Sikkim tour packages. Curated trips to Gangtok, Nathula Pass, Lachen, Lachung, and Gurudongmar Lake.'
  },
  'singapore': {
    name: 'Singapore',
    title: 'Singapore Tour Packages | Family Holidays & Custom Trips | Wanderphilia',
    description: 'Book modern Singapore tour packages with Wanderphilia. Perfect itineraries for family holidays, Singapore fly-cruise packages, Sentosa, and Universal Studios.'
  },
  'spiti': {
    name: 'Spiti',
    title: 'Spiti Valley Tour Packages | Spiti Group & Bike Trips | Wanderphilia',
    description: 'Join thrilling Spiti Valley tour packages from Delhi. Experience high-altitude monasteries, Kaza, Key Monastery, Hikkim, and Pin Valley with Wanderphilia.'
  },
  'switzerland': {
    name: 'Switzerland',
    title: 'Switzerland Tour Packages | Swiss Alps Group & Custom Trips | Wanderphilia',
    description: 'Experience the magic of Swiss Alps with Switzerland tour packages. Tailor-made itineraries for Zurich, Lucerne, Interlaken, Grindelwald, and Mount Titlis.'
  },
  'thailand': {
    name: 'Thailand',
    title: 'Thailand Tour Packages | Bangkok, Phuket & Krabi Trips | Wanderphilia',
    description: 'Book exciting Thailand tour packages with Wanderphilia. Curated group tours and romantic custom packages covering Bangkok, Phuket, Krabi, and Phi Phi Islands.'
  },
  'vietnam': {
    name: 'Vietnam',
    title: 'Vietnam Tour Packages from India | Group & Customised Trips | Wanderphilia',
    description: 'Explore best Vietnam tour packages with Wanderphilia. All-inclusive group tours and customized travel itineraries for Hanoi, Halong Bay, Da Nang, and Hoi An.'
  }
};

// Generate layout.tsx for static folders
Object.keys(destinations).forEach((dest) => {
  const destInfo = destinations[dest];
  const dirPath = path.join('app', 'trips', dest);
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }
  const layoutContent = `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${destInfo.title.replace(/'/g, "\\'")}',
  description: '${destInfo.description.replace(/'/g, "\\'")}',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/${dest}',
  },
  openGraph: {
    title: '${destInfo.title.replace(/'/g, "\\'")}',
    description: '${destInfo.description.replace(/'/g, "\\'")}',
    url: 'https://wanderphilia.com/trips/${dest}',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
`;
  const filePath = path.join(dirPath, 'layout.tsx');
  fs.writeFileSync(filePath, layoutContent, 'utf8');
  console.log(`Created: ${filePath}`);
});

// Generate layout.tsx for [slug] folders
const slugDirs = [
  'app/trips/[slug]',
  'app/trips/bhutan/[slug]',
  'app/trips/himachal/[slug]',
  'app/trips/iceland/[slug]',
  'app/trips/indonesia/[slug]',
  'app/trips/japan/[slug]',
  'app/trips/kashmir/[slug]',
  'app/trips/leh-ladakh/[slug]',
  'app/trips/meghalaya/[slug]',
  'app/trips/nepal/[slug]',
  'app/trips/peru/[slug]',
  'app/trips/sikkim/[slug]',
  'app/trips/singapore/[slug]',
  'app/trips/spiti/[slug]',
  'app/trips/switzerland/[slug]'
];

slugDirs.forEach((dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Slug directory does not exist: ${dirPath}`);
    return;
  }

  // Get destination name or segment from path
  const parts = dirPath.split('/');
  const destSegment = parts[2]; // bhutan, himachal, or [slug]
  const isTopLevel = destSegment === '[slug]';
  const canonicalBase = isTopLevel ? 'https://wanderphilia.com/trips' : `https://wanderphilia.com/trips/${destSegment}`;

  const layoutContent = `import { Metadata } from 'next'
import { trips } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) return {};

  const title = \`\${trip.title} | Wanderphilia\`;
  const description = Array.isArray(trip.description) ? trip.description[0] : trip.description;

  return {
    title,
    description: description.substring(0, 160),
    alternates: {
      canonical: \`${canonicalBase}/\${slug}\`,
    },
    openGraph: {
      title,
      description: description.substring(0, 160),
      url: \`${canonicalBase}/\${slug}\`,
      type: 'website',
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
  const filePath = path.join(dirPath, 'layout.tsx');
  fs.writeFileSync(filePath, layoutContent, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log('Done generating SEO layouts!');

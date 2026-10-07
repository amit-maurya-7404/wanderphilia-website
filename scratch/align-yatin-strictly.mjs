import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/manual-itineraries.ts');
let content = fs.readFileSync(filePath, 'utf8');

const updatedDayPlans = `  dayPlans: [
    {
      day: 1,
      date: '20 Nov',
      title: 'Day 1 | 20 Nov Chandigarh → Narkanda',
      route: 'Chandigarh → Narkanda',
      durationNote: 'Approx. 5–6 hrs | 175 km',
      timeline: [
        'Scenic drive from Chandigarh towards Narkanda, surrounded by cedar forests & mountain landscapes',
        'Arrive at your mountain retreat in Narkanda and check-in',
        'Spend the evening slowing down with a warm cup of chai and Himalayan sunset views',
        'Cosy evening bonfire under the mountains',
        'Warm and relaxed mountain dinner'
      ],
      stayLocation: 'Narkanda (Snow Valley Resort / Similar)',
      image: '/images/himachal.jpg',
      meals: 'Dinner'
    },
    {
      day: 2,
      date: '21 Nov',
      title: 'Day 2 | 21 Nov Narkanda → Sangla / Chitkul',
      route: 'Narkanda → Sangla / Chitkul',
      durationNote: 'Approx. 6–7 hrs | 160 km',
      timeline: [
        'Journey deeper into Kinnaur as the landscape transforms into dramatic valleys',
        'Scenic drive through traditional Himalayan mountain villages',
        'Arrive in the beautiful Baspa Valley and settle into your stay',
        'Spend the evening at leisure, enjoying valley views and peaceful surroundings',
        'Warm local Kinnauri dinner'
      ],
      stayLocation: 'Sangla / Chitkul (Hotel Mount Kailash / Banjara Valley Retreat / Similar)',
      image: '/images/himachal2.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      date: '22 Nov',
      title: 'Day 3 | 22 Nov Chitkul & Baspa Valley',
      route: 'Chitkul & Baspa Valley',
      durationNote: 'Leisure Day Excursion',
      timeline: [
        'Explore Chitkul, one of Kinnaur’s most beautiful and remote villages',
        'Take a slow village walk and discover traditional wooden homes',
        'Visit the local village temple and interact with locals',
        'Enjoy the magnificent Baspa Valley and Baspa River surroundings',
        'Return to your stay for a relaxed afternoon and evening'
      ],
      stayLocation: 'Sangla / Chitkul (Hotel Mount Kailash / Banjara Valley Retreat / Similar)',
      image: '/images/himachal3.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      date: '23 Nov',
      title: 'Day 4 | 23 Nov Sangla / Chitkul → Nako → Tabo',
      route: 'Sangla / Chitkul → Nako → Tabo',
      durationNote: 'Approx. 6–7 hrs | 150 km',
      timeline: [
        'Leave the lush valleys of Kinnaur behind as the landscape transforms into the cold desert',
        'Scenic stop at Nako with time to explore the village',
        'Visit the tranquil and sacred Nako Lake',
        'Enjoy a warm local lunch in Nako',
        'Continue towards Tabo through dramatic Trans-Himalayan landscapes',
        'Arrive in Tabo and settle into your mountain stay'
      ],
      stayLocation: 'Tabo (Maitreya Mud House / Similar)',
      image: '/images/spiti-valley.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      date: '24 Nov',
      title: 'Day 5 | 24 Nov Tabo — A Day in Ancient Spiti',
      route: 'Tabo & Heritage Valley',
      durationNote: 'Unrushed Cultural Day',
      timeline: [
        'Wake up to a peaceful Himalayan morning in Tabo',
        'Spend the morning exploring ancient Tabo Monastery and its historical complex',
        'Discover ancient temples, Buddhist artwork and peaceful surroundings',
        'Take a slow walk through traditional Tabo village',
        'Deliberately relaxed afternoon enjoying the stay and surrounding mountains',
        'Warm local dinner'
      ],
      stayLocation: 'Tabo (Maitreya Mud House / Similar)',
      image: '/images/spiti1.JPG',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      date: '25 Nov',
      title: 'Day 6 | 25 Nov Tabo → Dhankar → Kaza',
      route: 'Tabo → Dhankar → Kaza',
      durationNote: 'Approx. 3–4 hrs | 65 km',
      timeline: [
        'After breakfast, begin your journey towards spectacular Dhankar',
        'Explore the ancient monastery dramatically perched above the Spiti Valley',
        'Enjoy magnificent panoramic views across the mountains and river valley',
        'Continue towards Kaza travelling through some of Spiti’s most dramatic landscapes',
        'Arrive in Kaza and enjoy a relaxed evening'
      ],
      stayLocation: 'Kaza (Baspa Mud House / Spiti Village Resort Mud House / Similar)',
      image: '/images/spiti3.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      date: '26 Nov',
      title: 'Day 7 | 26 Nov Kaza → Key → Kibber → Chicham → Kaza',
      route: 'Kaza → Key → Kibber → Chicham → Kaza',
      durationNote: 'Full Day Spiti Sightseeing Circuit',
      timeline: [
        'Begin your day with Key Monastery, one of Spiti’s most iconic landmarks',
        'Continue towards Kibber and experience remote Spitian mountain village life',
        'Visit Chicham and cross the spectacular suspension bridge enjoying vast vistas',
        'Optional extension to Langza, Hikkim & Komic (subject to weather, road and daylight conditions)',
        'Return to Kaza for a warm local dinner and relaxed evening'
      ],
      stayLocation: 'Kaza (Baspa Mud House / Spiti Village Resort Mud House / Similar)',
      image: '/images/spiti2.JPG',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      date: '27 Nov',
      title: 'Day 8 | 27 Nov Kaza → Kalpa',
      route: 'Kaza → Kalpa',
      durationNote: 'Approx. 6–7 hrs | 200 km',
      timeline: [
        'Begin the beautiful descent from Spiti towards Kinnaur',
        'Watch the landscape gradually transform from stark cold desert to softer Himalayan valleys',
        'Arrive in Kalpa and check-in to your stay',
        'Spend the evening unwinding with magnificent Kinner Kailash views',
        'Enjoy sunset from your stay followed by a relaxed dinner'
      ],
      stayLocation: 'Kalpa (Kinner Villa / Similar)',
      image: '/images/himachal7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      date: '28 Nov',
      title: 'Day 9 | 28 Nov Kalpa — Slow Kinnaur Experience',
      route: 'Kalpa & Roghi Village',
      durationNote: 'Leisurely Kinnauri Immersion',
      timeline: [
        'Leisurely Himalayan morning and breakfast overlooking the mountains',
        'Explore the charming lanes of Kalpa and traditional Kinnauri architecture',
        'Visit Roghi Village for beautiful mountain views and photography (subject to weather/road conditions)',
        'Return to your stay for a relaxed afternoon embracing the art of doing nothing',
        'Mountain sunset, cosy bonfire and special local dinner'
      ],
      stayLocation: 'Kalpa (Kinner Villa / Similar)',
      image: '/images/himachal8.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      date: '29 Nov',
      title: 'Day 10 | 29 Nov Kalpa → Shimla',
      route: 'Kalpa → Shimla',
      durationNote: 'Approx. 6–7 hrs | 220 km',
      timeline: [
        'After breakfast, journey towards Shimla through the changing landscapes of Himachal',
        'Arrive in Shimla and check-in to your hotel',
        'Spend your final evening with a leisurely walk around The Ridge & Mall Road',
        'Stop at a cosy café and enjoy bakery treats',
        'End the journey with a beautiful farewell dinner'
      ],
      stayLocation: 'Shimla (Snow Valley Heights / Similar)',
      image: '/images/himachal9.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 11,
      date: '30 Nov',
      title: 'Day 11 | 30 Nov Shimla → Chandigarh & Departure',
      route: 'Shimla → Chandigarh',
      durationNote: 'Approx. 3–4 hrs | 115 km',
      timeline: [
        'Breakfast in Shimla with final morning hill views',
        'Scenic drive from Shimla down to Chandigarh in your Private Toyota Innova Crysta',
        'Safe drop-off at Chandigarh Airport / Railway Station to board your evening flight / train',
        'Depart with unforgettable Himalayan memories of Winter Spiti & Kinnaur'
      ],
      stayLocation: 'Departure',
      signOff: 'Until the next Himalayan adventure — Wanderphilia style!',
      image: '/images/himachal1.jpg',
      meals: 'Breakfast'
    }
  ],`;

const startIdx = content.indexOf('export const winterSpitiYatinManualItinerary: ManualItinerary = {');
const dayPlansStart = content.indexOf('dayPlans: [', startIdx);
const inclusionsStart = content.indexOf('inclusions: [', dayPlansStart);

const before = content.slice(0, dayPlansStart);
const after = content.slice(inclusionsStart);

const newContent = before + updatedDayPlans.trim() + '\n  ' + after;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully aligned dayPlans strictly with user prompt details!');

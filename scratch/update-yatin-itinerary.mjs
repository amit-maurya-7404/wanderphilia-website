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
        'Warm welcome and pickup from Chandigarh in your Private Toyota Innova Crysta',
        'Scenic uphill drive through dense cedar forests and apple country valleys',
        'Arrive in Narkanda and check-in to Snow Valley Resort / Similar',
        'Spend the evening slowing down with a warm cup of mountain chai',
        'Panoramic Himalayan sunset views over snow-dusted ridges',
        'Cosy evening bonfire under starlit Himalayan skies',
        'Delicious mountain dinner at the retreat'
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
        'Morning departure from Narkanda descending into the dramatic Sutlej Valley',
        'Drive along the famous rock-cut cliffs and tunnels of the Hindustan-Tibet Highway',
        'Enter enchanting Kinnaur and branch into the lush Baspa Valley',
        'Arrive in Sangla / Chitkul and settle into your mountain stay',
        'Spend the evening at leisure admiring snow-clad peaks and listening to the river',
        'Warm Kinnauri hospitality and freshly prepared local dinner'
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
        'Scenic morning drive along the crystal-clear Baspa River to Chitkul (3,450 m)',
        'Explore Chitkul – The Last Inhabited Indian Village on the Indo-Tibet border',
        'Take a slow, unhurried village walk amidst traditional Kinnauri slate & wooden architecture',
        'Visit the historic 500-year-old Mathi Temple and interact with warm locals',
        'Breathtaking 360° views of snow-dusted Himalayan peaks and the riverbed',
        'Enjoy a warm authentic local Kinnauri meal at an iconic village café',
        'Return to your retreat for a relaxed afternoon and peaceful evening'
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
        'Journey from lush Kinnaur into the stark beauty of the Trans-Himalayan cold desert',
        'Witness Khab Confluence – where the emerald Spiti River meets the brown Sutlej',
        'Ascend the winding Ka Loops offering views of Reo Purgyil peak',
        'Explore the high-altitude village of Nako (3,662 m) and sacred willow-fringed Nako Lake',
        'Enjoy a delicious warm local lunch in Nako',
        'Scenic drive along the rugged Spiti Valley to the ancient village of Tabo',
        'Check-in to Maitreya Mud House / Similar and settle in for a cosy evening'
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
        'Wake up to a crisp, peaceful Himalayan morning in Tabo',
        'Explore the 1000+ year old UNESCO Tabo Monastery (founded in 996 AD, "Ajanta of the Himalayas")',
        'Discover ancient Buddhist frescoes, mud stupas & cliffside meditation caves',
        'Take a slow, unhurried walk through traditional Tabo village',
        'Deliberately relaxed afternoon at your retreat enjoying mountain serenity',
        'Warm local Spitian dinner and stargazing under crystal-clear skies'
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
        'Morning departure from Tabo along the cold desert valley',
        'Drive up to the cliffside Dhankar Monastery perched on razor-sharp pinnacles',
        'Marvel at panoramic aerial views of the Spiti & Pin river confluence',
        'Explore ancient monastery heritage and cliffside prayer chambers',
        'Continue scenic drive through dramatic Trans-Himalayan landscapes to Kaza (3,800 m)',
        'Check-in to Baspa Mud House / Spiti Village Resort Mud House / Similar',
        'Relaxed evening exploring local cafés, market & warm dinner'
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
        'Ascend to the iconic 1000-year-old Key Monastery (4,166 m), perched majestically on a conical hill',
        'Explore sacred prayer halls, ancient murals, and enjoy herbal tea with resident monks',
        'Drive to Kibber (4,270 m) – one of the world’s highest inhabited villages',
        'Cross the breathtaking Chicham Bridge – Asia’s highest suspension bridge over a 1,000 ft canyon',
        'Optional high-altitude extension to Langza (Giant Buddha), Hikkim & Komic (subject to weather & road conditions)',
        'Return to Kaza for a warm local dinner and Himalayan stargazing'
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
        'Begin the scenic descent from Spiti back towards lush Kinnaur',
        'Drive past dramatic river canyons, rock formations and mountain bridges',
        'Ascend the winding pine-lined roads into the magical mountain town of Kalpa (2,960 m)',
        'Check-in to Kinner Villa / Similar facing the sacred Kinner Kailash range',
        'Unwind on the private balcony with a warm drink after the journey',
        'Witness the magnificent 6,050m Kinner Kailash peak glow with gold during sunset',
        'Relaxed dinner and peaceful mountain evening'
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
        'Sunrise views illuminating the sacred Kinner Kailash range from your stay',
        'Leisurely breakfast with mountain panoramas and fresh orchard air',
        'Explore Kalpa village, apple orchards & Hu-Bu-Lan-Kar Monastery',
        'Scenic drive to Roghi Village & dramatic Suicide Point cliff (subject to road conditions)',
        'Relaxed afternoon at the retreat embracing the pure art of slowing down',
        'Cosy evening bonfire under the mountains with warm drinks',
        'Special celebratory local farewell dinner curated for Mr Yatin Sir & Family'
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
        'Final breakfast in Kalpa with panoramic views of the Kinner Kailash range',
        'Scenic descent drive through Rampur and Narkanda along the Hindustan-Tibet Highway',
        'Arrive in Shimla – the historic Queen of the Hills',
        'Check-in to Snow Valley Heights / Similar and freshen up',
        'Leisurely evening stroll along the famous Ridge, Mall Road & Scandal Point',
        'Stop at iconic colonial cafés, bakeries, and pick up authentic Himachali souvenirs',
        'Grand farewell dinner celebrating an extraordinary Himalayan journey'
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
        'Check-out from hotel and board your Private Toyota Innova Crysta',
        'Smooth, scenic downhill drive along the Himalayan expressway to Chandigarh',
        'Safe drop-off at Chandigarh Airport / Railway Station to board your evening flight / train',
        'Depart homeward with cherished lifelong memories of Winter Spiti & Kinnaur'
      ],
      stayLocation: 'Departure',
      signOff: 'Until the next Himalayan adventure — Wanderphilia style!',
      image: '/images/himachal1.jpg',
      meals: 'Breakfast'
    }
  ],`;

const startIdx = content.indexOf('export const winterSpitiYatinManualItinerary: ManualItinerary = {');
if (startIdx === -1) {
  console.error('winterSpitiYatinManualItinerary not found');
  process.exit(1);
}

const dayPlansStart = content.indexOf('dayPlans: [', startIdx);
const inclusionsStart = content.indexOf('inclusions: [', dayPlansStart);

const before = content.slice(0, dayPlansStart);
const after = content.slice(inclusionsStart);

const newContent = before + updatedDayPlans.trim() + '\n  ' + after;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated winterSpitiYatinManualItinerary with pure flowchart timeline points!');

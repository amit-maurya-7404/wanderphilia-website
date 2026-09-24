import {
  buildCleanDayPlansFromZoho
} from './test-clean-mapper.mjs';

const intlActivities = [
  {
    dayNumber: 1,
    dayText: 'Day 1',
    city: 'Hanoi',
    experiences: [
      { name: 'Old Quarter Walking Tour', inclusionDescription: 'Discover the ancient streets, French colonial architecture, and street food stalls of Hanoi.' }
    ]
  },
  {
    dayNumber: 2,
    dayText: 'Day 2',
    city: 'Hanoi',
    city2: 'Halong Bay',
    experiences: [
      { name: 'Halong Bay Luxury Cruise', inclusionDescription: 'Board a luxury wooden junk cruise, sail past limestone karsts, and visit Sung Sot Cave.' }
    ]
  },
  {
    dayNumber: 3,
    dayText: 'Day 3',
    city: 'Halong Bay',
    city2: 'Hanoi',
    experiences: [
      { name: 'Morning Tai Chi on Deck', inclusionDescription: 'Practice Tai Chi as the sun rises over Halong Bay waters.' }
    ]
  }
];

const intlHotels = [
  { hotelName: 'Peridot Grand Luxury Hotel', city: 'Hanoi', nights: 1 },
  { hotelName: 'Paradise Elegance Cruise', city: 'Halong Bay', nights: 1 }
];

const plans = buildCleanDayPlansFromZoho(intlActivities, intlHotels, 'Vietnam', 3, '', 'International');
console.log('=== INTERNATIONAL TRIP TEST RESULT ===');
console.log(JSON.stringify(plans, null, 2));

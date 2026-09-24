import {
  buildCleanDayPlansFromZoho
} from './test-clean-mapper.mjs';

const sampleInterCityActivities = [
  {
    dayNumber: 1,
    dayText: 'Day 1',
    city: 'Jaipur',
    experiences: [
      { name: 'Amber Fort', inclusionDescription: 'Explore the majestic Amber Fort with Sheesh Mahal and grand courtyards.' },
      { name: 'City Palace', inclusionDescription: 'Discover royal museums, armor, and courtyards.' }
    ]
  },
  {
    dayNumber: 2,
    dayText: 'Day 2',
    city: 'Jaipur',
    city2: 'Ranthambore',
    enRouteExperiences: 'Abhaneri Stepwell',
    experiences: [
      { name: 'Ranthambore Jungle Safari', inclusionDescription: 'Afternoon game drive in Ranthambore National Park in an open gypsy.' }
    ]
  },
  {
    dayNumber: 3,
    dayText: 'Day 3',
    city: 'Ranthambore',
    city2: 'Agra',
    enRouteExperiences: 'Fatehpur Sikri',
    experiences: [
      { name: 'Taj Mahal Sunset Visit', inclusionDescription: 'Visit the world-famous Taj Mahal during sunset.' }
    ]
  },
  {
    dayNumber: 4,
    dayText: 'Day 4',
    city: 'Agra',
    experiences: [
      { name: 'Agra Fort', inclusionDescription: 'Explore the Mughal red sandstone fort.' }
    ]
  }
];

const sampleHotels = [
  { hotelName: 'ITC Rajputana', city: 'Jaipur', nights: 1 },
  { hotelName: 'The Oberoi Vanyavilas', city: 'Ranthambore', nights: 1 },
  { hotelName: 'ITC Mughal', city: 'Agra', nights: 2 }
];

const plans = buildCleanDayPlansFromZoho(sampleInterCityActivities, sampleHotels, 'Rajasthan & Agra', 4, '', 'India');
console.log('=== INTER-CITY TRANSIT TEST RESULT ===');
console.log(JSON.stringify(plans, null, 2));

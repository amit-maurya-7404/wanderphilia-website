import { trips } from '../lib/data';

const spiti = trips.find(t => t.title.toLowerCase().includes('spiti') && t.title.toLowerCase().includes('delhi'));
if (spiti) {
  spiti.itinerary.forEach((day, index) => {
    console.log(`Day ${day.day}: ${day.title}`);
    console.log(`Desc:`, day.description);
    console.log('---');
  });
}

const { trips } = require('../lib/data');

const spiti = trips.find(t => t.title.includes('Spiti Valley Tour From Delhi'));
if (spiti) {
  spiti.itinerary.forEach((day, index) => {
    console.log(`Day ${day.day}: ${day.title}`);
    console.log(`Desc:`, day.description);
    console.log('---');
  });
}

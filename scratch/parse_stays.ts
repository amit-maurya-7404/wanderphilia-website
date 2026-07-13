import { trips } from '../lib/data';

function cleanLocation(loc: string): string {
  // Clean up location name
  let clean = loc.trim()
    .replace(/^in\s+/i, '')
    .replace(/^at\s+/i, '')
    .replace(/^near\s+/i, '')
    .replace(/^stay\s+in\s+/i, '')
    .replace(/^stay\s+at\s+/i, '')
    .replace(/^stay\s+near\s+/i, '')
    .replace(/\.$/, '')
    .trim();
  
  // Specific replacements to match common patterns
  if (clean.toLowerCase().includes('nubra')) return 'Nubra';
  if (clean.toLowerCase().includes('pangong')) return 'Pangong';
  if (clean.toLowerCase().includes('leh')) return 'Leh';
  if (clean.toLowerCase().includes('jispa')) return 'Jispa';
  if (clean.toLowerCase().includes('sarchu')) return 'Sarchu';
  if (clean.toLowerCase().includes('manali')) return 'Manali';
  if (clean.toLowerCase().includes('kargil')) return 'Kargil';
  if (clean.toLowerCase().includes('srinagar')) return 'Srinagar';
  if (clean.toLowerCase().includes('kasol')) return 'Kasol';
  if (clean.toLowerCase().includes('tirthan')) return 'Tirthan';
  if (clean.toLowerCase().includes('bir')) return 'Bir';
  if (clean.toLowerCase().includes('shimla')) return 'Shimla';
  if (clean.toLowerCase().includes('spiti')) return 'Spiti';
  if (clean.toLowerCase().includes('kaza')) return 'Kaza';
  if (clean.toLowerCase().includes('kalpa')) return 'Kalpa';
  if (clean.toLowerCase().includes('sangla')) return 'Sangla';
  if (clean.toLowerCase().includes('chitkul')) return 'Chitkul';
  
  // Make it shorter/cleaner
  return clean.split(' ')[0]; // Take first word for simplicity or keep first 2 words
}

function parseStaysForTrip(trip: typeof trips[0]) {
  const stays: string[] = [];
  trip.itinerary.forEach((day, index) => {
    let descLines: string[] = [];
    if (typeof day.description === 'string') {
      descLines = [day.description];
    } else if (Array.isArray(day.description)) {
      descLines = day.description;
    }
    
    // Look for "Overnight stay"
    let stayFound = false;
    for (const line of descLines) {
      const match = line.match(/Overnight stay\s+(?:in|at|near)?\s+([^.]+)/i);
      if (match) {
        stays.push(cleanLocation(match[1]));
        stayFound = true;
        break;
      }
    }
    if (!stayFound) {
      // Check title for "Overnight" or check if it's the last day (usually no overnight stay on last day)
      const titleMatch = day.title.match(/Overnight stay\s+(?:in|at|near)?\s+([^.]+)/i);
      if (titleMatch) {
        stays.push(cleanLocation(titleMatch[1]));
      } else {
        // If it's not the last day, default to destination or some fallback
        if (index < trip.itinerary.length - 1) {
          stays.push('Unknown');
        }
      }
    }
  });

  // Group consecutive stays, e.g. ['Leh', 'Leh', 'Nubra', 'Pangong', 'Leh'] -> 2N Leh, 1N Nubra, 1N Pangong, 1N Leh
  const grouped: { loc: string; nights: number }[] = [];
  stays.forEach((loc) => {
    if (grouped.length > 0 && grouped[grouped.length - 1].loc === loc) {
      grouped[grouped.length - 1].nights++;
    } else {
      grouped.push({ loc, nights: 1 });
    }
  });

  return grouped.map(g => `${g.nights}N ${g.loc}`).join(' • ');
}

trips.forEach((trip) => {
  console.log(`Trip: ${trip.title} (${trip.duration}D/${trip.duration-1}N)`);
  console.log(`Parsed: ${parseStaysForTrip(trip)}`);
  console.log('---');
});

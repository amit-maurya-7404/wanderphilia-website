import { trips } from '../lib/data';

function cleanLocation(loc: string): string {
  // Clean up location name
  let clean = loc.trim()
    .replace(/^(in|at|near|stay in|stay at|stay near|camps near|camp near|hotel in|hotel at|homestay in|homestay at|campsite near|resort in|resort at)\s+/i, '')
    .replace(/\.$/, '')
    .trim();
  
  const lower = clean.toLowerCase();
  
  // Specific replacements to match common patterns
  if (lower.includes('leh')) return 'Leh';
  if (lower.includes('nubra')) return 'Nubra';
  if (lower.includes('pangong')) return 'Pangong';
  if (lower.includes('turtuk')) return 'Turtuk';
  if (lower.includes('kargil')) return 'Kargil';
  if (lower.includes('srinagar')) return 'Srinagar';
  if (lower.includes('jispa')) return 'Jispa';
  if (lower.includes('sarchu')) return 'Sarchu';
  if (lower.includes('manali')) return 'Manali';
  if (lower.includes('kasol')) return 'Kasol';
  if (lower.includes('kheerganga')) return 'Kheerganga';
  if (lower.includes('tirthan')) return 'Tirthan';
  if (lower.includes('jibhi')) return 'Jibhi';
  if (lower.includes('tosh')) return 'Tosh';
  if (lower.includes('bir')) return 'Bir';
  if (lower.includes('shangarh')) return 'Shangarh';
  if (lower.includes('shimla')) return 'Shimla';
  if (lower.includes('kalpa')) return 'Kalpa';
  if (lower.includes('kaza')) return 'Kaza';
  if (lower.includes('chandra') || lower.includes('chandratal')) return 'Chandratal';
  if (lower.includes('rampur')) return 'Rampur';
  if (lower.includes('tabo')) return 'Tabo';
  if (lower.includes('guwahati')) return 'Guwahati';
  if (lower.includes('cherrapunji')) return 'Cherrapunji';
  if (lower.includes('shnongpdeng')) return 'Shnongpdeng';
  if (lower.includes('shillong')) return 'Shillong';
  if (lower.includes('hanoi')) return 'Hanoi';
  if (lower.includes('ha long') || lower.includes('halong')) return 'Ha Long Bay';
  if (lower.includes('da nang') || lower.includes('danang')) return 'Da Nang';
  if (lower.includes('ho chi minh')) return 'Ho Chi Minh';
  if (lower.includes('hoi an')) return 'Hoi An';
  if (lower.includes('saigon')) return 'Saigon';
  if (lower.includes('phu quoc') || lower.includes('phu')) return 'Phu Quoc';
  if (lower.includes('sapa')) return 'Sapa';
  if (lower.includes('ubud')) return 'Ubud';
  if (lower.includes('seminyak')) return 'Seminyak';
  if (lower.includes('nusa penida') || lower.includes('nusa')) return 'Nusa Penida';
  if (lower.includes('thimphu')) return 'Thimphu';
  if (lower.includes('punakha')) return 'Punakha';
  if (lower.includes('paro')) return 'Paro';
  if (lower.includes('lataguri')) return 'Lataguri';
  if (lower.includes('gangtok')) return 'Gangtok';
  if (lower.includes('lachen')) return 'Lachen';
  if (lower.includes('lachung')) return 'Lachung';
  if (lower.includes('gulmarg')) return 'Gulmarg';
  if (lower.includes('pahalgam')) return 'Pahalgam';
  if (lower.includes('munnar')) return 'Munnar';
  if (lower.includes('thekkady')) return 'Thekkady';
  if (lower.includes('alleppey')) return 'Alleppey';
  if (lower.includes('kovalam')) return 'Kovalam';
  if (lower.includes('cochin') || lower.includes('kochi')) return 'Cochin';
  if (lower.includes('udaipur')) return 'Udaipur';
  if (lower.includes('jodhpur')) return 'Jodhpur';
  if (lower.includes('jaisalmer')) return 'Jaisalmer';
  if (lower.includes('jaipur')) return 'Jaipur';
  if (lower.includes('pushkar')) return 'Pushkar';
  if (lower.includes('port blair') || lower.includes('port')) return 'Port Blair';
  if (lower.includes('havelock')) return 'Havelock';
  if (lower.includes('neil')) return 'Neil Island';
  if (lower.includes('dharamshala') || lower.includes('dharmshala')) return 'Dharamshala';
  if (lower.includes('dalhousie')) return 'Dalhousie';
  if (lower.includes('amritsar')) return 'Amritsar';
  if (lower.includes('rishikesh')) return 'Rishikesh';
  if (lower.includes('chopta')) return 'Chopta';
  if (lower.includes('joshimath')) return 'Joshimath';
  if (lower.includes('mussoorie')) return 'Mussoorie';
  if (lower.includes('haridwar')) return 'Haridwar';
  if (lower.includes('barkot')) return 'Barkot';
  if (lower.includes('uttarkashi')) return 'Uttarkashi';
  if (lower.includes('guptkashi')) return 'Guptkashi';
  if (lower.includes('kedarnath')) return 'Kedarnath';
  if (lower.includes('badrinath')) return 'Badrinath';
  if (lower.includes('ooty')) return 'Ooty';
  if (lower.includes('kodaikanal')) return 'Kodaikanal';
  if (lower.includes('coimbatore')) return 'Coimbatore';
  if (lower.includes('north goa')) return 'North Goa';
  if (lower.includes('south goa')) return 'South Goa';
  if (lower.includes('goa')) return 'Goa';
  if (lower.includes('pelling')) return 'Pelling';
  if (lower.includes('darjeeling')) return 'Darjeeling';
  if (lower.includes('hanle')) return 'Hanle';
  if (lower.includes('phuentsholing')) return 'Phuentsholing';
  if (lower.includes('gili')) return 'Gili Island';
  if (lower.includes('kuta')) return 'Kuta';
  if (lower.includes('pattaya')) return 'Pattaya';
  if (lower.includes('bangkok')) return 'Bangkok';
  if (lower.includes('phuket')) return 'Phuket';
  if (lower.includes('krabi')) return 'Krabi';
  if (lower.includes('koh phangan') || lower.includes('koh')) return 'Koh Phangan';
  if (lower.includes('singapore')) return 'Singapore';
  if (lower.includes('gushaini')) return 'Gushaini';
  if (lower.includes('chitkul')) return 'Chitkul';
  if (lower.includes('nako')) return 'Nako';
  if (lower.includes('tso moriri') || lower.includes('tso')) return 'Tso Moriri';
  if (lower.includes('aritar')) return 'Aritar';
  if (lower.includes('rishikhola')) return 'Rishikhola';

  // Fallback to title casing first word or full clean string if short
  if (clean.length < 15) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean.split(' ')[0];
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
    
    // Check if it's an overnight journey (transit night)
    const hasOvernightJourney = descLines.some(line => /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(line)) ||
                                /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(day.title);
    
    if (hasOvernightJourney) {
      // Don't count overnight journey as a hotel/stay location
      return;
    }

    // Look for "Overnight stay"
    let stayFound = false;
    for (const line of descLines) {
      const match = line.match(/Overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i);
      if (match) {
        const loc = cleanLocation(match[1]);
        if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
          stays.push(loc);
          stayFound = true;
          break;
        }
      }
    }
    if (!stayFound) {
      // Check title for "Overnight" or check if it's the last day (usually no overnight stay on last day)
      const titleMatch = day.title.match(/Overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i);
      if (titleMatch) {
        const loc = cleanLocation(titleMatch[1]);
        if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
          stays.push(loc);
          stayFound = true;
        }
      }
    }
    if (!stayFound) {
      // Look for check in / stay mentions
      for (const line of descLines) {
        const match = line.match(/(?:check in to your hotel in|check-in to your hotel in|check in to|check-in to|reach|arrive in|arrive at)\s+([^.]+)/i);
        if (match) {
          const loc = cleanLocation(match[1]);
          if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
            // Only add if not last day
            if (index < trip.itinerary.length - 1) {
              stays.push(loc);
              stayFound = true;
              break;
            }
          }
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

  return grouped.map(g => `${g.nights}N ${g.loc}`).join(' - ');
}

// Print a few trips as sample
const samples = trips.filter(t => t.title.includes('Spiti') || t.title.includes('Vietnam') || t.title.includes('Kashmir') || t.title.includes('Sikkim')).slice(0, 10);
samples.forEach((trip) => {
  console.log(`Trip: ${trip.title} (${trip.duration}D/${trip.duration-1}N)`);
  console.log(`Parsed: ${parseStaysForTrip(trip)}`);
  console.log('---');
});

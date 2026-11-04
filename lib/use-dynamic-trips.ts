'use client';

import { useState, useEffect } from 'react';
import { trips, Trip } from '@/lib/data';
import { getSectionMapping } from '@/lib/section-mappings';

export function useDestinationTrips(categoryId: string) {
  const [dynamicTrips, setDynamicTrips] = useState<Trip[]>([]);
  const sectionMap = getSectionMapping(categoryId);

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/trips?category=${encodeURIComponent(categoryId)}`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data)) {
          setDynamicTrips(data as Trip[]);
        }
      })
      .catch(() => {});
  }, [categoryId]);

  const getTripsBySection = (section: keyof typeof sectionMap) => {
    const tripIds = sectionMap[section] || [];
    const staticList = trips.filter(trip => tripIds.includes(trip.id));

    const dynamicList = dynamicTrips.filter(t => {
      const p = (t as any).placements;
      if (p && p.destinationPage && p.destinationCategory?.toLowerCase() === categoryId.toLowerCase()) {
        if (p.sections && p.sections[section]) return true;
        // Default to 'available' if no specific section is checked
        if (section === 'available' && (!p.sections || Object.values(p.sections).every(v => !v))) {
          return true;
        }
      }
      return false;
    });

    const combined = [...staticList];
    dynamicList.forEach(dt => {
      if (!combined.some(c => c.id === dt.id || c.slug === dt.slug)) {
        combined.push(dt);
      }
    });

    return combined;
  };

  return { getTripsBySection, sectionMap, dynamicTrips };
}


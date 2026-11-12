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

  const getTripsBySection = (section: keyof typeof sectionMap | 'couple') => {
    const lookupKey = section === 'couple' ? 'honeymoon' : section;
    const tripIds = (sectionMap as any)[lookupKey] || (sectionMap as any)[section] || [];
    const staticList = trips.filter(trip => tripIds.includes(trip.id));

    const dynamicList = dynamicTrips.filter(t => {
      const p = (t as any).placements;
      const isDestinationMatch =
        (p && p.destinationPage && p.destinationCategory?.toLowerCase() === categoryId.toLowerCase()) ||
        (t.category && t.category.toLowerCase() === categoryId.toLowerCase()) ||
        (t.destination && t.destination.toLowerCase() === categoryId.toLowerCase());

      if (isDestinationMatch) {
        if (p?.sections && (p.sections[section] || p.sections[lookupKey])) return true;
        // Smart auto-detection for group, family and couple/honeymoon trips
        if (section === 'group' && (t.tourType === 'Group' || p?.upcomingTours || p?.sections?.group)) return true;
        if ((section === 'honeymoon' || section === 'couple') && (p?.honeymoon || p?.sections?.honeymoon || p?.sections?.couple || t.category === 'honeymoon')) return true;
        if (section === 'family' && p?.sections?.family) return true;
        // Default to 'available' if no specific section is checked or if available is not explicitly false
        if (section === 'available') {
          return !p?.sections || p.sections.available !== false;
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


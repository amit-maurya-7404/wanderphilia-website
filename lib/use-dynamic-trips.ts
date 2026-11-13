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

    // Strict section classification to ensure zero cross-contamination:
    // 1. Group Trip section only has verified Group Trips
    // 2. Family Trip section only has verified Family Trips
    // 3. Couple / Honeymoon section only has verified Couple / Romantic Trips
    if (section === 'group') {
      return combined.filter(t => {
        const title = (t.title || '').toLowerCase();
        const tourType = ((t as any).tourType || '').toLowerCase();
        const p = (t as any).placements;

        if (/\b(couple\s*special|honeymoon|romantic\s*escape|family\s*vacation|family\s*getaway)\b/i.test(title)) {
          return false;
        }
        if (tourType === 'group' || p?.sections?.group === true) return true;
        if (/\b(group\s*trip|group\s*tour|bike\s*group|road\s*trip)\b/i.test(title)) return true;
        return false;
      });
    }

    if (section === 'family') {
      return combined.filter(t => {
        const title = (t.title || '').toLowerCase();
        const tourType = ((t as any).tourType || '').toLowerCase();
        const p = (t as any).placements;

        if (/\b(bike\s*group|couple\s*special|honeymoon|romantic\s*escape)\b/i.test(title)) {
          return false;
        }
        if (/\b(group\s*trip|group\s*tour)\b/i.test(title)) {
          return false;
        }
        if (tourType === 'family' || p?.sections?.family === true) return true;
        if (/\b(family)\b/i.test(title)) return true;
        const isExplicitlyMapped = tripIds.includes(t.id);
        if (isExplicitlyMapped && tourType !== 'group' && !title.includes('group')) return true;
        return false;
      });
    }

    if (section === 'honeymoon' || section === 'couple') {
      return combined.filter(t => {
        const title = (t.title || '').toLowerCase();
        const tourType = ((t as any).tourType || '').toLowerCase();
        const category = (t.category || '').toLowerCase();
        const p = (t as any).placements;

        if (/\b(group\s*trip|group\s*tour|bike\s*group|family)\b/i.test(title)) {
          return false;
        }
        if (category === 'honeymoon' || tourType === 'couple' || tourType === 'honeymoon') return true;
        if (p?.sections?.honeymoon === true || p?.sections?.couple === true || p?.honeymoon === true) return true;
        if (/\b(couple|honeymoon|romantic)\b/i.test(title)) return true;
        return false;
      });
    }

    if (section === 'custom') {
      return combined.filter(t => {
        const title = (t.title || '').toLowerCase();
        const tourType = ((t as any).tourType || '').toLowerCase();
        if (tourType === 'group' || /\b(bike\s*group|group\s*trip|group\s*tour)\b/i.test(title)) {
          return false;
        }
        return true;
      });
    }

    return combined;
  };

  return { getTripsBySection, sectionMap, dynamicTrips };
}


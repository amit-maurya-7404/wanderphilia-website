'use client';

import { useState, useEffect } from 'react';
import { trips as staticTrips, Trip } from '@/lib/data';

export function useMergedTrips(options?: { placement?: string; category?: string }): {
  trips: Trip[];
  loading: boolean;
} {
  const [tripsList, setTripsList] = useState<Trip[]>(staticTrips);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDynamic = async () => {
      try {
        setLoading(true);
        let url = '/api/trips';
        const params = new URLSearchParams();
        if (options?.placement) params.set('placement', options.placement);
        if (options?.category) params.set('category', options.category);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) return;
        const dynamicData: Trip[] = await res.json();

        if (!isMounted || !Array.isArray(dynamicData)) return;

        // Merge: Dynamic trips come first or add to static list
        const existingIds = new Set(dynamicData.map(t => t.slug || t.id));
        const filteredStatic = staticTrips.filter(t => !existingIds.has(t.slug) && !existingIds.has(t.id));

        setTripsList([...dynamicData, ...filteredStatic]);
      } catch (err) {
        console.error('[useMergedTrips error]:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDynamic();

    return () => {
      isMounted = false;
    };
  }, [options?.placement, options?.category]);

  return { trips: tripsList, loading };
}


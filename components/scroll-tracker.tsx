// components/scroll-tracker.tsx
'use client';

import { useEffect } from 'react';
import { gtag } from '@/lib/gtag';

export function ScrollTracker() {
  useEffect(() => {
    const scrollDepths = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !tracked.has(depth)) {
          gtag.scrollDepth(depth);
          tracked.add(depth);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
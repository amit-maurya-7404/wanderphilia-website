// components/analytics.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { gtag } from '@/lib/gtag';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments);
        };
      }
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    if (pathname) {
      // Track page view on route change
      gtag.pageview(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Track time on page
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      gtag.timeOnPage(timeSpent);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]); // Reset on page change

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
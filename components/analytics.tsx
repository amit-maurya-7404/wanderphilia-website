// components/analytics.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, gtag } from '@/lib/gtag';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
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

export function GoogleAnalyticsTracker() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Load Google Tag Manager Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/* Initialize gtag function */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
      {/* Track page views on route change (including first load) */}
      <Suspense fallback={null}>
        <TrackPageView />
      </Suspense>
    </>
  );
}
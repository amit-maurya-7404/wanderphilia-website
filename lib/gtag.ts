// lib/gtag.ts
// Google Analytics (GA4) utility functions
// Production-safe: Only loads if GA_MEASUREMENT_ID is set

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialization is handled in the Analytics component to ensure client-side only
// This file only provides the utility functions

export const gtag = {
  /**
   * Track page views
   * @param url - The URL of the page (optional, defaults to current)
   */
  pageview: (url?: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url || window.location.pathname,
      });
    }
  },

  /**
   * Track custom events
   * @param action - Event action (e.g., 'click', 'submit')
   * @param category - Event category (e.g., 'CTA', 'Booking')
   * @param label - Event label (e.g., button name, trip name)
   * @param value - Optional numeric value
   */
  event: ({
    action,
    category,
    label,
    value,
  }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  /**
   * Track outbound link clicks
   * @param url - The URL being clicked
   */
  outboundLink: (url: string) => {
    gtag.event({
      action: 'click',
      category: 'Outbound Link',
      label: url,
    });
  },

  /**
   * Track scroll depth
   * @param percentage - Scroll percentage (25, 50, 75, 100)
   */
  scrollDepth: (percentage: number) => {
    gtag.event({
      action: 'scroll',
      category: 'Engagement',
      label: `${percentage}%`,
    });
  },

  /**
   * Track time spent on page (call on page unload)
   * @param timeInSeconds - Time spent in seconds
   */
  timeOnPage: (timeInSeconds: number) => {
    gtag.event({
      action: 'time_on_page',
      category: 'Engagement',
      label: 'Page View Duration',
      value: timeInSeconds,
    });
  },
};

export default gtag;
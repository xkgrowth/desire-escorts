"use client";

import { useEffect } from "react";
import { useConsentCategory } from "./consent-context";

/**
 * Hook to conditionally execute tracking code based on consent.
 * 
 * @example
 * ```tsx
 * useTracking("analytics", () => {
 *   // Initialize Google Analytics
 *   gtag('config', 'GA_MEASUREMENT_ID');
 * });
 * ```
 */
export function useTracking(
  category: "analytics" | "marketing",
  callback: () => void | (() => void)
) {
  const hasConsent = useConsentCategory(category);

  useEffect(() => {
    if (hasConsent) {
      const cleanup = callback();
      return typeof cleanup === "function" ? cleanup : undefined;
    }
  }, [hasConsent, callback]);
}

/**
 * Hook specifically for analytics tracking.
 */
export function useAnalyticsTracking(callback: () => void | (() => void)) {
  return useTracking("analytics", callback);
}

/**
 * Hook specifically for marketing tracking.
 */
export function useMarketingTracking(callback: () => void | (() => void)) {
  return useTracking("marketing", callback);
}

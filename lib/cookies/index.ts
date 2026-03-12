export {
  type ConsentCategory,
  type ConsentPreferences,
  getConsent,
  saveConsent,
  clearConsent,
  hasConsent,
  hasAnyConsent,
} from "./consent";

export {
  ConsentProvider,
  useConsent,
  useConsentCategory,
} from "./consent-context";

export {
  useTracking,
  useAnalyticsTracking,
  useMarketingTracking,
} from "./use-tracking";

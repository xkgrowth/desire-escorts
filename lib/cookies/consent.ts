/**
 * Cookie consent management utilities.
 * Handles storage, retrieval, and validation of user consent preferences.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
};

const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_VERSION = "1.0";
const CONSENT_EXPIRY_DAYS = 365;

const defaultPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
  version: CONSENT_VERSION,
};

export function getConsentFromCookie(): ConsentPreferences | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!consentCookie) return null;

  try {
    const value = consentCookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as ConsentPreferences;

    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getConsentFromStorage(): ConsentPreferences | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentPreferences;

    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentPreferences | null {
  return getConsentFromStorage() ?? getConsentFromCookie();
}

export function saveConsent(preferences: Partial<ConsentPreferences>): ConsentPreferences {
  const consent: ConsentPreferences = {
    ...defaultPreferences,
    ...preferences,
    necessary: true,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(consent));
  }

  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setDate(expires.getDate() + CONSENT_EXPIRY_DAYS);
    const encoded = encodeURIComponent(JSON.stringify(consent));
    document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  return consent;
}

export function clearConsent(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(CONSENT_COOKIE_NAME);
  }

  if (typeof document !== "undefined") {
    document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  const consent = getConsent();
  if (!consent) return category === "necessary";
  return consent[category] ?? false;
}

export function hasAnyConsent(): boolean {
  return getConsent() !== null;
}

export { defaultPreferences, CONSENT_VERSION };

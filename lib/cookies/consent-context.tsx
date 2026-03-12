"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConsentPreferences,
  getConsent,
  hasAnyConsent,
  saveConsent,
  defaultPreferences,
} from "./consent";

type ConsentContextValue = {
  preferences: ConsentPreferences;
  hasConsented: boolean;
  isLoaded: boolean;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Partial<ConsentPreferences>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

type ConsentProviderProps = {
  children: React.ReactNode;
};

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (stored) {
      setPreferences(stored);
      setHasConsented(true);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, []);

  const acceptAll = useCallback(() => {
    const newPrefs = saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: newPrefs }));
  }, []);

  const rejectAll = useCallback(() => {
    const newPrefs = saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: newPrefs }));
  }, []);

  const savePreferencesHandler = useCallback((prefs: Partial<ConsentPreferences>) => {
    const newPrefs = saveConsent(prefs);
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: newPrefs }));
  }, []);

  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      preferences,
      hasConsented,
      isLoaded,
      showBanner,
      showSettings,
      acceptAll,
      rejectAll,
      savePreferences: savePreferencesHandler,
      openSettings,
      closeSettings,
      closeBanner,
    }),
    [
      preferences,
      hasConsented,
      isLoaded,
      showBanner,
      showSettings,
      acceptAll,
      rejectAll,
      savePreferencesHandler,
      openSettings,
      closeSettings,
      closeBanner,
    ]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}

export function useConsentCategory(category: "analytics" | "marketing") {
  const { preferences, hasConsented } = useConsent();
  return hasConsented && preferences[category];
}

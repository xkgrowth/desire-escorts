"use client";

import { ConsentProvider } from "@/lib/cookies/consent-context";
import { CookieBanner } from "./cookie-banner";
import { CookieSettingsModal } from "./cookie-settings-modal";

type CookieConsentProps = {
  children: React.ReactNode;
};

export function CookieConsent({ children }: CookieConsentProps) {
  return (
    <ConsentProvider>
      {children}
      <CookieBanner />
      <CookieSettingsModal />
    </ConsentProvider>
  );
}

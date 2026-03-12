"use client";

import { Cookie } from "lucide-react";
import { useConsent } from "@/lib/cookies/consent-context";

type ManageCookiesButtonProps = {
  className?: string;
  showIcon?: boolean;
};

export function ManageCookiesButton({ className, showIcon = false }: ManageCookiesButtonProps) {
  const { openSettings, isLoaded } = useConsent();

  if (!isLoaded) return null;

  return (
    <button
      onClick={openSettings}
      className={className}
    >
      {showIcon && <Cookie className="h-4 w-4 mr-1.5 inline-block" />}
      Cookie-instellingen
    </button>
  );
}

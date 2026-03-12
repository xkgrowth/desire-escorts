"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield, BarChart3, Megaphone } from "lucide-react";
import { useConsent } from "@/lib/cookies/consent-context";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type CategoryToggleProps = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

function CategoryToggle({
  id,
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: CategoryToggleProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-surface/50 border border-white/5">
      <div className="flex-shrink-0 mt-0.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor={id} className="font-heading font-bold text-foreground cursor-pointer">
            {title}
          </label>
          <button
            id={id}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors",
              checked ? "bg-primary" : "bg-foreground/20",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                "absolute top-0.5",
                checked ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
        {disabled && (
          <p className="mt-1 text-xs text-foreground/40 italic">Altijd actief</p>
        )}
      </div>
    </div>
  );
}

export function CookieSettingsModal() {
  const {
    showSettings,
    closeSettings,
    preferences,
    savePreferences,
    acceptAll,
    rejectAll,
  } = useConsent();

  const [localPrefs, setLocalPrefs] = useState({
    analytics: preferences.analytics,
    marketing: preferences.marketing,
  });

  useEffect(() => {
    if (showSettings) {
      setLocalPrefs({
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      });
    }
  }, [showSettings, preferences]);

  const handleSave = () => {
    savePreferences({
      necessary: true,
      analytics: localPrefs.analytics,
      marketing: localPrefs.marketing,
    });
  };

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeSettings}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="rounded-luxury border border-white/10 bg-surface/95 backdrop-blur-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    Cookie-instellingen
                  </h2>
                </div>
                <button
                  onClick={closeSettings}
                  className="p-2 text-foreground/40 hover:text-foreground/70 transition-colors rounded-lg hover:bg-white/5"
                  aria-label="Sluiten"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-sm text-foreground/70">
                  Kies welke cookies je wilt toestaan. Noodzakelijke cookies zijn altijd actief
                  voor de basisfunctionaliteit van de website.{" "}
                  <Link href="/cookiebeleid" className="text-primary hover:underline">
                    Meer informatie
                  </Link>
                </p>

                <div className="space-y-3">
                  <CategoryToggle
                    id="necessary"
                    icon={<Shield className="h-5 w-5 text-primary" />}
                    title="Noodzakelijk"
                    description="Vereist voor basisfuncties zoals navigatie, beveiliging en toegankelijkheid."
                    checked={true}
                    disabled={true}
                    onChange={() => {}}
                  />

                  <CategoryToggle
                    id="analytics"
                    icon={<BarChart3 className="h-5 w-5 text-primary" />}
                    title="Analytisch"
                    description="Helpt ons te begrijpen hoe bezoekers de website gebruiken, zodat we deze kunnen verbeteren."
                    checked={localPrefs.analytics}
                    onChange={(checked) => setLocalPrefs((p) => ({ ...p, analytics: checked }))}
                  />

                  <CategoryToggle
                    id="marketing"
                    icon={<Megaphone className="h-5 w-5 text-primary" />}
                    title="Marketing"
                    description="Gebruikt om relevante advertenties en campagnes te tonen op basis van je interesses."
                    checked={localPrefs.marketing}
                    onChange={(checked) => setLocalPrefs((p) => ({ ...p, marketing: checked }))}
                  />
                </div>
              </div>

              <div className="border-t border-white/10 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={rejectAll}>
                      Alles weigeren
                    </Button>
                    <Button variant="ghost" size="sm" onClick={acceptAll}>
                      Alles accepteren
                    </Button>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    Voorkeuren opslaan
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

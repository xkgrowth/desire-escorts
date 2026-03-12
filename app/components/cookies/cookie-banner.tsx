"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useConsent } from "@/lib/cookies/consent-context";
import { Button } from "../ui/button";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, closeBanner, isLoaded } = useConsent();

  if (!isLoaded) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-luxury border border-white/10 bg-surface/95 backdrop-blur-lg p-4 md:p-5 shadow-2xl">
              <button
                onClick={closeBanner}
                className="absolute right-3 top-3 p-1.5 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label="Sluiten"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex-1 pr-6 md:pr-0">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    We gebruiken cookies om de website goed te laten werken en je ervaring te
                    verbeteren.{" "}
                    <Link href="/cookiebeleid" className="text-primary hover:underline">
                      Lees meer
                    </Link>
                  </p>
                </div>

                <div className="flex flex-col gap-2 mr-6">
                  <Button variant="primary" size="sm" onClick={acceptAll}>
                    Alles accepteren
                  </Button>
                  <button
                    onClick={rejectAll}
                    className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors py-1"
                  >
                    Alleen noodzakelijk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

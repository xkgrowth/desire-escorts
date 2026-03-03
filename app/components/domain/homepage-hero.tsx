"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, User } from "lucide-react";

type HeroProfile = {
  name: string;
  slug: string;
  imageUrl?: string;
  tagline?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  rankScore?: number;
};

type HomepageHeroProps = {
  profiles: HeroProfile[];
  className?: string;
};

const avatarPositions = [
  { top: "12%", left: "20%" },
  { top: "26%", left: "62%" },
  { top: "44%", left: "28%" },
  { top: "55%", left: "70%" },
  { top: "72%", left: "24%" },
  { top: "18%", left: "78%" },
  { top: "68%", left: "52%" },
  { top: "34%", left: "46%" },
  { top: "80%", left: "76%" },
];

export function HomepageHero({ profiles, className }: HomepageHeroProps) {
  const availableProfiles = useMemo(
    () => profiles.filter((profile) => profile.isAvailable),
    [profiles]
  );

  const [visibleAvatarCount, setVisibleAvatarCount] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    availableProfiles[0]?.slug ?? null
  );
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    if (availableProfiles.length === 0) return;

    hasInitialized.current = true;
    setSelectedSlug(availableProfiles[0]?.slug ?? null);

    const interval = window.setInterval(() => {
      setVisibleAvatarCount((current) => {
        if (current >= availableProfiles.length) {
          window.clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [availableProfiles]);

  const selectedProfile =
    availableProfiles.find((profile) => profile.slug === selectedSlug) ??
    availableProfiles[0];

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background",
        className
      )}
    >

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="grid min-h-[500px] grid-cols-1 gap-8 pb-6 pt-8 lg:min-h-[520px] lg:grid-cols-2 lg:pb-8 lg:pt-10">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-xl text-3xl font-heading font-bold leading-tight md:text-4xl lg:text-5xl">
            <span className="text-gradient-gold">Jouw Perfecte Escort Service</span>
            <span className="text-gradient-gold"> in Nederland,</span>
            <span className="text-foreground"> Discreet en Betrouwbaar</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Bekijk geverifieerde escort profielen, check live beschikbaarheid en boek met
            volledige discretie. Voor escort Amsterdam en amsterdam escort ben je hier direct op de juiste plek.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/escorts/"
              className="btn-bevel-premium inline-flex items-center justify-center rounded-luxury px-8 py-3 text-base font-heading font-bold text-primary-foreground"
            >
              Alle Escorts
            </Link>
            <Link
              href="/services/"
              className="group inline-flex items-center gap-2 rounded-luxury border border-white/20 bg-surface/40 px-6 py-3 text-base font-heading font-semibold text-foreground/90 transition-all duration-300 hover:border-primary/40 hover:bg-surface/70 hover:text-foreground hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
            >
              Onze Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-[340px] w-full rounded-[26px] border border-white/10 bg-surface/20 p-4 backdrop-blur-sm lg:h-[400px]">
            <div className="absolute left-4 top-4 z-40 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-surface/85 px-4 py-2 text-xs text-foreground/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              {availableProfiles.length} escorts nu beschikbaar
            </div>
            <div
              className="pointer-events-none absolute inset-0 rounded-[26px] opacity-[0.12]"
              style={{
                backgroundImage: "url(/brand/netherlands-map.svg)",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            <div className="absolute inset-x-4 top-14 bottom-32 z-30">
              {availableProfiles.slice(0, visibleAvatarCount).map((profile, index) => {
                const position = avatarPositions[index % avatarPositions.length];
                const isSelected = selectedSlug === profile.slug;

                return (
                  <motion.button
                    key={profile.slug}
                    type="button"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    onClick={() => setSelectedSlug(profile.slug)}
                    className={cn(
                      "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                      "focus-ring outline-none transition-transform duration-300",
                      isSelected && "z-40 scale-110"
                    )}
                    style={{ top: position.top, left: position.left }}
                    aria-label={`Open mini profile card for ${profile.name}`}
                  >
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 3 + (index % 3) * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                      className="block"
                    >
                      <span
                        className={cn(
                          "absolute -inset-1 rounded-full transition-all duration-300",
                          isSelected
                            ? "border-2 border-primary shadow-[0_0_24px_rgba(247,208,99,0.5)]"
                            : "border border-transparent"
                        )}
                      />
                      <span className="relative block h-14 w-14 lg:h-16 lg:w-16">
                        <span
                          className={cn(
                            "relative block h-full w-full overflow-hidden rounded-full border bg-surface transition-all duration-300",
                            isSelected ? "border-primary/80" : "border-white/25"
                          )}
                        >
                          {profile.imageUrl ? (
                            <Image
                              src={profile.imageUrl}
                              alt={profile.name}
                              fill
                              sizes="64px"
                              className="rounded-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center">
                              <User className="h-6 w-6 text-foreground/30" />
                            </span>
                          )}
                        </span>
                      </span>
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>

            {selectedProfile && (
              <motion.div
                key={selectedProfile.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/15 bg-surface/90 p-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/20 bg-surface-muted">
                    {selectedProfile.imageUrl ? (
                      <Image
                        src={selectedProfile.imageUrl}
                        alt={selectedProfile.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <User className="h-5 w-5 text-foreground/30" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <p className="truncate font-heading font-bold text-foreground">
                        {selectedProfile.name}
                      </p>
                      {selectedProfile.isVerified && <Badge variant="verified" />}
                      <Badge variant="available" />
                    </div>
                    <p className="line-clamp-1 text-sm text-foreground/65">
                      {selectedProfile.tagline ?? "Available now for a discreet booking."}
                    </p>
                  </div>
                  <Link
                    href={`/escort/${selectedProfile.slug}/`}
                    className="flex-shrink-0 rounded-luxury border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary transition hover:border-primary hover:bg-primary/10"
                  >
                    View profile
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        </div>
      </div>

    </section>
  );
}

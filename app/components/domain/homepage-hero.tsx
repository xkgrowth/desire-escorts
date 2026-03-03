"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { ProfileCardCompact } from "./profile-card";
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

  const topProfiles = useMemo(() => {
    const sorted = [...profiles].sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0));
    const takeCount = Math.max(1, Math.ceil(sorted.length * 0.3));
    return sorted.slice(0, takeCount);
  }, [profiles]);

  const [visibleAvatarCount, setVisibleAvatarCount] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    availableProfiles[0]?.slug ?? null
  );

  useEffect(() => {
    if (availableProfiles.length === 0) {
      setVisibleAvatarCount(0);
      setSelectedSlug(null);
      return;
    }

    setVisibleAvatarCount(0);
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
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-background/80",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_70%_20%,rgba(180,100,50,0.2)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(26,27,23,0.96)_0%,rgba(26,27,23,0.74)_50%,rgba(26,27,23,0.96)_100%)]" />

      <div className="relative z-10 grid min-h-[600px] grid-cols-1 gap-10 px-6 pb-8 pt-10 md:px-10 lg:min-h-[680px] lg:grid-cols-2 lg:px-14 lg:pb-10 lg:pt-14">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-white/15 bg-surface/80 px-4 py-2 text-xs text-foreground/80">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
            {availableProfiles.length} escorts available right now
          </div>

          <h1 className="max-w-xl text-4xl font-heading font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Defining Premium Digital Desire, One Perfect Match at a Time
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Discover verified high-class escorts, see live availability, and book with
            full discretion. Start with the profiles currently online now.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/escorts/"
              className="btn-bevel inline-flex items-center justify-center rounded-luxury px-8 py-3 text-base font-heading font-bold text-primary-foreground"
            >
              All Escorts
            </Link>
            <Link
              href="/services/"
              className="inline-flex items-center gap-2 rounded-luxury border border-white/20 bg-surface/40 px-6 py-3 text-base font-heading font-semibold text-foreground/90 transition hover:border-primary/40 hover:text-foreground"
            >
              Explore Our Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px] lg:min-h-[480px]">
          <div className="absolute right-0 top-0 rounded-full border border-white/15 bg-surface/70 px-4 py-2 text-sm text-foreground/80">
            <span className="mr-1 text-primary">{availableProfiles.length}</span>
            currently available
          </div>

          <div className="relative mt-14 h-[320px] rounded-[26px] border border-white/10 bg-surface/20 p-4 backdrop-blur-sm lg:h-[420px]">
            <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(247,208,99,0.14)_0%,rgba(247,208,99,0.03)_55%,transparent_80%)]" />

            {availableProfiles.slice(0, visibleAvatarCount).map((profile, index) => {
              const position = avatarPositions[index % avatarPositions.length];

              return (
                <motion.button
                  key={profile.slug}
                  type="button"
                  initial={{ opacity: 0, scale: 0.6, y: 12 }}
                  animate={{
                    opacity: 1,
                    scale: selectedSlug === profile.slug ? 1.08 : 1,
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3.6 + (index % 3) * 0.4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    delay: index * 0.12,
                  }}
                  onClick={() => setSelectedSlug(profile.slug)}
                  className={cn(
                    "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                    "focus-ring outline-none"
                  )}
                  style={{ top: position.top, left: position.left }}
                  aria-label={`Open mini profile card for ${profile.name}`}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full border transition",
                      selectedSlug === profile.slug
                        ? "border-primary/60 shadow-[0_0_20px_rgba(247,208,99,0.4)]"
                        : "border-white/20"
                    )}
                  />
                  <span className="relative block h-14 w-14 overflow-hidden rounded-full border border-white/25 bg-surface lg:h-16 lg:w-16">
                    {profile.imageUrl ? (
                      <Image
                        src={profile.imageUrl}
                        alt={profile.name}
                        fill
                        sizes="64px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-foreground/30" />
                      </span>
                    )}
                  </span>
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
              className="mt-4 w-full rounded-2xl border border-white/15 bg-surface/80 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/20 bg-surface-muted">
                  {selectedProfile.imageUrl ? (
                    <Image
                      src={selectedProfile.imageUrl}
                      alt={selectedProfile.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      <User className="h-6 w-6 text-foreground/30" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
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
                  className="rounded-full border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary transition hover:border-primary hover:bg-primary/10"
                >
                  View profile
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-background/55 px-4 py-4 md:px-8 lg:px-12">
        <p className="mb-3 text-sm text-foreground/60">
          Top 30% profiles in this fold
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topProfiles.map((profile) => (
            <ProfileCardCompact
              key={profile.slug}
              name={profile.name}
              slug={profile.slug}
              imageUrl={profile.imageUrl}
              isVerified={profile.isVerified}
              isAvailable={profile.isAvailable}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

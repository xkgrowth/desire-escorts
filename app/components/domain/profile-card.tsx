"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { User } from "lucide-react";

const PLACEHOLDER_IMAGE = "/brand/placeholder-profile.jpg";

type ProfileCardProps = {
  name: string;
  slug: string;
  imageUrl?: string;
  tagline?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  age?: number;
  height?: string;
  cupSize?: string;
  className?: string;
};

export function ProfileCard({
  name,
  slug,
  imageUrl,
  tagline,
  isVerified = false,
  isAvailable = true,
  age,
  height,
  cupSize,
  className,
}: ProfileCardProps) {
  const hasImage = imageUrl && imageUrl !== PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/escort/${slug}/`}
      className={cn("group block aspect-[5/8]", className)}
    >
      <div className="relative w-full h-full rounded-luxury p-[1.5px] bg-gradient-to-b from-white/45 via-white/14 to-white/24 transition-all duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_12px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_18px_rgba(255,255,255,0.12),0_0_26px_rgba(247,208,99,0.18),inset_0_1px_0_rgba(255,255,255,0.28)]">
        {/* Hover glass rim */}
        <div className="absolute inset-0 rounded-luxury border border-primary/35 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-surface border border-white/20">
          {/* Image or Placeholder */}
          <div className="absolute inset-0 z-0">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-surface-muted to-surface flex items-center justify-center">
                <User className="w-24 h-24 text-foreground/20" />
              </div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

          {/* Inner glass line/bevel */}
          <div className="absolute inset-0 z-[11] pointer-events-none rounded-[18px] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08)]" />

          {/* Availability status - top right */}
          <div className="absolute top-4 right-4 z-20">
            <Badge variant={isAvailable ? "available" : "unavailable"} />
          </div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-5">
            {/* Blur backdrop */}
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/90 to-transparent"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                maskImage:
                  "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
              }}
            />

            <div className="relative flex flex-col gap-2">
              {/* Name and verified badge */}
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-heading font-bold text-foreground truncate drop-shadow-md">
                  {name}
                </h3>
                {isVerified && <Badge variant="verified" />}
              </div>

              {/* Tagline */}
              {tagline && (
                <p className="text-sm text-foreground/70 line-clamp-2 leading-snug">
                  {tagline}
                </p>
              )}

              {/* Stats row: Leeftijd, Lengte, Cup */}
              {(age || height || cupSize) && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  {age && (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-foreground">
                        {age}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-foreground/50">
                        Leeftijd
                      </span>
                    </div>
                  )}
                  {height && (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-foreground">
                        {height}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-foreground/50">
                        Lengte
                      </span>
                    </div>
                  )}
                  {cupSize && (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-foreground">
                        {cupSize}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-foreground/50">
                        Cup
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

type ProfileCardCompactProps = {
  name: string;
  slug: string;
  imageUrl?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  className?: string;
};

export function ProfileCardCompact({
  name,
  slug,
  imageUrl,
  isVerified = false,
  isAvailable = true,
  className,
}: ProfileCardCompactProps) {
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/escort/${slug}/`}
      className={cn("group block", className)}
    >
      <div className="flex items-center gap-4 p-3 rounded-lg bg-surface/50 border border-white/5 transition-all duration-300 hover:border-primary/20 hover:bg-surface">
        {/* Avatar with availability dot */}
        <div className="relative flex-shrink-0">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-muted">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-7 h-7 text-foreground/20" />
              </div>
            )}
          </div>
          {/* Pulsing green dot overlapping the avatar */}
          {isAvailable && (
            <span className="absolute -bottom-0.5 -right-0.5 z-10 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-surface bg-green-500" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-foreground truncate">
              {name}
            </h4>
            {isVerified && <Badge variant="verified" />}
          </div>
          <p className="text-sm text-foreground/50">
            {isAvailable ? "Beschikbaar" : "Niet beschikbaar"}
          </p>
        </div>

        {/* Arrow */}
        <div className="text-foreground/30 group-hover:text-primary transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Heart, Share2, User, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

type ProfileImage = {
  url: string;
  alt: string;
};

type ProfileHeroProps = {
  name: string;
  tagline?: string;
  description?: string;
  images: ProfileImage[];
  isVerified?: boolean;
  isAvailable?: boolean;
  age?: number;
  height?: string;
  weight?: string;
  cupSize?: string;
  posture?: "Slim" | "Normaal" | "Curvy";
  eyeColor?: string;
  hairColor?: string;
  sexuality?: string;
  languages?: string[];
  services?: string[];
  whatsapp?: string;
  className?: string;
};

export function ProfileHero({
  name,
  tagline,
  description,
  images,
  isVerified = false,
  isAvailable = true,
  age,
  height,
  weight,
  cupSize,
  posture,
  eyeColor,
  hairColor,
  sexuality,
  languages,
  services,
  whatsapp,
  className,
}: ProfileHeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const hasImages = images.length > 0;

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10", className)}>
      {/* Gallery Section */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] rounded-luxury overflow-hidden bg-surface">
          {hasImages ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-32 h-32 text-foreground/20" />
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm text-foreground/70">
              {activeImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all",
                  activeImage === index
                    ? "ring-2 ring-primary"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="action" size="sm" className="flex-1 gap-2">
            <Heart className="w-4 h-4" />
            Favoriet
          </Button>
          <Button variant="action" size="sm" className="flex-1 gap-2">
            <Share2 className="w-4 h-4" />
            Delen
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col">
        {/* Name & Verified */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            {name}
          </h1>
          {isVerified && <Badge variant="verified" />}
        </div>

        {/* Tagline / Description */}
        {(tagline || description) && (
          <div className="mb-6">
            <p className="text-foreground/70 leading-relaxed">
              {description && description.length > 150 && !showFullDescription
                ? `${description.slice(0, 150)}...`
                : description || tagline}
            </p>
            {description && description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary text-sm font-medium mt-2 flex items-center gap-1"
              >
                + {showFullDescription ? "Verberg beschrijving" : "Lees de volledige beschrijving"}
              </button>
            )}
          </div>
        )}

        {/* Primary Stats Grid - Simple without icons */}
        <div className="grid grid-cols-5 gap-2 p-4 rounded-luxury bg-surface/50 border border-white/5 mb-6">
          {cupSize && (
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{cupSize} cup</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/40">Cup</div>
            </div>
          )}
          {height && (
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{height}</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/40">Lengte</div>
            </div>
          )}
          {age && (
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{age} yrs</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/40">Leeftijd</div>
            </div>
          )}
          {weight && (
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{weight}</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/40">Gewicht</div>
            </div>
          )}
          {posture && (
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{posture}</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/40">Postuur</div>
            </div>
          )}
        </div>

        {/* Services */}
        {services && services.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-surface border border-white/5 text-foreground/70"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-3">Talen</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Badge key={lang} variant="service">{lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Characteristics Table */}
        {(eyeColor || hairColor || sexuality) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-3">Kenmerken</h3>
            <div className="rounded-lg bg-surface/30 border border-white/5 overflow-hidden">
              {eyeColor && (
                <div className="flex justify-between px-4 py-2.5 border-b border-white/5">
                  <span className="text-foreground/60">Kleur ogen</span>
                  <span className="text-foreground font-medium">{eyeColor}</span>
                </div>
              )}
              {hairColor && (
                <div className="flex justify-between px-4 py-2.5 border-b border-white/5">
                  <span className="text-foreground/60">Kleur haar</span>
                  <span className="text-foreground font-medium">{hairColor}</span>
                </div>
              )}
              {sexuality && (
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-foreground/60">Geaardheid</span>
                  <span className="text-foreground font-medium">{sexuality}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Card */}
        <div className="mt-auto p-6 rounded-luxury bg-surface/50 border border-white/5">
          <h3 className="text-sm font-medium text-primary uppercase tracking-wider mb-2 text-center">
            Plan Your Experience
          </h3>
          <p className="text-sm text-foreground/60 text-center mb-4">
            Share your preferred timing, area, and style, and our team will guide you discreetly. Rates are available upon request.
          </p>
          <div className="flex gap-3">
            <Button variant="premium" size="lg" className="flex-1 gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </Button>
            {whatsapp && (
              <Button variant="whatsapp" size="lg" className="flex-1 gap-2">
                <WhatsAppIcon size={20} />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

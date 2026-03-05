"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ResilientImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  sizes?: string;
  muted?: boolean;
};

export function ResilientImage({
  src,
  alt,
  wrapperClassName,
  imageClassName,
  fallbackLabel,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  muted = false,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(!src);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface/80 via-surface/65 to-primary/10">
          <div className="flex flex-col items-center gap-2 text-center text-foreground/60">
            <ImageOff className="h-6 w-6 text-primary/80" />
            <p className="text-xs uppercase tracking-wide">{fallbackLabel ?? "Sfeerbeeld"}</p>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-500",
            muted && "scale-[1.01] saturate-75 brightness-75 contrast-95",
            imageClassName
          )}
          onError={() => setHasError(true)}
        />
      )}
      {muted && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141A1B]/45 via-transparent to-[#141A1B]/20" />
      )}
    </div>
  );
}

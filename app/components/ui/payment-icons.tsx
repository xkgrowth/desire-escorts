"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type PaymentIconsProps = {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  withTileBackground?: boolean;
};

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

const paymentIcons = [
  { name: "Apple Pay", src: "/assets/applepay.svg" },
  { name: "Google Pay", src: "/assets/googlepay.svg" },
  { name: "Bancontact", src: "/assets/bancontact.svg" },
  { name: "iDEAL", src: "/assets/ideal.svg" },
  { name: "Mastercard", src: "/assets/mastercard.svg" },
  { name: "Visa", src: "/assets/visa.svg" },
  { name: "Maestro", src: "/assets/maestro.svg" },
  { name: "Cash", src: "/assets/cash.svg" },
];

export function PaymentIcons({
  className,
  iconSize = "md",
  withTileBackground = true,
}: PaymentIconsProps) {
  const iconClass = cn(sizeClasses[iconSize], "w-auto");

  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {paymentIcons.map((icon) => (
        <div
          key={icon.name}
          className={cn(
            iconClass,
            "flex items-center justify-center",
            withTileBackground && "rounded bg-white px-2 py-1"
          )}
          title={icon.name}
        >
          <Image
            src={icon.src}
            alt={icon.name}
            width={80}
            height={32}
            className="h-full w-auto"
          />
        </div>
      ))}
    </div>
  );
}

export function IdealIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/ideal.svg"
      alt="iDEAL"
      width={80}
      height={32}
      className={cn("h-8 w-auto", className)}
    />
  );
}

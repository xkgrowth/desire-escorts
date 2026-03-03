"use client";

import { cn } from "@/lib/utils";

type PaymentIconsProps = {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

export function PaymentIcons({ className, iconSize = "md" }: PaymentIconsProps) {
  const iconClass = cn(sizeClasses[iconSize], "w-auto");
  
  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {/* iDEAL */}
      <div className={cn(iconClass, "bg-white rounded px-2 py-1 flex items-center justify-center")}>
        <svg viewBox="0 0 48 32" className="h-full w-auto" fill="none">
          <rect width="48" height="32" rx="4" fill="white"/>
          <path d="M16 8h-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-8a4 4 0 0 0-4-4z" fill="#CC0066"/>
          <circle cx="14" cy="16" r="4" fill="white"/>
          <path d="M24 10h10v2h-7v3h6v2h-6v5h-3V10z" fill="#CC0066"/>
        </svg>
      </div>
      
      {/* Visa */}
      <div className={cn(iconClass, "bg-white rounded px-2 py-1 flex items-center justify-center")}>
        <svg viewBox="0 0 48 32" className="h-full w-auto" fill="none">
          <rect width="48" height="32" rx="4" fill="white"/>
          <path d="M19.5 11L17 21h-3l2.5-10h3zM28.5 11l-4 10h-3l4-10h3zM33 11l3 10h-3l-0.5-2h-3.5l-0.5 2h-3l3-10h4.5zm-1 6l-1-3-1 3h2z" fill="#1A1F71"/>
        </svg>
      </div>
      
      {/* MasterCard */}
      <div className={cn(iconClass, "bg-white rounded px-2 py-1 flex items-center justify-center")}>
        <svg viewBox="0 0 48 32" className="h-full w-auto" fill="none">
          <rect width="48" height="32" rx="4" fill="white"/>
          <circle cx="18" cy="16" r="8" fill="#EB001B"/>
          <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
          <path d="M24 10a8 8 0 0 0 0 12 8 8 0 0 0 0-12z" fill="#FF5F00"/>
        </svg>
      </div>
      
      {/* PIN/Debit */}
      <div className={cn(iconClass, "bg-white rounded px-2 py-1 flex items-center justify-center")}>
        <svg viewBox="0 0 48 32" className="h-full w-auto" fill="none">
          <rect width="48" height="32" rx="4" fill="white"/>
          <rect x="8" y="8" width="32" height="16" rx="2" fill="#006EAF"/>
          <text x="24" y="19" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">PIN</text>
        </svg>
      </div>
      
      {/* Cash/Contant */}
      <div className={cn(iconClass, "bg-white rounded px-2 py-1 flex items-center justify-center")}>
        <svg viewBox="0 0 48 32" className="h-full w-auto" fill="none">
          <rect width="48" height="32" rx="4" fill="white"/>
          <rect x="6" y="8" width="36" height="16" rx="2" fill="#85BB65"/>
          <circle cx="24" cy="16" r="5" fill="white" fillOpacity="0.3"/>
          <text x="24" y="19" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">€</text>
        </svg>
      </div>
    </div>
  );
}

export function IdealIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={cn("h-8 w-auto", className)} fill="none">
      <rect width="48" height="32" rx="4" fill="white"/>
      <path d="M16 8h-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-8a4 4 0 0 0-4-4z" fill="#CC0066"/>
      <circle cx="14" cy="16" r="4" fill="white"/>
      <path d="M24 10h10v2h-7v3h6v2h-6v5h-3V10z" fill="#CC0066"/>
    </svg>
  );
}

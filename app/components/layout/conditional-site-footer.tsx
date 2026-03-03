"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalSiteFooter() {
  const pathname = usePathname();

  // Hide the footer on design-system page since it renders its own footer inline
  if (pathname?.startsWith("/design-system")) {
    return null;
  }

  return (
    <div className="m-3 mt-0 rounded-luxury overflow-hidden border border-white/10">
      <Footer className="bottom-glow" />
    </div>
  );
}

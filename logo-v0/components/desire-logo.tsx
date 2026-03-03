"use client"

import { StaticHeart, ShinyHeart } from "@/components/shiny-heart"

// ─── Shared layout ────────────────────────────────────────────────────────────

function LogoLayout({
  heartSize,
  fontSize,
  gap,
  animated,
}: {
  heartSize: number
  fontSize: number
  gap: number
  animated: boolean
}) {
  const Heart = animated ? ShinyHeart : StaticHeart

  return (
    <div
      className="inline-flex items-center font-serif"
      style={{ gap, userSelect: "none" }}
      role="img"
      aria-label="desire escorts"
    >
      {/* "desire" */}
      <span
        style={{
          fontFamily: "var(--font-sora), 'Sora', sans-serif",
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: "#F5F4F3",
        }}
      >
        desire
      </span>

      {/* Heart icon — vertically centred, sits like an inline glyph */}
      <span
        className="inline-flex items-center justify-center"
        style={{ width: heartSize, height: heartSize, flexShrink: 0 }}
        aria-hidden
      >
        <Heart size={heartSize} />
      </span>

      {/* "escorts" */}
      <span
        style={{
          fontFamily: "var(--font-sora), 'Sora', sans-serif",
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: "#F5F4F3",
        }}
      >
        escorts
      </span>
    </div>
  )
}

// ─── Static logo ──────────────────────────────────────────────────────────────

export function DesireLogoStatic({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const scales = {
    sm: { heartSize: 16, fontSize: 18, gap: 5 },
    md: { heartSize: 26, fontSize: 28, gap: 7 },
    lg: { heartSize: 38, fontSize: 42, gap: 10 },
    xl: { heartSize: 58, fontSize: 64, gap: 14 },
  }
  const s = scales[size]

  return (
    <div className={className}>
      <LogoLayout {...s} animated={false} />
    </div>
  )
}

// ─── Animated logo ────────────────────────────────────────────────────────────

export function DesireLogoAnimated({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const scales = {
    sm: { heartSize: 16, fontSize: 18, gap: 5 },
    md: { heartSize: 26, fontSize: 28, gap: 7 },
    lg: { heartSize: 38, fontSize: 42, gap: 10 },
    xl: { heartSize: 58, fontSize: 64, gap: 14 },
  }
  const s = scales[size]

  return (
    <div className={className}>
      <LogoLayout {...s} animated={true} />
    </div>
  )
}

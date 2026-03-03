"use client"

import { ArrowRight } from "lucide-react"

export default function Nav() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-8">
      {/* Centered pill nav */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <nav
          className="flex items-center gap-8 px-6 py-3 rounded-full"
          style={{
            background: "rgba(32, 34, 22, 0.80)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border)",
          }}
        >
          <span
            className="font-serif font-bold text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            CarbonGold
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Tokens
          </span>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Typography
          </span>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Components
          </span>
        </nav>
      </div>

      {/* Right CTA */}
      <div className="ml-auto">
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Use This System
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  )
}

const motionRules = [
  {
    token: "Duration Fast",
    value: "150ms",
    use: "Color / opacity transitions",
    example: "transition: color 150ms ease",
  },
  {
    token: "Duration Default",
    value: "250ms",
    use: "Transform + border interactions",
    example: "transition: transform 250ms ease",
  },
  {
    token: "Duration Slow",
    value: "400ms",
    use: "Scroll-triggered fade-ins",
    example: "animation: fadeUp 400ms ease forwards",
  },
  {
    token: "Easing",
    value: "ease",
    use: "All transitions (no spring, no bounce)",
    example: "transition-timing-function: ease",
  },
  {
    token: "Card Hover Lift",
    value: "translateY(-3px)",
    use: "All surface cards on :hover",
    example: "hover:-translate-y-0.5 → -translate-y-1",
  },
  {
    token: "Arrow Shift",
    value: "translateX(4px)",
    use: "All inline arrow links on :hover",
    example: "group-hover:translate-x-1",
  },
  {
    token: "Fade-in (scroll)",
    value: "opacity 0→1 + translateY(12px→0)",
    use: "Staggered card entries, 100ms apart",
    example: "animation-delay: calc(var(--i) * 100ms)",
  },
]

const doRules = [
  "Pill-shaped CTAs and nav containers",
  "Asymmetric bento grids with varied col-span",
  "Warm radial glow as section depth — never decoration",
  "Inter for all UI/body text",
  "Lucide line icons at 18–24px, strokeWidth 1.5",
  "Royal Gold as the single accent — used sparingly",
  "Let dark space breathe between sections",
]

const dontRules = [
  "Light mode, white backgrounds, or light cards",
  "More than 2 font families",
  "Purple, teal, neon, or mixed-temperature gradients",
  "Filled icons or emoji as UI affordances",
  "Uniform equal-width grid columns",
  "Gradient text or gradient buttons",
  "Auto-playing loops, pulse animations, spinning elements",
]

export default function MotionTokens() {
  return (
    <section
      className="px-6 py-24 max-w-6xl mx-auto"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionLabel>05 — Motion & Rules</SectionLabel>
      <h2
        className="font-serif font-bold mb-4 text-balance"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--foreground)" }}
      >
        Motion Tokens & Do / Don&apos;t
      </h2>
      <p className="mb-16 max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        Subtle and purposeful. Nothing animates without reason.
      </p>

      {/* Motion table */}
      <div
        className="rounded-2xl overflow-hidden mb-12"
        style={{ border: "1px solid var(--border-subtle)" }}
      >
        <div
          className="grid grid-cols-3 gap-4 px-6 py-3 text-xs font-semibold tracking-widest uppercase"
          style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
        >
          <span>Token</span>
          <span>Value</span>
          <span>Usage</span>
        </div>
        {motionRules.map((rule, i) => (
          <div
            key={rule.token}
            className="grid grid-cols-3 gap-4 px-6 py-4 text-sm items-center"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "var(--surface-elevated)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{rule.token}</span>
            <code
              className="font-mono text-xs px-2 py-1 rounded w-fit"
              style={{ background: "rgba(247,208,99,0.10)", color: "var(--accent)" }}
            >
              {rule.value}
            </code>
            <span style={{ color: "var(--muted-foreground)" }}>{rule.use}</span>
          </div>
        ))}
      </div>

      {/* Do / Don't */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid rgba(247,208,99,0.15)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--accent)" }}>
            Do
          </p>
          <ul className="space-y-3">
            {doRules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span
                  className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(247,208,99,0.15)", color: "var(--accent)" }}
                >
                  +
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--muted-foreground)" }}>
            Don&apos;t
          </p>
          <ul className="space-y-3">
            {dontRules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span
                  className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
                >
                  -
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-16 rounded-2xl p-8 text-center"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(247,208,99,0.08) 0%, var(--surface) 70%)`,
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="font-serif font-bold text-balance mb-3"
          style={{ fontSize: "1.5rem", color: "var(--foreground)" }}
        >
          Ready for Cursor
        </p>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          Paste this system into your <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>.cursorrules</code> file or reference it directly in a chat prompt. Every value is precise — no interpretation required.
        </p>
      </div>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
      {children}
    </p>
  )
}

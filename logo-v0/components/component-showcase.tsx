import { ArrowRight, Globe, Palette, Layers, Zap } from "lucide-react"

export default function ComponentShowcase() {
  return (
    <section
      className="px-6 py-24 max-w-6xl mx-auto"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionLabel>03 — Components</SectionLabel>
      <h2
        className="font-serif font-bold mb-4 text-balance"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--foreground)" }}
      >
        Component Patterns
      </h2>
      <p className="mb-16 max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        Every interactive primitive — buttons, cards, badges, inputs — built from the token system.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Buttons */}
        <ShowcaseBlock title="Buttons">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              Primary CTA
            </button>
            <button
              className="flex items-center gap-2 text-sm font-medium group transition-all"
              style={{ color: "var(--foreground)" }}
            >
              Ghost link
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              className="px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent-foreground)" }}
            >
              Muted CTA
            </button>
          </div>
          <CodeSnip>{`bg: var(--accent)  |  border-radius: 9999px
color: var(--accent-foreground)
hover: opacity 0.85`}</CodeSnip>
        </ShowcaseBlock>

        {/* Badges */}
        <ShowcaseBlock title="Badges & Labels">
          <div className="flex flex-wrap gap-3 items-center">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{ background: "rgba(247,208,99,0.12)", color: "var(--accent)" }}
            >
              Royal Gold
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{ background: "var(--surface-elevated)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              Surface
            </span>
            <span
              className="font-serif font-bold px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              Logo Pill
            </span>
          </div>
          <CodeSnip>{`Label pill: rgba(247,208,99,0.12) bg
Logo pill: var(--accent) solid fill`}</CodeSnip>
        </ShowcaseBlock>

        {/* Card */}
        <ShowcaseBlock title="Service Card">
          <div
            className="rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-default"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <Globe size={20} style={{ color: "var(--muted-foreground)" }} className="mb-4" />
            <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: "var(--foreground)" }}>
              Web Development
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
              <strong style={{ color: "var(--foreground)" }}>Transform concepts</strong> into high-performance experiences.
            </p>
            <button
              className="flex items-center gap-2 text-sm font-medium group"
              style={{ color: "var(--foreground)" }}
            >
              See More
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <CodeSnip>{`bg: var(--surface-elevated)
border: 1px solid var(--border)
hover: translateY(-3px)`}</CodeSnip>
        </ShowcaseBlock>

        {/* Icons */}
        <ShowcaseBlock title="Icon System (Lucide)">
          <div className="flex items-center gap-6">
            {[Globe, Palette, Layers, Zap].map((Icon, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
                >
                  <Icon size={18} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.5} />
                </div>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {Icon.displayName || "Icon"}
                </span>
              </div>
            ))}
          </div>
          <CodeSnip>{`Lucide React — 18–24px, strokeWidth: 1.5
color: var(--muted-foreground) default
Never filled, never emoji`}</CodeSnip>
        </ShowcaseBlock>
      </div>
    </section>
  )
}

function ShowcaseBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function CodeSnip({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="text-xs font-mono p-3 rounded-lg leading-relaxed overflow-x-auto"
      style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
    >
      {children}
    </pre>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
      {children}
    </p>
  )
}

import { Globe, Palette, Code2, Layers } from "lucide-react"

export default function BentoSection() {
  return (
    <section
      className="px-6 py-24 max-w-6xl mx-auto"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionLabel>04 — Layout</SectionLabel>
      <h2
        className="font-serif font-bold mb-4 text-balance"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--foreground)" }}
      >
        Bento Grid Pattern
      </h2>
      <p className="mb-16 max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        Cards float in a dark void with asymmetric sizing. Vary <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: "var(--surface)", color: "var(--accent)" }}>col-span</code> and{" "}
        <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: "var(--surface)", color: "var(--accent)" }}>row-span</code> — never use uniform grids.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Wide card col-span-2 */}
        <BentoCard className="md:col-span-2" glow>
          <div className="flex flex-col justify-between h-full gap-6">
            <div>
              <Globe size={22} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} className="mb-5" />
              <h3 className="font-serif font-semibold text-xl mb-2" style={{ color: "var(--foreground)" }}>
                Web Development
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)", maxWidth: "44ch" }}>
                <strong style={{ color: "var(--foreground)" }}>Transform concepts</strong> into high-performance
                experiences. Engineering <strong style={{ color: "var(--foreground)" }}>story-driven</strong> websites
                and premium digital products.
              </p>
            </div>
            <ArrowLink>See More</ArrowLink>
          </div>
        </BentoCard>

        {/* Tall card */}
        <BentoCard>
          <Palette size={22} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} className="mb-5" />
          <h3 className="font-serif font-semibold text-xl mb-2" style={{ color: "var(--foreground)" }}>
            Branding
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
            We build strategic identities designed to secure a premium market position.
          </p>
          <ArrowLink>See More</ArrowLink>
        </BentoCard>

        {/* Code card */}
        <BentoCard>
          <Code2 size={22} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} className="mb-5" />
          <h3 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--foreground)" }}>
            Engineering
          </h3>
          <pre
            className="text-xs font-mono leading-relaxed rounded-lg p-3 overflow-hidden"
            style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
          >
            <span style={{ color: "#F7D063" }}>const</span>
            {" agent = "}
            <span style={{ color: "#F2DE9B" }}>new</span>
            {" AI({"}
            {"\n  model: "}
            <span style={{ color: "#F7D063" }}>"gold-v1"</span>
            {",\n  context: "}
            <span style={{ color: "#F7D063" }}>"design"</span>
            {"\n});"}
          </pre>
        </BentoCard>

        {/* Featured center card */}
        <BentoCard featured>
          <div className="flex flex-col items-center justify-center text-center h-full py-4">
            <h3
              className="font-serif font-bold text-balance leading-tight"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                color: "var(--foreground)",
                lineHeight: 1.1,
              }}
            >
              Everything
              <br />
              in One System
            </h3>
          </div>
        </BentoCard>

        {/* Stat card */}
        <BentoCard>
          <Layers size={22} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} className="mb-5" />
          <p
            className="font-serif font-bold mb-1"
            style={{ fontSize: "3rem", lineHeight: 1, color: "var(--accent)" }}
          >
            5
          </p>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Source Colors
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Vanilla Custard, Royal Gold, two Carbon Blacks, White Smoke
          </p>
        </BentoCard>

      </div>
    </section>
  )
}

function BentoCard({
  children,
  className = "",
  glow = false,
  featured = false,
}: {
  children: React.ReactNode
  className?: string
  glow?: boolean
  featured?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-7 transition-all duration-250 hover:-translate-y-0.5 ${className}`}
      style={{
        background: featured
          ? `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247,208,99,0.12) 0%, var(--surface) 70%)`
          : glow
          ? `radial-gradient(ellipse 70% 50% at 20% 10%, rgba(247,208,99,0.08) 0%, var(--surface) 65%)`
          : "var(--surface)",
        border: `1px solid ${featured ? "var(--border)" : "var(--border-subtle)"}`,
        minHeight: "220px",
      }}
    >
      {children}
    </div>
  )
}

function ArrowLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-2 text-sm font-medium group w-fit"
      style={{ color: "var(--foreground)" }}
    >
      {children}
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        className="transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      >
        <path
          d="M1 6.5h10M7 2.5l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
      {children}
    </p>
  )
}

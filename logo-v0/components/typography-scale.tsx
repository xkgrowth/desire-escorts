export default function TypographyScale() {
  return (
    <section
      className="px-6 py-24 max-w-6xl mx-auto"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <SectionLabel>02 — Typography</SectionLabel>
      <h2
        className="font-serif font-bold mb-4 text-balance"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--foreground)" }}
      >
        Type Scale
      </h2>
      <p className="mb-16 max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        Two typefaces: <strong style={{ color: "var(--foreground)" }}>Sora</strong> for display headings,{" "}
        <strong style={{ color: "var(--foreground)" }}>Inter</strong> for all body and UI copy.
        Never more than two families.
      </p>

      <div className="space-y-10">
        {/* Hero */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <TypeLabel font="Sora" weight="700" size="clamp(2.5rem, 6vw, 5rem)" role="Hero Heading" />
          <p
            className="font-serif font-bold text-balance mt-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.08,
              color: "var(--foreground)",
            }}
          >
            The full spectrum of core capabilities
          </p>
        </div>

        {/* Section heading */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <TypeLabel font="Sora" weight="600" size="2rem" role="Section Heading" />
          <p
            className="font-serif font-semibold mt-4"
            style={{ fontSize: "2rem", lineHeight: 1.2, color: "var(--foreground)" }}
          >
            Web Development
          </p>
        </div>

        {/* Card heading */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <TypeLabel font="Inter" weight="500" size="1rem" role="Body / Card Copy" />
          <p
            className="font-sans mt-4"
            style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--muted-foreground)", maxWidth: "48ch" }}
          >
            <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>Transform concepts</strong> into high-performance
            experiences. Engineering <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>story-driven</strong> websites
            and premium digital products.
          </p>
        </div>

        {/* Caption */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <TypeLabel font="Inter" weight="400" size="0.75rem" role="Label / Caption" />
          <p
            className="font-sans mt-4 tracking-widest uppercase"
            style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600 }}
          >
            01 — Color Tokens
          </p>
        </div>
      </div>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold tracking-widest uppercase mb-3"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </p>
  )
}

function TypeLabel({
  font,
  weight,
  size,
  role,
}: {
  font: string
  weight: string
  size: string
  role: string
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span
        className="text-xs font-mono px-2 py-1 rounded"
        style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}
      >
        {font}
      </span>
      <span
        className="text-xs font-mono px-2 py-1 rounded"
        style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
      >
        {weight}
      </span>
      <span
        className="text-xs font-mono px-2 py-1 rounded"
        style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)" }}
      >
        {size}
      </span>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {role}
      </span>
    </div>
  )
}

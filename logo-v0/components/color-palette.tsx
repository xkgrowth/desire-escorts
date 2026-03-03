type Swatch = {
  name: string
  hex: string
  label: string
  dark: boolean
}

const swatches: Swatch[] = [
  { name: "Carbon Black", hex: "#1A1B17", label: "--background", dark: true },
  { name: "Carbon Surface", hex: "#202216", label: "--surface", dark: true },
  { name: "Surface Elevated", hex: "#272820", label: "--surface-elevated", dark: true },
  { name: "Royal Gold", hex: "#F7D063", label: "--accent", dark: false },
  { name: "Vanilla Custard", hex: "#F2DE9B", label: "--accent-muted", dark: false },
  { name: "White Smoke", hex: "#F5F4F3", label: "--foreground", dark: false },
  { name: "Muted Text", hex: "#8A8A7A", label: "--muted-foreground", dark: true },
  { name: "Border", hex: "rgba(247,208,99,0.10)", label: "--border", dark: true },
]

export default function ColorPalette() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <SectionLabel>01 — Color Tokens</SectionLabel>
      <h2
        className="font-serif font-bold mb-4 text-balance"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--foreground)" }}
      >
        The Palette
      </h2>
      <p className="mb-12 max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        Exactly five source colors — two golds, two blacks, one off-white. Used strictly via tokens, never raw hex values in code.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {swatches.map((s) => (
          <div
            key={s.hex + s.name}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <div
              className="h-28"
              style={{ backgroundColor: s.hex }}
            />
            <div
              className="p-4"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                {s.name}
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--muted-foreground)" }}
              >
                {s.hex}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--accent)", opacity: 0.8 }}
              >
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Glow callout */}
      <div
        className="mt-8 rounded-2xl p-6 flex items-start gap-4"
        style={{
          background: "rgba(247, 208, 99, 0.06)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 mt-0.5"
          style={{
            background: "radial-gradient(circle, rgba(247,208,99,0.35) 0%, rgba(247,208,99,0) 100%)",
          }}
        />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Radial glow usage
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            Apply <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>rgba(247,208,99,0.10)</code> as a{" "}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>radial-gradient</code> behind
            hero sections and feature cards only. Never as a decorative shape.
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

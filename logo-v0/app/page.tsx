import { ShinyHeart, StaticHeart } from "@/components/shiny-heart"
import { DesireLogoStatic, DesireLogoAnimated } from "@/components/desire-logo"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-[0.22em] uppercase font-medium"
      style={{ color: "var(--muted-foreground)", opacity: 0.55 }}
    >
      {children}
    </p>
  )
}

function Divider() {
  return (
    <div
      className="w-full"
      style={{ height: 1, backgroundColor: "var(--border)" }}
      aria-hidden
    />
  )
}

export default function Page() {
  return (
    <main
      className="min-h-screen flex flex-col items-center gap-20 font-sans py-24 px-8"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >

      {/* ── Favicon preview ──────────────────────────────────── */}
      <section className="flex flex-col items-center gap-10 w-full max-w-3xl">
        <SectionLabel>Favicon — static heart on deep black</SectionLabel>
        <div className="flex items-end gap-10">
          {[16, 32, 64, 128].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: s,
                  height: s,
                  borderRadius: s * 0.22,
                  backgroundColor: "#1A1B17",
                }}
              >
                <StaticHeart size={Math.round(s * 0.66)} />
              </div>
              <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>
                {s}px
              </span>
            </div>
          ))}
        </div>
      </section>

      <Divider />
      <section className="flex flex-col items-center gap-10 w-full max-w-2xl">
        <SectionLabel>Icon — Static vs Animated</SectionLabel>
        <div className="flex items-end gap-24">
          <div className="flex flex-col items-center gap-5">
            <StaticHeart size={140} />
            <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>static</span>
          </div>
          <div
            className="self-stretch"
            style={{ width: 1, backgroundColor: "var(--border)" }}
            aria-hidden
          />
          <div className="flex flex-col items-center gap-5">
            <ShinyHeart size={140} />
            <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>animated</span>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Logo — Static ───────────────────────────────────── */}
      <section className="flex flex-col items-center gap-10 w-full max-w-3xl">
        <SectionLabel>Logo — Static</SectionLabel>
        <div className="flex flex-col items-center gap-8">
          {(["xl", "lg", "md", "sm"] as const).map((s) => (
            <DesireLogoStatic key={s} size={s} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Logo — Animated ─────────────────────────────────── */}
      <section className="flex flex-col items-center gap-10 w-full max-w-3xl">
        <SectionLabel>Logo — Animated</SectionLabel>
        <div className="flex flex-col items-center gap-8">
          {(["xl", "lg", "md", "sm"] as const).map((s) => (
            <DesireLogoAnimated key={s} size={s} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Context tiles ────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-10 w-full max-w-3xl">
        <SectionLabel>Logo on backgrounds</SectionLabel>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { bg: "var(--surface)", border: "var(--border)", label: "surface" },
            { bg: "var(--accent)", border: "transparent", label: "accent" },
            { bg: "#0D0F0A", border: "rgba(255,255,255,0.05)", label: "deep black" },
          ].map(({ bg, border, label }) => (
            <div
              key={label}
              className="rounded-2xl flex flex-col items-center justify-center gap-5 px-10 py-8"
              style={{ backgroundColor: bg, border: `1px solid ${border}`, minWidth: 280 }}
            >
              <DesireLogoAnimated size="md" />
              <span
                className="text-xs font-mono"
                style={{ color: bg === "var(--accent)" ? "var(--accent-foreground)" : "var(--muted-foreground)", opacity: 0.55 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}

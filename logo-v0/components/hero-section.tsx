import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center pt-48 pb-32 px-6 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(247, 208, 99, 0.10) 0%, transparent 65%), var(--background)`,
      }}
    >
      {/* Label chip */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8"
        style={{
          background: "rgba(247, 208, 99, 0.10)",
          border: "1px solid var(--border)",
          color: "var(--accent)",
        }}
      >
        Visual Design Direction Brief
      </div>

      <h1
        className="font-serif font-bold text-balance leading-tight mb-6"
        style={{
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          color: "var(--foreground)",
          lineHeight: 1.08,
        }}
      >
        Carbon Black
        <br />
        <span style={{ color: "var(--accent)" }}>& Royal Gold</span>
      </h1>

      <p
        className="max-w-xl text-base leading-relaxed mb-10"
        style={{ color: "var(--muted-foreground)" }}
      >
        A premium, dark-first design system inspired by RefractWeb. Every token,
        typeface, and component pattern — ready for Cursor.
      </p>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Explore the system
        </button>
        <button
          className="flex items-center gap-2 text-sm font-medium group transition-all"
          style={{ color: "var(--foreground)" }}
        >
          View tokens
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Decorative divider */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{
          background: "linear-gradient(to bottom, var(--border), transparent)",
        }}
      />
    </section>
  )
}

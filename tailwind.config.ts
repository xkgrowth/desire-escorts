import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          vanillaCustard: "var(--color-vanilla-custard)",
          royalGold: "var(--color-royal-gold)",
          darkOlive: "var(--color-dark-olive)",
          carbonBlack: "var(--color-carbon-black)",
          whiteSmoke: "var(--color-white-smoke)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        ring: "var(--ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        luxury: "var(--radius-luxury)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        fast: "150ms",
        default: "200ms",
        slow: "300ms",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        elevated: "0 8px 32px rgba(0, 0, 0, 0.5)",
        glow: "0 0 20px rgba(247, 208, 99, 0.3)",
        "glow-lg": "0 0 40px rgba(247, 208, 99, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;

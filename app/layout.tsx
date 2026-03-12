import type { Metadata } from "next";
import { Sora, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/layout/site-header";
import { ConditionalSiteFooter } from "./components/layout/conditional-site-footer";
import { GlowOrbs } from "@/components/glow-orbs";
import { CookieConsent } from "./components/cookies";
import { GleapWidget } from "./components/gleap-widget";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desire-escorts.nl"),
  title: "Desire Escorts",
  description: "Desire Escorts application",
  icons: {
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    images: [
      {
        url: "/brand/preview-image-desirev2.png?v=2",
        width: 1200,
        height: 630,
        alt: "Desire Escorts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/preview-image-desirev2.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${sora.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <GleapWidget />
        <CookieConsent>
          <div className="relative min-h-screen">
            <GlowOrbs middleCount={4} />
            <div className="relative" style={{ zIndex: 1 }}>
              <SiteHeader />
              {children}
              <ConditionalSiteFooter />
            </div>
          </div>
        </CookieConsent>
      </body>
    </html>
  );
}

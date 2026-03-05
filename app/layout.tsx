import type { Metadata } from "next";
import { Sora, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/layout/site-header";
import { ConditionalSiteFooter } from "./components/layout/conditional-site-footer";

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
        url: "/brand/preview-image.jpg",
        width: 1200,
        height: 630,
        alt: "Desire Escorts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/preview-image.jpg"],
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
        <SiteHeader />
        {children}
        <ConditionalSiteFooter />
      </body>
    </html>
  );
}

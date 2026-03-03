import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

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
    <html lang="nl" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

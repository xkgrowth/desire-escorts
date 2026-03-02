import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

export const metadata: Metadata = {
  title: "Desire Escorts",
  description: "Desire Escorts application",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/brand/favicon.png" }],
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
    <html lang="nl">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

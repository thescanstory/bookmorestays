import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ClientShell from "@/components/ClientShell";
import OfflineIndicator from "@/components/OfflineIndicator";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bookmorestays.com'),
  title: "Bookmore Stays — Extraordinary Villas, Coffee Estates & Experiential Getaways",
  description: "Curated luxury villas, heritage coffee estates, mountain retreats, and iconic experiences with 100% BMS StayCover guarantee and 24/7 concierge support.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Bookmore Stays — Extraordinary Villas, Coffee Estates & Experiential Getaways",
    description: "Curated weekend escapes departing from Bangalore, Mumbai, Delhi, Hyderabad & Chennai. Coorg Estates, Bali Villas, Kashmir Stays & The Traitors Escape.",
    url: "https://bookmorestays.com",
    siteName: "Bookmore Stays",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmore Stays — Extraordinary Villas, Coffee Estates & Experiential Getaways",
    description: "Extraordinary luxury villas, coffee estates & unique theme escapes.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#222222]`}
      >
        <AuthProvider>
          <ClientShell>
            {children}
          </ClientShell>
          <OfflineIndicator />
        </AuthProvider>
      </body>
    </html>
  );
}

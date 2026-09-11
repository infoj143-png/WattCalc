import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wattaro.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Netzteil Rechner – PC Netzteil Watt berechnen | Wattaro",
    template: "%s | Wattaro",
  },
  description: "Netzteil Rechner für PC: Berechne schnell den Watt-Bedarf deines PCs aus CPU, GPU & Komponenten. Inkl. 25 % Reserve-Planung für die Netzteil-Wahl.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

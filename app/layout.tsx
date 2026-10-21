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

export const metadata: Metadata = {
  title: "Oldies Gallery",
  description:
    "Browse curated pre-loved and secondhand fashion finds in the Philippines with trusted quality, fair pricing, and stylish everyday pieces.",
  keywords: [
    "ukay salakay",
    "secondhand clothes Philippines",
    "thrifted fashion",
    "pre-loved clothes",
    "ukay ukay",
    "streetwear Philippines",
  ],
  openGraph: {
    title: "Ukay Salakay | Thrifted Fashion & Preloved Finds in the Philippines",
    description:
      "Explore premium secondhand fashion, sneakers, jackets, and casual essentials in the Philippines.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

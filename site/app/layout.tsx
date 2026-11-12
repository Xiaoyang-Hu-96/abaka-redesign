import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { colorInk } from "@/lib/tokens";

// Self-hosted at build time, latin subset only. No layout shift, no third-party request.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono", display: "swap" });
// the header wordmark only
const outfit = Outfit({ subsets: ["latin"], weight: ["500"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Abaka AI · Human Intelligence Data for Frontier AI",
  description:
    "Off-the-shelf datasets, data collection, annotation, model evaluation and RL environments, made and checked by domain experts.",
};

export const viewport: Viewport = {
  themeColor: colorInk,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${outfit.variable} scroll-pt-16 lg:scroll-pt-24`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

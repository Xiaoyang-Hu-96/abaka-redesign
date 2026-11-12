import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted at build time, latin subset only. No layout shift, no third-party request.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abaka AI · Human Intelligence Data for Frontier AI",
  description:
    "Off-the-shelf datasets, data collection, annotation, model evaluation and RL environments, made and checked by domain experts.",
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
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

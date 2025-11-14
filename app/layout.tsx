// app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

// components
import FireParticles from "@/components/fire-particles";
import BackgroundClouds from "@/components/BackgroundClouds";
import ThunderBehindClouds from "@/components/ThunderBehindClouds";
import ThunderToggle from "@/components/ui/ThunderToggle";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Indus Realms", template: "%s | Indus Realms" },
  description:
    "Grind. Conquer. Create. A premium Minecraft network with SMP, Bedwars, Lifesteal, Skyblock and Minigames.",
  keywords: [
    "Indus Realms",
    "minecraft server",
    "smp",
    "bedwars",
    "lifesteal",
    "skyblock",
    "minigames",
    "next.js",
    "tailwind css",
  ],
  authors: [{ name: "Indus Realms" }],
  creator: "Indus Realms",
  publisher: "Indus Realms",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Indus Realms",
    title: "Indus Realms",
    description:
      "Grind. Conquer. Create. A premium Minecraft network with SMP, Bedwars, Lifesteal, Skyblock and Minigames.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Indus Realms" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indus Realms",
    description:
      "Grind. Conquer. Create. A premium Minecraft network with SMP, Bedwars, Lifesteal, Skyblock and Minigames.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffae2d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-brand-hero text-foreground min-h-screen overflow-x-hidden`}>
        {/* === BACKGROUND LAYER (lowest) === */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ThunderBehindClouds />
          <BackgroundClouds
            src="/videos/clouds.mp4"
            opacity={0.25}
            hueRotateDeg={12}
            brightness={0.8}
            contrast={1.05}
            earlyMs={320}
            crossfadeMs={420}
            zIndexClass="z-0"
          />
        </div>

        {/* === FOREGROUND UI (always above backgrounds) === */}
        <div className="relative z-[10]">
          {/* particles should sit above content but inside this UI layer */}
          <FireParticles count={60} linkDistance={180} maxSpeed={0.6} />

          <Navigation />
          <main>{children}</main>
          <Footer />
        </div>

        {/* === Controls (highest clickable layer) === */}
        <ThunderToggle />
      </body>
    </html>
  );
}

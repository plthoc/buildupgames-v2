import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Geist isn't bundled in next/font for this Next version; use Inter for display too.
// Both fonts are visually similar in proportions and weight.
const geist = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const mono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://buildupgames.cc";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BuildUp Games — Building games worth playing",
    template: "%s | BuildUp Games",
  },
  description:
    "BuildUp develops, scales, and acquires Roblox experiences with a focus on games that keep players coming back. Creative direction, live operations, and publishing support.",
  keywords: [
    "BuildUp Games",
    "Roblox publisher",
    "Roblox game studio",
    "game development",
    "Roblox acquisitions",
    "Tapping Frenzy",
  ],
  authors: [{ name: "BuildUp Games" }],
  creator: "BuildUp Games",
  publisher: "BuildUp Games",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "BuildUp Games",
    title: "BuildUp Games — Building games worth playing",
    description:
      "We develop, scale, and acquire Roblox experiences that keep players coming back.",
    images: [{ url: "/og.png", width: 1200, height: 675, alt: "BuildUp Games — Building games worth playing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildUp Games — Building games worth playing",
    description:
      "We develop, scale, and acquire Roblox experiences that keep players coming back.",
    images: ["/og.png"],
    creator: "@buildupgames",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f5f5" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <SmoothScroll>
          {children}
          {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        </SmoothScroll>
      </body>
    </html>
  );
}

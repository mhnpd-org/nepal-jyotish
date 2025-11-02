import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_Devanagari, Mukta } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary Nepali readable sans for paragraphs & UI
const mukta = Mukta({
  variable: "--font-nepali-ui",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap'
});

// Serif Devanagari for headings / emphasis
const notoSerifDev = Noto_Serif_Devanagari({
  variable: "--font-nepali-serif",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: "Nepal Jyotish - नेपाल ज्योतिष | Traditional Nepali Astrology",
    template: "%s | Nepal Jyotish",
  },
  description: "Nepal Jyotish (नेपाल ज्योतिष) - परम्परागत नेपाली ज्योतिष प्रणाली। Free online Nepali astrology tools for birth charts (जन्म पत्रिका), planetary positions (ग्रह स्थिति), and dasha calculations (दशा गणना). Accurate Vedic astrology in Nepali.",
  applicationName: "Nepal Jyotish",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "Nepal Jyotish",
    "नेपाल ज्योतिष",
    "Nepali Astrology",
    "नेपाली ज्योतिष",
    "जन्म पत्रिका",
    "Birth Chart",
    "Kundali",
    "कुण्डली",
    "Vedic Astrology",
    "वैदिक ज्योतिष",
    "Dasha",
    "दशा",
    "Vimshottari",
    "विंशोत्तरी",
    "Planetary Position",
    "ग्रह स्थिति",
    "Nakshatra",
    "नक्षत्र",
    "Nepali Horoscope"
  ],
  authors: [{ name: "Nepal Jyotish", url: "https://nepaljyotish.org" }],
  creator: "Nepal Jyotish",
  publisher: "Nepal Jyotish",
  metadataBase: new URL("https://nepaljyotish.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nepal Jyotish - नेपाल ज्योतिष | Traditional Nepali Astrology",
    description: "परम्परागत नेपाली ज्योतिष प्रणाली। Free online Nepali astrology tools for birth charts, planetary positions, and dasha calculations.",
    url: "https://nepaljyotish.org",
    siteName: "Nepal Jyotish",
    locale: "ne_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Jyotish - नेपाल ज्योतिष",
    description: "Traditional Nepali Astrology - Birth Charts, Planetary Positions & Dasha Calculations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#b71c1c"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${mukta.variable} ${notoSerifDev.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

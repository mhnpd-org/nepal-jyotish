import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Serif_Devanagari,
  Mukta
} from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

// Primary Nepali readable sans for paragraphs & UI
const mukta = Mukta({
  variable: "--font-nepali-ui",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

// Serif Devanagari for headings / emphasis
const notoSerifDev = Noto_Serif_Devanagari({
  variable: "--font-nepali-serif",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default:
      "नेपाली ज्योतिष | Nepal Jyotish - Traditional Nepali kundali Maker & Kundali | Vedic Astrology",
    template: "%s | Nepal Jyotish - नेपाली ज्योतिष"
  },
  description:
    "Nepal Jyotish (नेपाल ज्योतिष) - परम्परागत नेपाली चाइना मेकर र कुण्डली निर्माण। Free online Nepali astrology tools based on Vedic Jyotish and Surya Siddhanta. Create traditional birth charts (जन्म पत्रिका), view planetary positions (ग्रह स्थिति), calculate Vimshottari, Yogini, Tribhagi Dasha. Hamro Jyotish, Mero Jyotish - सबैको लागि निःशुल्क ज्योतिष सेवा।",
  applicationName: "Nepal Jyotish - नेपाली चाइना मेकर",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "48x48" }
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/favicon/favicon.ico"]
  },
  manifest: "/favicon/site.webmanifest",
  keywords: [
    // Primary Keywords (English)
    "Nepali Jyotish",
    "Nepal Jyotish",
    "Kundali",
    "Traditional",
    "Nepali Kundali Maker",
    "Vedic Jyotish",
    "Surya Siddhanta",
    "Suraya Siddanta",
    "Hamro Jyotish",
    "Mero Jyotish",

    // Primary Keywords (Nepali)
    "नेपाली ज्योतिष",
    "नेपाल ज्योतिष",
    "चाइना",
    "परम्परागत",
    "कुण्डली",
    "नेपाली चाइना मेकर",
    "वैदिक ज्योतिष",
    "सूर्य सिद्धान्त",
    "हाम्रो ज्योतिष",
    "मेरो ज्योतिष",

    // Secondary Keywords (English)
    "Nepali Astrology",
    "Birth Chart",
    "Janma Patrika",
    "Horoscope",
    "Vedic Astrology",
    "Hindu Astrology",
    "Jyotish Shastra",
    "Traditional Astrology",
    "Nepali Horoscope",
    "Free Kundali",
    "Online Kundali Maker",
    "Kundali Chart",
    "Traditional kundali",

    // Secondary Keywords (Nepali)
    "जन्म पत्रिका",
    "जन्मकुण्डली",
    "राशिफल",
    "ज्योतिष शास्त्र",
    "परम्परागत ज्योतिष",

    // Dasha Systems
    "Vimshottari Dasha",
    "Yogini Dasha",
    "Tribhagi Dasha",
    "Dasha System",
    "Mahadasha",
    "Antardasha",
    "विंशोत्तरी दशा",
    "योगिनी दशा",
    "त्रिभागी दशा",
    "महादशा",
    "अन्तर्दशा",

    // Planetary & Chart Keywords
    "Planetary Position",
    "Graha Position",
    "Rashi Chart",
    "Navamsa",
    "Divisional Charts",
    "Varga Charts",
    "ग्रह स्थिति",
    "राशि चक्र",
    "नवांश",
    "वर्ग चार्ट",

    // Nakshatra Keywords
    "Nakshatra",
    "Birth Star",
    "Lunar Mansion",
    "नक्षत्र",
    "जन्म नक्षत्र",

    // Yoga & Dosha
    "Raj Yoga",
    "Yoga Analysis",
    "Dosha Analysis",
    "Mangal Dosha",
    "राज योग",
    "योग विश्लेषण",
    "दोष विश्लेषण",

    // Location-based
    "Nepal Kundali",
    "Kathmandu Jyotish",
    "Nepali Panchang",
    "नेपाल कुण्डली",
    "काठमाडौं ज्योतिष",
    "नेपाली पञ्चाङ्ग"
  ],
  authors: [{ name: "Nepal Jyotish Team", url: "https://nepaljyotish.org" }],
  creator: "Nepal Jyotish - Traditional Nepali Astrology Platform",
  publisher: "Nepal Jyotish",
  category: "Astrology, Vedic Sciences, Traditional Knowledge",
  metadataBase: new URL("https://nepaljyotish.org"),
  alternates: {
    canonical: "/",
    languages: {
      "ne-NP": "https://nepaljyotish.org",
      en: "https://nepaljyotish.org"
    }
  },
  openGraph: {
    title:
      "नेपाली ज्योतिष | Nepal Jyotish - Traditional kundali Maker & Kundali",
    description:
      "परम्परागत नेपाली चाइना मेकर र कुण्डली निर्माण। Free Vedic astrology tools based on Surya Siddhanta. Create birth charts, view planetary positions, calculate Dasha. Hamro Jyotish, Mero Jyotish.",
    url: "https://nepaljyotish.org",
    siteName: "Nepal Jyotish - नेपाली ज्योतिष",
    locale: "ne_NP",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Nepal Jyotish - Traditional Nepali kundali Maker and Kundali"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title:
      "नेपाली ज्योतिष | Nepal Jyotish - Traditional kundali & Kundali Maker",
    description:
      "Free Traditional Nepali kundali Maker & Kundali based on Vedic Jyotish and Surya Siddhanta. Hamro Jyotish, Mero Jyotish.",
    images: ["/logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    // Add these when you have them:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#b71c1c"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" dir="ltr">
      <head>
        {/* Google Analytics - Global site tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D7CMNJ76VX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());

            gtag('config', 'G-D7CMNJ76VX');`}
        </Script>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nepal Jyotish",
              alternateName: [
                "नेपाल ज्योतिष",
                "Nepali Jyotish",
                "Hamro Jyotish",
                "Mero Jyotish"
              ],
              url: "https://nepaljyotish.org",
              description:
                "Traditional Nepali kundali Maker and Kundali based on Vedic Jyotish and Surya Siddhanta",
              inLanguage: ["ne", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://nepaljyotish.org/blogs?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nepal Jyotish",
              url: "https://nepaljyotish.org",
              logo: "https://nepaljyotish.org/favicon/web-app-manifest-192x192.png",
              description:
                "Traditional Nepali Astrology Platform - kundali Maker, Kundali Generator based on Vedic Jyotish and Surya Siddhanta",
              sameAs: [
                // Add your social media URLs when available
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["Nepali", "English"]
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Nepal Jyotish - Nepali kundali Maker",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "NPR"
              },
              description:
                "Free Traditional Nepali kundali Maker and Kundali Generator based on Vedic Jyotish and Surya Siddhanta",
              featureList: [
                "Traditional Nepali kundali (Birth Chart)",
                "Kundali Generation",
                "Planetary Position Calculation",
                "Vimshottari Dasha",
                "Yogini Dasha",
                "Tribhagi Dasha",
                "Varga Charts (D1-D60)",
                "Nakshatra Analysis"
              ]
            })
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${mukta.variable} ${notoSerifDev.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

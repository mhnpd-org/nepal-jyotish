import React from 'react';
import type { Metadata } from 'next';
import AstroSidebar from '@internal/components/astro-sidebar';
import Logo from '@internal/layouts/logo';
import { SITE_CONFIG, PAGE_METADATA, getBreadcrumbSchema } from '@internal/lib/seo-config';

export const metadata: Metadata = {
  title: "Nepali Jyotish Tools - Traditional kundali & Kundali Maker",
  description: "Access all traditional Nepali Jyotish tools - kundali Maker (जन्म पत्रिका), Varga Charts, Planetary Positions, Vimshottari, Yogini, Tribhagi Dasha calculations based on Vedic Jyotish and Surya Siddhanta.",
  keywords: PAGE_METADATA.home.keywords,
  openGraph: {
    title: "Nepali Jyotish Tools - Traditional kundali & Kundali Maker",
    description: "Traditional Nepali Jyotish tools based on Vedic Jyotish and Surya Siddhanta",
    url: `${SITE_CONFIG.url}/astro`,
  },
  alternates: {
    canonical: "/astro",
  },
};

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", url: SITE_CONFIG.url },
              { name: "Jyotish Tools", url: `${SITE_CONFIG.url}/astro` }
            ])
          )
        }}
      />
      <div className="min-h-screen flex flex-col bg-vedanga-gradient w-full overflow-x-hidden">
        <header className="h-16 flex items-center gap-4 px-4 sm:px-5 md:px-8 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent w-full">
          <Logo size="md" variant="light" href="/" />
        </header>
        <div className="flex flex-1 relative w-full min-w-0">
          <AstroSidebar />
          <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-7 bg-[rgba(255,255,250,0.82)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,250,0.72)] shadow-inner">
            <div className="mx-auto max-w-6xl w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import AstroSidebar from '@internal/components/astro-sidebar';
import Logo from '@internal/layouts/logo';
import { SITE_CONFIG, getBreadcrumbSchema } from '@internal/lib/seo-config';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 w-full overflow-x-hidden">
        <header className="h-16 flex items-center justify-between gap-4 px-4 sm:px-5 md:px-8 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-b border-amber-700/30 shadow-md w-full">
          <Logo size="md" variant="light" href="/" />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>
        <div className="flex flex-1 relative w-full min-w-0">
          <AstroSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
          <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-7 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="mx-auto max-w-6xl w-full min-w-0 text-gray-900">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

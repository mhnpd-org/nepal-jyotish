'use client';

import React, { useState } from 'react';
import AstroSidebar from '@internal/components/astro-sidebar';
import AppHeader from '@internal/layouts/app-header';
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
        <AppHeader 
          variant="solid"
          language="np"
          showMobileMenu={true}
          backgroundGradient="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-b border-amber-700/30 shadow-md"
          fullWidth={true}
        />
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

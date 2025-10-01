import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { I18nProvider } from '@internal/lib/i18n';
import LanguageSelector from '@internal/components/language-selector';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
  {/* Use shared global gradient token for consistency */}
  <div className="min-h-screen flex flex-col bg-vedanga-gradient">
        <header className="h-16 flex items-center px-6 bg-transparent">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Vedanga Logo" width={36} height={36} className="rounded-sm" />
            <h1 className="text-white text-lg font-semibold">Vedanga Jyotish</h1>
          </div>
          <LanguageSelector />
        </header>

      <div className="flex flex-1">
        {/* Responsive sidebar: icon-only on small screens, full on md+ */}
        <aside className="w-16 md:w-64 bg-white/95 shadow-inner p-2 md:p-4 md:border-r md:border-amber-100">
          <nav className="space-y-1 md:space-y-3 flex flex-col items-center md:items-start">
            <Link href="/astro/janma" title="Janma Details" className="relative group flex items-center gap-3 md:gap-3 px-2 md:px-3 py-2 rounded hover:bg-amber-50 w-full justify-center md:justify-start">
              {/* Person icon (heroicon-like) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-amber-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.5a7.5 7.5 0 0115 0" />
              </svg>
              <span className="hidden md:inline text-amber-800 font-medium">Janma Details</span>

              {/* tooltip for small screens */}
              <span className="md:hidden absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs bg-amber-700 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Janma Details
              </span>
            </Link>

            <div className="w-full hidden md:block h-px bg-amber-50 my-1" />

            <Link href="/astro/traditional" title="Traditional" className="relative group flex items-center gap-3 md:gap-3 px-2 md:px-3 py-2 rounded hover:bg-amber-50 w-full justify-center md:justify-start">
              {/* Academic cap icon (heroicon-like) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-amber-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
              </svg>
              <span className="hidden md:inline text-amber-800 font-medium">Traditional</span>

              {/* tooltip for small screens */}
              <span className="md:hidden absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs bg-amber-700 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Traditional
              </span>
            </Link>

            <div className="w-full hidden md:block h-px bg-amber-50 my-1" />
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-[rgba(255,255,250,0.9)]">
          {children}
        </main>
      </div>
    </div>
    </I18nProvider>
  );
}

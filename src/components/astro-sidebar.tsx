"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@internal/lib/i18n';

// Sidebar menu configuration
const NAV_ITEMS = [
  { href: '/astro/janma', key: 'nav.janma', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.5a7.5 7.5 0 0115 0" />
    </svg>
  )},
  { href: '/astro/traditional', key: 'nav.traditional', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
    </svg>
  )},
  { href: '/astro/planet-position', key: 'nav.planet_positions', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 1.53 4.03 5 9 5s9-3.47 9-5-4.03-5-9-5-9 3.47-9 5z" />
    </svg>
  )},
  { href: '/astro/vimshottari-dasha', key: 'nav.vimshottari', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M12 3v18M18 3v18" />
    </svg>
  )},
  { href: '/astro/tribhagi-dasha', key: 'nav.tribhagi', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
    </svg>
  )},
  { href: '/astro/yogini-dasha', key: 'nav.yogini', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v3M12 17v3M4 12h3M17 12h3M6.8 6.8l2.1 2.1M15.1 15.1l2.1 2.1M17.2 6.8l-2.1 2.1M8.9 15.1l-2.1 2.1" />
    </svg>
  )},
];

export default function AstroSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
  <aside className="group/sidebar relative w-14 md:w-64 shrink-0 bg-white/90 backdrop-blur-sm border-r border-amber-100/60 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
  <nav className="flex flex-col py-4 px-1 md:px-3 gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'group relative flex items-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
                'px-2 md:px-3 py-2 gap-0 md:gap-3 justify-center md:justify-start',
                active
                  ? 'bg-amber-100/90 text-amber-900 shadow-sm ring-1 ring-amber-300/60'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
              ].join(' ')}
            >
              <span className={['shrink-0', active ? 'text-amber-800' : 'text-amber-600 group-hover:text-amber-700'].join(' ')}>
                {item.icon}
              </span>
              <span className="hidden md:inline font-medium tracking-wide text-[0.82rem]">{t(item.key)}</span>
              <span className="md:hidden absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs rounded bg-amber-800 text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {t(item.key)}
              </span>
              {active && (
                <span className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_0_1px_rgba(255,255,255,0.4)]" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 h-8 rounded-full bg-gradient-to-r from-amber-300/10 via-amber-400/20 to-amber-300/10 blur-xl" />
    </aside>
  );
}

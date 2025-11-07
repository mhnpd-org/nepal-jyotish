"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// translations removed — using static English labels

// Sidebar menu configuration
const NAV_ITEMS = [
  { href: '/astro/janma', label: 'Janma Details', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.5a7.5 7.5 0 0115 0" />
    </svg>
  )},
  { href: '/astro/overview', label: 'Overview', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h7v7H3zM14 4h7v7h-7zM14 15h7v7h-7zM3 15h7v7H3z" />
    </svg>
  )},
  { href: '/astro/traditional', label: 'Traditional', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
    </svg>
  )},
  { href: '/astro/charts', label: 'Varga Charts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  )},
  { href: '/astro/planet-position', label: 'Planet Positions', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 1.53 4.03 5 9 5s9-3.47 9-5-4.03-5-9-5-9 3.47-9 5z" />
    </svg>
  )},
  { href: '/astro/vimshottari-dasha', label: 'Vimshottari', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M12 3v18M18 3v18" />
    </svg>
  )},
  { href: '/astro/tribhagi-dasha', label: 'Tribhagi', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
    </svg>
  )},
  { href: '/astro/yogini-dasha', label: 'Yogini', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v3M12 17v3M4 12h3M17 12h3M6.8 6.8l2.1 2.1M15.1 15.1l2.1 2.1M17.2 6.8l-2.1 2.1M8.9 15.1l-2.1 2.1" />
    </svg>
  )},
];

export default function AstroSidebar() {
  const pathname = usePathname();
  return (
  <aside className="group/sidebar relative w-14 md:w-64 shrink-0 bg-white/80 backdrop-blur-sm border-r border-amber-200/60 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/40 to-transparent" />
  <nav className="flex flex-col py-4 px-1 md:px-3 gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'group relative flex items-center rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'px-2 md:px-3 py-2.5 gap-0 md:gap-3 justify-center md:justify-start',
                active
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-amber-50/80'
              ].join(' ')}
            >
              <span className={['shrink-0', active ? 'text-white' : 'text-amber-600 group-hover:text-amber-700'].join(' ')}>
                {item.icon}
              </span>
              <span className="hidden md:inline font-medium tracking-wide text-sm">{item.label}</span>
              <span className="md:hidden absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs rounded-md bg-gray-800 text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
              {active && (
                <span className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-md" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 h-8 rounded-full bg-gradient-to-r from-amber-200/20 via-orange-200/30 to-amber-200/20 blur-xl" />
    </aside>
  );
}

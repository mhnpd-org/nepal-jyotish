"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@internal/layouts/logo';
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

interface AstroSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AstroSidebar({ mobileOpen = false, onMobileClose }: AstroSidebarProps) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={[
        "fixed md:relative inset-y-0 left-0 z-50",
        "w-64 md:w-64 shrink-0",
        "bg-white/95 md:bg-white/80 backdrop-blur-sm",
        "border-r border-amber-200/60 shadow-lg md:shadow-sm",
        "transform transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      ].join(' ')}>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/40 to-transparent" />
        
        {/* Mobile header with logo and close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-amber-200/60">
          <Logo size="sm" variant="dark" />
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-amber-50 hover:text-gray-900 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col py-4 px-3 gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                prefetch={true}
                className={[
                  'group relative flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  'px-3 py-2.5 gap-3 justify-start',
                  'transition-[background-color,box-shadow] duration-100',
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-amber-50'
                ].join(' ')}
              >
                <span className={[
                  'shrink-0',
                  active ? 'text-white' : 'text-amber-600 group-hover:text-amber-700'
                ].join(' ')}>
                  {item.icon}
                </span>
                <span className={[
                  'font-medium tracking-wide text-sm',
                  active ? 'text-white' : ''
                ].join(' ')}>{item.label}</span>
                {active && (
                  <span 
                    className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-md" 
                    aria-hidden 
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 h-8 rounded-full bg-gradient-to-r from-amber-200/20 via-orange-200/30 to-amber-200/20 blur-xl" />
      </aside>
    </>
  );
}

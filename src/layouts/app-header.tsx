'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@internal/layouts/logo';

export interface AppHeaderProps {
  variant?: 'transparent' | 'solid';
  language?: 'np' | 'en';
  currentPage?: 'home' | 'books' | 'blogs' | 'book-detail';
  showMobileMenu?: boolean;
  backgroundGradient?: string;
}

export default function AppHeader({ 
  variant = 'solid',
  language = 'en',
  currentPage = 'home',
  showMobileMenu = true,
  backgroundGradient
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNepali = language === 'np';
  const isTransparent = variant === 'transparent';

  const text = {
    home: isNepali ? 'मुख्य पृष्ठ' : 'Home',
    contact: isNepali ? 'सम्पर्क' : 'Contact',
    books: isNepali ? 'पुस्तकहरू' : 'Books',
    blogs: isNepali ? 'लेखहरू' : 'Blogs',
    openApp: isNepali ? 'एप खोल्नुहोस्' : 'Open App',
  };

  // Determine header styling
  let headerClasses = isTransparent
    ? 'sticky top-0 z-50 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent backdrop-blur-sm'
    : 'sticky top-0 z-50 border-b border-gray-200 bg-white backdrop-blur-sm bg-white/95';
  
  // Override with custom gradient if provided
  if (backgroundGradient) {
    headerClasses = `sticky top-0 z-50 backdrop-blur-sm ${backgroundGradient}`;
  }

  const linkClasses = isTransparent
    ? 'text-sm text-white/90 hover:text-white transition-colors'
    : 'text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors';

  const activeLinkClasses = isTransparent
    ? 'text-sm text-white font-semibold'
    : 'text-xs sm:text-sm text-gray-900 font-semibold';

  const logoVariant = isTransparent ? 'light' : 'dark';
  const logoSize = isTransparent ? 'md' : 'sm';

  const buttonClasses = isTransparent
    ? 'px-2 py-1.5 sm:px-4 sm:py-2 bg-white text-rose-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-white/95 transition-colors shadow-sm'
    : 'px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors';

  // Navigation items - consistent across all pages
  const navItems = [
    { href: '/', label: text.home, current: currentPage === 'home', hidden: false },
    { href: '/books', label: text.books, current: currentPage === 'books' || currentPage === 'book-detail', hidden: false },
    { href: '/blogs', label: text.blogs, current: currentPage === 'blogs', hidden: false },
  ];

  const desktopNavItems = navItems.filter(item => !item.hidden);

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size={logoSize} variant={logoVariant} />

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-3 sm:gap-6" aria-label="Main navigation">
            {desktopNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap transition-colors ${
                  item.current ? activeLinkClasses : linkClasses
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/astro/janma"
              className={`${buttonClasses} whitespace-nowrap`}
            >
              {text.openApp}
            </Link>
          </nav>

          {/* Mobile menu button */}
          {showMobileMenu && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`sm:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                isTransparent
                  ? 'text-white hover:bg-white/20 focus:ring-white/50'
                  : 'text-gray-600 hover:bg-gray-100 focus:ring-rose-500'
              }`}
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
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showMobileMenu && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 sm:hidden ${
              isTransparent ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/50 backdrop-blur-sm'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <aside className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 sm:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Logo size="sm" variant="dark" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      item.current
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Bottom Button */}
              <div className="p-4 border-t border-gray-200">
                <Link
                  href="/astro/janma"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-center"
                >
                  {text.openApp}
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

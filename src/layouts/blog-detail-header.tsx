'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@internal/layouts/logo';
import MobileSidebar from '@internal/components/mobile-sidebar';

interface BlogDetailHeaderProps {
  language: 'np' | 'en';
}

export default function BlogDetailHeader({ language }: BlogDetailHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isNepali = language === 'np';

  const text = {
    home: isNepali ? 'मुख्य पृष्ठ' : 'Home',
    contact: isNepali ? 'सम्पर्क' : 'Contact',
    books: isNepali ? 'पुस्तकहरू' : 'Books',
    blogs: isNepali ? 'लेखहरू' : 'Blogs',
    openApp: isNepali ? 'एप खोल्नुहोस्' : 'Open App',
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="dark" />
            
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-3 sm:gap-6">
              <Link 
                href="/" 
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {text.home}
              </Link>
              <Link 
                href="/books" 
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {text.books}
              </Link>
              <Link 
                href="/blogs" 
                className="text-xs sm:text-sm text-gray-900 font-semibold whitespace-nowrap"
              >
                {text.blogs}
              </Link>
              <Link 
                href="/astro/janma" 
                className="px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap"
              >
                {text.openApp}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
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
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        language={language}
      />
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@internal/layouts/logo';
import MobileSidebar from '@internal/components/mobile-sidebar';

interface BlogHeaderProps {
  language: 'np' | 'en';
  title: string;
  subtitle: string;
  switchLangText: string;
}

export default function BlogHeader({ language, title, subtitle, switchLangText }: BlogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isNepali = language === 'np';
  const otherLang = isNepali ? 'en' : 'np';

  const text = {
    home: isNepali ? 'मुख्य पृष्ठ' : 'Home',
    contact: isNepali ? 'सम्पर्क' : 'Contact',
    articles: isNepali ? 'लेखहरू' : 'Articles',
    openApp: isNepali ? 'एप खोल्नुहोस्' : 'Open App',
  };

  return (
    <>
      <header className="bg-gradient-to-r from-rose-700 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" variant="light" />
            
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-3 sm:gap-6">
              <Link 
                href="/" 
                className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors whitespace-nowrap"
              >
                {text.home}
              </Link>
              <Link 
                href={`/blogs/${language}`}
                className="text-xs sm:text-sm text-white font-semibold transition-colors whitespace-nowrap"
              >
                {text.articles}
              </Link>
              <Link 
                href="/astro/janma" 
                className="px-3 sm:px-4 py-2 bg-white text-rose-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-white/95 transition-colors shadow-sm whitespace-nowrap"
              >
                {text.openApp}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
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
          
          <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/90 mb-3">
              {subtitle}
            </p>
            
            {/* Language Toggle */}
            <Link
              href={`/blogs/${otherLang}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-rose-700 transition-all duration-200 group text-sm w-fit"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{switchLangText}</span>
            </Link>
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

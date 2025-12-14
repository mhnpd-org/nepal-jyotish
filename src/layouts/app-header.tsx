'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@internal/layouts/logo';
import LoginButton from '@internal/components/login-button';

export interface AppHeaderProps {
  variant?: 'transparent' | 'solid';
  language?: 'np' | 'en';
  currentPage?: 'home' | 'books' | 'blogs' | 'book-detail' | 'services' | 'contact' | 'panchang' | 'date-converter' | 'service-request';
  showMobileMenu?: boolean;
  backgroundGradient?: string;
}

const services = [
  { id: 'janma-kundali', title: 'जन्म-कुण्डली निर्माण', href: '/astro/janma', icon: '📜' },
  { id: 'kundali-matching', title: 'कुण्डली मिलान', href: '/kundali-matching', icon: '💑' },
  { id: 'panchang', title: 'आजको पञ्चाङ्ग', href: '/panchang', icon: '🌙' },
  { id: 'date-converter', title: 'मिति परिवर्तक', href: '/date-converter', icon: '📅' },
  { id: 'books', title: 'पुस्तकहरू', href: '/books', icon: '📖' },
  { id: 'blogs', title: 'ज्योतिष लेखहरू', href: '/blogs', icon: '📚' },
  { id: 'online-services', title: 'अनलाईन सेवा', href: '/services', icon: '✨' },
  { id: 'contact', title: 'सम्पर्क गर्नुहोस्', href: '/contact', icon: '✉️' },
];

export default function AppHeader({ 
  variant = 'solid',
  language = 'en',
  currentPage = 'home',
  showMobileMenu = true,
  backgroundGradient
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    ? 'px-2 py-1.5 sm:px-4 sm:py-2 bg-rose-50/10 text-rose-50 text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-50/20 transition-colors shadow-none'
    : 'px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors';

  // Navigation items - consistent across all pages
  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size={logoSize} variant={logoVariant} />

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-2 sm:gap-3 md:gap-4" aria-label="Main navigation">
            {/* Home link removed per design; keep space for other items */}
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1 whitespace-nowrap transition-colors ${linkClasses}`}
                aria-label="हाम्रा सेवाहरू"
                aria-expanded={servicesDropdownOpen}
              >
                <span>{isNepali ? 'हाम्रा सेवाहरू' : 'Our Services'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50 transition-all group"
                      >
                        <span className="text-xl">{service.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-rose-700">
                          {service.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blogs link removed per design */}
            <Link
              href="/kundali-matching"
              className={`whitespace-nowrap transition-colors ${linkClasses}`}
            >
              {isNepali ? 'कुण्डली मिलान' : 'Kundali Matching'}
            </Link>
            
            <button className={buttonClasses + ' whitespace-nowrap'}>
              {isNepali ? 'कुण्डली निर्माण' : 'Create Kundali'}
            </button>

            <div>
              <LoginButton />
            </div>
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
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'home'
                      ? 'bg-amber-50 text-rose-700 font-semibold'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-rose-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span className="font-medium">{text.home}</span>
                </Link>

                {/* Services Section */}
                <div className="pt-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isNepali ? 'हाम्रा सेवाहरू' : 'Our Services'}
                  </p>
                  <div className="space-y-1">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors group"
                      >
                        <span className="text-lg">{service.icon}</span>
                        <span className="text-sm font-medium">{service.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/blogs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'blogs'
                      ? 'bg-amber-50 text-rose-700 font-semibold'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-rose-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="font-medium">{text.blogs}</span>
                </Link>

                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/kundali-matching"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span className="font-semibold">{isNepali ? 'कुण्डली मिलान' : 'Kundali Matching'}</span>
                  </Link>
                  
                  <Link
                    href="/astro/janma"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-sm group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <span className="font-semibold">{isNepali ? 'कुण्डली निर्माण' : 'Create Kundali'}</span>
                  </Link>
                
                  <div className="px-4 py-3">
                    <LoginButton />
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  नेपाल ज्योतिष © 2025
                </p>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

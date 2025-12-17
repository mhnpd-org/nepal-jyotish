'use client';

import React, { useState } from 'react';
import Logo from '@internal/layouts/logo';
import LoginButton from '@internal/layouts/login-button';
import MobileSidebar from '@internal/layouts/mobile-sidebar';

export interface AppHeaderProps {
  variant?: 'transparent' | 'solid';
  language?: 'np' | 'en';
  currentPage?: 'home' | 'books' | 'blogs' | 'book-detail' | 'services' | 'contact' | 'panchang' | 'date-converter' | 'service-request';
  showMobileMenu?: boolean;
  backgroundGradient?: string;
  fullWidth?: boolean;
}

export default function AppHeader({ 
  variant = 'solid',
  language = 'en',
  showMobileMenu = true,
  backgroundGradient,
  fullWidth = false
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNepali = language === 'np';
  const isTransparent = variant === 'transparent';

  // Determine header styling
  let headerClasses = isTransparent
    ? 'sticky top-0 z-50 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent backdrop-blur-sm'
    : 'sticky top-0 z-50 border-b border-gray-200 bg-white backdrop-blur-sm bg-white/95';
  
  // Override with custom gradient if provided
  if (backgroundGradient) {
    headerClasses = `sticky top-0 z-50 backdrop-blur-sm ${backgroundGradient}`;
  }

  // Determine if we should use light text (for dark/colored backgrounds)
  const useLightText = isTransparent || !!backgroundGradient;

  const logoVariant = useLightText ? 'light' : 'dark';
  const logoSize = isTransparent ? 'md' : 'sm';

  return (
    <>
      <header className={headerClasses}>
        <div className={`grid grid-cols-3 items-center py-4 ${
          fullWidth ? 'px-3 sm:px-4' : 'px-4 sm:px-6'
        }`}>
          {/* Left spacer - empty on purpose for centering */}
          <div></div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <Logo size={logoSize} variant={logoVariant} />
          </div>

          {/* Right - Login button and hamburger menu */}
          <div className="flex items-center gap-3 justify-end">
            {/* Login Button - visible on all screen sizes */}
            <div>
              <LoginButton language={isNepali ? 'np' : 'en'} />
            </div>

            {/* Hamburger menu button - visible on all screen sizes */}
            {showMobileMenu && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                  useLightText
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

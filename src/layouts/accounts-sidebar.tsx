"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AppUser } from '@internal/api/types';
import { isAstrologer, isSuperAdmin } from '@internal/api/roleGuards';

interface AccountsSidebarProps {
  profile: AppUser;
  user: import('firebase/auth').User;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AccountsSidebar({ profile, user }: AccountsSidebarProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const isAdmin = isSuperAdmin(profile);
  const isAstro = isAstrologer(profile);

  const handleMobileToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const handleMobileClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const navItems = [
    { href: '/accounts/appointments', label: 'अपोइन्टमेन्टहरू', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ), visible: true },
    { href: '/accounts/profile', label: 'प्रोफाइल', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ), visible: true },
    { href: '/accounts/users', label: 'प्रयोगकर्ताहरू', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ), visible: isAdmin },
    { href: '/accounts/astrologers', label: 'ज्योतिषीहरू', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ), visible: isAdmin },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);
  
  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={handleMobileToggle}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Toggle navigation menu"
      >
        {isMobileSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
      </button>

      {/* Mobile backdrop overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleMobileClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={[
        "fixed md:relative inset-y-0 left-0 z-50",
        "w-64 md:w-64 shrink-0",
        "bg-white/95 md:bg-white/80 backdrop-blur-sm",
        "border-r border-rose-200/60 shadow-lg md:shadow-sm",
        "transform transition-transform duration-300 ease-in-out",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      ].join(' ')}>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-rose-300/40 to-transparent" />
        
        {/* Mobile header with user info and close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-rose-200/60">
          <div className="flex items-center gap-3">
            {(profile as any)?.photoURL || (profile as any)?.imageBase64 || user?.photoURL ? (
              <img
                src={(profile as any)?.photoURL || (profile as any)?.imageBase64 || user?.photoURL || ''}
                alt={profile?.name || user?.displayName || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-rose-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center text-lg font-bold text-white">
                {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                {profile?.name || user?.displayName || 'User'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block w-fit ${
                isAdmin ? 'bg-purple-100 text-purple-700' :
                isAstro ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {isAdmin ? 'Admin' : isAstro ? 'Astrologer' : 'User'}
              </span>
            </div>
          </div>
          <button
            onClick={handleMobileClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-rose-50 hover:text-gray-900 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Desktop user info card */}
        <div className="hidden md:block p-4 border-b border-rose-200/60">
          <div className="text-center">
            {(profile as any)?.photoURL || (profile as any)?.imageBase64 || user?.photoURL ? (
              <img
                src={(profile as any)?.photoURL || (profile as any)?.imageBase64 || user?.photoURL || ''}
                alt={profile?.name || user?.displayName || 'User'}
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-200 mx-auto mb-3"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <h3 className="font-semibold text-gray-900 mb-1 truncate">
              {profile?.name || user?.displayName || 'User'}
            </h3>
            <p className="text-xs text-gray-600 mb-2 truncate">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isAdmin ? 'bg-purple-100 text-purple-700' :
              isAstro ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {isAdmin ? 'Admin' : isAstro ? 'Astrologer' : 'User'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-4 px-3 gap-1">
          {visibleNavItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMobileClose}
                prefetch={true}
                className={[
                  'group relative flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  'px-3 py-2.5 gap-3 justify-start',
                  'transition-[background-color,box-shadow] duration-100',
                  active
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-rose-50'
                ].join(' ')}
              >
                <span className={[
                  'shrink-0',
                  active ? 'text-white' : 'text-rose-600 group-hover:text-rose-700'
                ].join(' ')}>
                  {item.icon}
                </span>
                <span className={[
                  'font-medium tracking-wide text-sm',
                  active ? 'text-white' : ''
                ].join(' ')}>{item.label}</span>
                {active && (
                  <span 
                    className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-gradient-to-b from-rose-400 via-orange-500 to-rose-600 shadow-md" 
                    aria-hidden 
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 h-8 rounded-full bg-gradient-to-r from-rose-200/20 via-orange-200/30 to-rose-200/20 blur-xl" />
      </aside>
    </>
  );
}

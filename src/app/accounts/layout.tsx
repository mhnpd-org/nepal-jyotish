"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById } from '@internal/api/users';
import { isAstrologer, isSuperAdmin } from '@internal/api/roleGuards';
import AppHeader from '@internal/layouts/app-header';
import Footer from '@internal/layouts/footer';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AppUser } from '@internal/api/types';
import CentralLoading from '@internal/components/central-loading';

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/');
        return;
      }
      setUser(u);
      const doc = await getUserById(u.uid);
      setProfile(doc);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <CentralLoading message="लोड हुँदैछ..." />
        <Footer variant="light" />
      </>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isAdmin = isSuperAdmin(profile);
  const isAstro = isAstrologer(profile);

  const navItems = [
    { href: '/accounts/appointments', label: 'अपोइन्टमेन्टहरू', icon: '📅', visible: true },
    { href: '/accounts/profile', label: 'प्रोफाइल', icon: '👤', visible: true },
    { href: '/accounts/users', label: 'प्रयोगकर्ताहरू', icon: '👥', visible: isAdmin },
    { href: '/accounts/astrologers', label: 'ज्योतिषीहरू', icon: '⭐', visible: isAdmin },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);

  return (
    <>
      <AppHeader variant="solid" language="np" />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-full mb-4 px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-between text-gray-700 font-medium"
              >
                <span>मेनु</span>
                <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>

              {/* Sidebar navigation */}
              <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block bg-white rounded-lg shadow-md overflow-hidden`}>
                {visibleNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white'
                          : 'text-gray-700 hover:bg-rose-50'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User info card */}
              <div className="hidden lg:block mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                    {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {profile?.name || user?.displayName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{user?.email}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isAdmin ? 'bg-purple-100 text-purple-700' :
                    isAstro ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isAdmin ? 'Admin' : isAstro ? 'Astrologer' : 'User'}
                  </span>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer variant="light" />
    </>
  );
}

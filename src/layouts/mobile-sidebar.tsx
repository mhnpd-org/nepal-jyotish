'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@internal/layouts/logo';
import LoginDialog from '@internal/layouts/login-dialog';
import { auth } from "@internal/api/firebase";
import { logout } from "@internal/api/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from "@internal/api/users";
import type { AppUser } from '@internal/api/types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'np' | 'en';
}

export default function MobileSidebar({ isOpen, onClose, language = 'en' }: MobileSidebarProps) {
  const isNepali = language === 'np';
  const [authUser, setAuthUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      if (u) {
        getUserById(u.uid).then((doc: AppUser | null) => {
          setProfile(doc);
        }).catch(() => {});
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <Logo size="sm" variant="dark" />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-white/80 transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links - Enhanced Grid Layout */}
          <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
            
            {/* Section 1: Account / Login */}
            <div className="space-y-3">
              {!authUser ? (
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100">
                  <button
                    onClick={() => setShowLoginDialog(true)}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {isNepali ? 'लगइन गर्नुहोस्' : 'Login'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Profile Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={authUser?.photoURL || '/favicon/user.svg'} alt="avatar" className="h-12 w-12 rounded-full border-2 border-white shadow-md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{authUser?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-600 truncate">{authUser?.email}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/accounts/appointments"
                        onClick={onClose}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg hover:bg-rose-50 hover:shadow-sm transition-all group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'बुकिङ' : 'Bookings'}</span>
                      </Link>
                      
                      {profile?.role === 'astrologer' && (
                        <Link
                          href="/accounts/profile"
                          onClick={onClose}
                          className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg hover:bg-rose-50 hover:shadow-sm transition-all group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'प्रोफाइल' : 'Profile'}</span>
                        </Link>
                      )}
                      
                      {profile?.role === 'super_admin' && (
                        <Link
                          href="/accounts/users"
                          onClick={onClose}
                          className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg hover:bg-rose-50 hover:shadow-sm transition-all group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'प्रयोगकर्ता' : 'Users'}</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg hover:bg-rose-50 hover:shadow-sm transition-all group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-rose-600 group-hover:scale-110 transition-all">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'बाहिर' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Primary Apps - Grid Layout */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">{isNepali ? 'मुख्य सेवाहरू' : 'Main Services'}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/kundali-matching"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-all shadow-sm hover:shadow-md border border-pink-100 group"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-pink-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{isNepali ? 'कुण्डली मिलान' : 'Kundali Match'}</span>
                </Link>

                <Link
                  href="/astro/janma"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all shadow-sm hover:shadow-md border border-orange-100 group"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-orange-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{isNepali ? 'कुण्डली निर्माण' : 'Create Kundali'}</span>
                </Link>

                <Link
                  href="/panchang"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md border border-purple-100 group"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-purple-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{isNepali ? 'पञ्चाङ्ग' : 'Panchang'}</span>
                </Link>

                <Link
                  href="/date-converter"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl hover:from-teal-100 hover:to-cyan-100 transition-all shadow-sm hover:shadow-md border border-teal-100 group"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-teal-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{isNepali ? 'मिति परिवर्तक' : 'Date Convert'}</span>
                </Link>

                <Link
                  href="/astrologers"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl hover:from-emerald-100 hover:to-green-100 transition-all shadow-sm hover:shadow-md border border-emerald-100 group col-span-2"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-emerald-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{isNepali ? 'गुरुजीसँग कुराकानी' : 'Talk to Guruji'}</span>
                </Link>
              </div>
            </div>

            {/* Section 3: Other Apps */}
            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">{isNepali ? 'अन्य' : 'More'}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-gray-800 group-hover:scale-110 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'होम' : 'Home'}</span>
                </Link>

                <Link
                  href="/books"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-gray-800 group-hover:scale-110 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'पुस्तक' : 'Books'}</span>
                </Link>

                <Link
                  href="/blogs"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-gray-800 group-hover:scale-110 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'ब्लग' : 'Blog'}</span>
                </Link>

                <Link
                  href="/services"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-gray-800 group-hover:scale-110 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'अनलाईन सेवा' : 'Online Services'}</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 group col-span-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600 group-hover:text-gray-800 group-hover:scale-110 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{isNepali ? 'सम्पर्क / सहयोग' : 'Contact / Support'}</span>
                </Link>
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

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </>
  );
}

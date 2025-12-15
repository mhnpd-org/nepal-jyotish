"use client";

import React, { useState, useEffect } from "react";
import LoginDialog from "./login-dialog";
import { auth } from "@internal/api/firebase";
import { logout } from "@internal/api/auth";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { getUserById } from "@internal/api/users";
import type { AppUser } from '@internal/api/types';


export default function LoginButton({ language = 'en' }: { language?: 'en' | 'np' }) {
  const [open, setOpen] = useState(false);
  const [authUser, setAuthUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      // fetch Firestore user doc if available
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

  if (!authUser) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
        >
          {language === 'np' ? 'लगइन' : 'Login'}
        </button>
        <LoginDialog open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative">
        <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-rose-700 border border-rose-200 text-xs sm:text-sm font-medium rounded-lg hover:shadow-sm"
      >
        <img src={authUser?.photoURL || '/favicon/user.svg'} alt="avatar" className="h-6 w-6 rounded-full" />
        <span className="hidden sm:inline">{language === 'np' ? 'अकाउन्ट' : 'Account'}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="py-1">
            {profile?.role === 'astrologer' && (
              <Link href="/accounts/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{language === 'np' ? 'प्रोफाइल' : 'Profile'}</Link>
            )}
            <Link href="/accounts/appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{language === 'np' ? 'अपोइन्टमेन्टहरू' : 'Appointments'}</Link>
            {profile?.role === 'super_admin' && (
              <Link href="/accounts/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{language === 'np' ? 'प्रयोगकर्ताहरू' : 'Users'}</Link>
            )}
            <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{language === 'np' ? 'साइन आउट' : 'Sign out'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

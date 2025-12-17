"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById } from '@internal/api/users';
import AppHeader from '@internal/layouts/app-header';
import AccountsSidebar from '@internal/layouts/accounts-sidebar';
import type { AppUser } from '@internal/api/types';
import { useRouter } from 'next/navigation';

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
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
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 w-full overflow-x-hidden">
      <AppHeader 
        variant="solid"
        language="np"
        showMobileMenu={true}
        backgroundGradient="bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 border-b border-rose-700/30 shadow-md"
        fullWidth={true}
      />
      <div className="flex flex-1 relative w-full min-w-0">
        {user && profile && <AccountsSidebar profile={profile} user={user} />}
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-7 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto max-w-6xl w-full min-w-0 text-gray-900">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

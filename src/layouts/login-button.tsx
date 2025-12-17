"use client";

import React, { useState, useEffect } from "react";
import LoginDialog from "./login-dialog";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged } from "firebase/auth";


export default function LoginButton({ language = 'en', variant = 'dark' }: { language?: 'en' | 'np', variant?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const [authUser, setAuthUser] = useState<import('firebase/auth').User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
    });
    return () => unsub();
  }, []);

  if (!authUser) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className={`px-3 sm:px-4 py-2 text-sm font-semibold transition-colors ${
            variant === 'light'
              ? 'text-white hover:text-white/80'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {language === 'np' ? 'लगइन' : 'Login'}
        </button>
        <LoginDialog open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  // Logged in - show photo and name only
  return (
    <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5">
      <img 
        src={authUser?.photoURL || '/favicon/user.svg'} 
        alt="avatar" 
        className="h-8 w-8 rounded-full border-2 border-white/20" 
      />
      <span className={`hidden sm:inline text-sm font-medium ${
        variant === 'light'
          ? 'text-white'
          : 'text-gray-700'
      }`}>
        {authUser?.displayName?.split(' ')[0] || 'User'}
      </span>
    </div>
  );
}

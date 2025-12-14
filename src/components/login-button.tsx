"use client";

import React, { useState, useEffect } from "react";
import LoginDialog from "./login-dialog";
import { auth, db } from "@internal/api/firebase";
import { logout } from "@internal/api/auth";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
        >
          Login
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
        <img src={user.photoURL || '/favicon/user.svg'} alt="avatar" className="h-6 w-6 rounded-full" />
        <span className="hidden sm:inline">Account</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="py-1">
            <Link href="/appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Appointments</Link>
            <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { loginWithGoogle } from "../api/auth";
import GoogleSignInButton from './google-signin-button';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({ open, onClose }: Props) {
  if (!open) return null;

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 min-h-screen">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in dialog"
        className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4">
            <span className="text-4xl font-bold text-rose-600">ॐ</span>
          </div>

          <div className="mb-2">
            <div className="text-lg font-bold">नेपाल ज्योतिष</div>
            <div className="text-sm text-gray-500">परम्परागत विज्ञान</div>
          </div>

          <h2 className="mt-4 text-base font-semibold">Login to Nepal ज्योतिष</h2>

          <div className="w-full mt-6">
            <GoogleSignInButton onClick={handleGoogleLogin} label="Continue with Google" />
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            aria-label="Close login dialog"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { loginWithGoogle } from "../api/auth";
import GoogleSignInButton from './google-signin-button';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({ open, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!open) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // Dialog will close via onClose after successful login
      onClose();
    } catch (err) {
      console.error('Google login failed', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 min-h-screen">
      <div className="absolute inset-0 bg-black/50" onClick={isLoading ? undefined : onClose} aria-hidden="true" />

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

          {isLoading && (
            <div className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
              <svg className="animate-spin h-5 w-5 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Logging in...</span>
            </div>
          )}

          <div className="w-full mt-6">
            <GoogleSignInButton 
              onClick={handleGoogleLogin} 
              label="Continue with Google" 
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close login dialog"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

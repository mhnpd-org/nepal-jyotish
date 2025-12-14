"use client";

import React from "react";
import { loginWithGoogle } from "../api/auth";

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
       
      console.error("Google login failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Login</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md"
              aria-label="Close login dialog"
            >
              ✕
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600">Sign in with Google to continue.</p>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md text-sm font-medium"
            >
              <img src="/favicon/google.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

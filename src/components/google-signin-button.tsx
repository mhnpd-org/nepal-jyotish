"use client";

import React from 'react';

type Props = {
  onClick?: () => void | Promise<void>;
  label?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function GoogleSignInButton({ onClick, label = 'Continue with Google', className = '', disabled = false, isLoading = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={
        `w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${className}`
      }
      aria-label={label}
    >
      <span className="flex items-center gap-3">
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <span className="flex items-center justify-center bg-white rounded-full w-7 h-7 overflow-hidden">
            <img src="/favicon/google.png" alt="Google" className="h-4 w-4" />
          </span>
        )}
        <span className="flex items-center gap-2">
          <span className="font-medium">{isLoading ? 'Signing in...' : label}</span>
        </span>
      </span>
    </button>
  );
}

"use client";

import React from 'react';
import Logo from '@internal/layouts/logo';

type Props = {
  onClick?: () => void | Promise<void>;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function GoogleSignInButton({ onClick, label = 'Continue with Google', className = '', disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        `w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-shadow shadow-sm disabled:opacity-60 ${className}`
      }
      aria-label={label}
    >
      <span className="flex items-center gap-3">
        <span className="flex items-center justify-center bg-white rounded-full w-7 h-7 overflow-hidden">
          <img src="/favicon/google.png" alt="Google" className="h-4 w-4" />
        </span>
        <span className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
        </span>
      </span>
    </button>
  );
}

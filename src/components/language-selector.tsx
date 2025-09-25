"use client";

import React from 'react';
import {useI18n} from '@internal/lib/i18n';

export default function LanguageSelector() {
  const {locale, setLocale} = useI18n();

  return (
    <div className="ml-auto">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as 'ne' | 'en')}
        className="rounded-md p-1 text-sm bg-white/80"
        aria-label="Language"
      >
        <option value="ne">नेपाली</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

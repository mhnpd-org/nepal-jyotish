"use client";

import React from 'react';
import en from '../i18n/en.json';
import ne from '../i18n/ne.json';

type Locale = 'ne' | 'en';

type TranslationNode = string | Record<string, string | Record<string, unknown>>;

const translations: Record<Locale, Record<string, TranslationNode>> = {
  ne,
  en,
};

const DEFAULT_LOCALE: Locale = 'ne';

const I18nContext = React.createContext({
  locale: DEFAULT_LOCALE as Locale,
  // typed no-op
  setLocale: (() => {}) as unknown as (l: Locale) => void,
  t: (path: string, fallback?: string) => fallback ?? path,
});

export function I18nProvider({children}: {children: React.ReactNode}) {
  const [locale, setLocaleState] = React.useState<Locale>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
      return (stored as Locale) || DEFAULT_LOCALE;
    } catch {
      return DEFAULT_LOCALE;
    }
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('locale', l); } catch {}
  };

  const t = (path: string, fallback?: string) => {
    const parts = path.split('.');
    let cur: unknown = translations[locale] as unknown;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') return fallback ?? path;
      cur = (cur as Record<string, unknown>)[p];
    }
    return typeof cur === 'string' ? cur : fallback ?? path;
  };

  return (
    <I18nContext.Provider value={{locale, setLocale, t}}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return React.useContext(I18nContext);
}

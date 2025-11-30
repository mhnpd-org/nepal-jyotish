'use client';

import { Suspense, use } from 'react';
import { getDailyPanchang } from '@mhnpd-org/panchang';
import { translateSanskritSafe } from '@internal/lib/devanagari';
import Link from 'next/link';

// Create a stable promise outside the component
const panchangPromise = getDailyPanchang();

function PanchangCompactContent() {
  const panchang = use(panchangPromise);

  const formatNepaliDate = (): string => {
    const vs = panchang.dates.vikramSamvat;
    if (!vs.day || !vs.year) return '';
    return `${vs.day} ${translateSanskritSafe(vs.monthName || '')}, ${vs.year}`;
  };

  return (
    <Link 
      href="/panchang"
      className="block bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 hover:shadow-3xl transition-all hover:scale-[1.02] group md:aspect-auto flex flex-col"
    >
      {/* Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full mb-2 shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">आजको पञ्चाङ्ग</h2>
        <p className="text-[10px] text-gray-600">Daily Panchang</p>
      </div>

      {/* Main Info */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-3 mb-3">
        <div className="text-center">
          <p className="text-base font-bold text-gray-900 mb-0.5">
            {translateSanskritSafe(panchang.tithi.paksha)} पक्ष, {translateSanskritSafe(panchang.tithi.tithi)}
          </p>
          <p className="text-xs text-rose-700 font-semibold mb-1.5">
            {formatNepaliDate()}
          </p>
          <p className="text-xs text-gray-700">
            {panchang.dates.vikramSamvat.vaar && translateSanskritSafe(panchang.dates.vikramSamvat.vaar)}
          </p>
        </div>
      </div>

      {/* Compact Details - Single column on mobile, two columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] flex-1">
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">नक्षत्र:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.nakshatra.name)} ({panchang.nakshatra.pada})
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">योग:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.tithi.yoga.name)}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">करण:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.tithi.karana.name)}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">संवत्सर:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.dates.samvatsara.name)}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">ऋतु:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.surya.ritu)}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
          <span className="text-gray-600">अयन:</span>
          <span className="font-semibold text-gray-900">
            {translateSanskritSafe(panchang.surya.suryaAyana)}
          </span>
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-3 pt-2.5 border-t border-gray-200">
        <div className="flex items-center justify-center gap-1.5 text-rose-600 group-hover:text-rose-700 font-medium text-xs">
          <span>पूर्ण विवरण हेर्नुहोस्</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function LoadingPanchangCompact() {
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 animate-pulse md:aspect-auto flex flex-col">
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full mb-2 opacity-50" />
        <div className="h-5 bg-gray-200 rounded w-28 mx-auto mb-1" />
        <div className="h-2.5 bg-gray-200 rounded w-20 mx-auto" />
      </div>
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-3 mb-3">
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-28 mx-auto mb-1.5" />
        <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function DailyPanchangCompact() {
  return (
    <Suspense fallback={<LoadingPanchangCompact />}>
      <PanchangCompactContent />
    </Suspense>
  );
}

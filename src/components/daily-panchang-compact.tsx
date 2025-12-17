'use client';

import { Suspense, use } from 'react';
import { getDailyPanchang, type Panchanga } from '@mhnpd-org/panchang';
import { translateSanskritSafe } from '@internal/lib/devanagari';
import Link from 'next/link';

type PanchangResult = Panchanga | { error: string };

// Create a stable promise outside the component with error handling
const panchangPromise = getDailyPanchang().catch((error) => {
  console.error('Failed to fetch daily panchang:', error);
  return { error: error.message || 'Unable to calculate panchang data' };
});

function PanchangCompactContent() {
  const result = use(panchangPromise) as PanchangResult;

  // Handle error state
  if ('error' in result) {
    return <ErrorPanchangCompact errorMessage={result.error} />;
  }
  
  const panchang = result;

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

function ErrorPanchangCompact({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 md:aspect-auto flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-red-600 to-rose-500 rounded-full mb-2 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">पञ्चाङ्ग उपलब्ध छैन</h2>
        <p className="text-[10px] text-gray-600">Currently Unavailable</p>
      </div>

      {/* Error Info */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-3 mb-3 flex-1">
        <div className="text-center">
          <p className="text-xs font-semibold text-red-900 mb-1.5">
            खगोलीय गणना त्रुटि
          </p>
          <p className="text-[10px] text-red-700 leading-relaxed mb-2">
            केही स्थानहरूमा सूर्य/चन्द्र गणना गर्न सकिँदैन। कृपया पछि प्रयास गर्नुहोस्।
          </p>
          {errorMessage && (
            <p className="text-[9px] text-red-600 font-mono bg-red-100 rounded px-1.5 py-0.5">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Suggestion */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
        <p className="text-[10px] text-amber-800 text-center">
          यो सामान्यतया ध्रुवीय क्षेत्र वा विशेष मितिमा मात्र हुन्छ
        </p>
      </div>
    </div>
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

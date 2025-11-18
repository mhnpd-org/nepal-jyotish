"use client";

import { Suspense, use, useState, useEffect } from "react";
import { getDailyPanchang, type Panchanga } from "@mhnpd-org/panchang";
import { translateSanskritSafe } from "@internal/lib/devanagari";

// Create a stable promise outside the component
const panchangPromise = getDailyPanchang();

function PanchangContent() {
  const panchang = use(panchangPromise);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const formatDateNepali = (date: Date): string => {
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    const timeStr = formatTime(date);
    return timeStr
      .split("")
      .map((char) => {
        const digit = parseInt(char);
        return isNaN(digit) ? char : nepaliDigits[digit];
      })
      .join("");
  };

  const formatNepaliDate = (
    vikramSamvat: Panchanga["dates"]["vikramSamvat"]
  ): string => {
    if (!vikramSamvat.monthName || !vikramSamvat.day || !vikramSamvat.year)
      return "N/A";
    return `${translateSanskritSafe(
      vikramSamvat.monthName
    )} ${translateSanskritSafe(
      vikramSamvat.day.toString()
    )}, ${translateSanskritSafe(vikramSamvat.year.toString())}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full mb-4 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          आजको पञ्चाङ्ग
        </h2>
        <p className="text-sm text-gray-600">
          Daily Panchang - {panchang.location.place || "Kathmandu, Nepal"}
        </p>
      </div>

      {/* Date Header */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-6 mb-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {translateSanskritSafe(panchang.tithi.paksha)} पक्ष,{" "}
            {translateSanskritSafe(panchang.tithi.tithi)}
          </h3>
          <p className="text-xl text-rose-700 font-semibold mb-3">
            {formatNepaliDate(panchang.dates.vikramSamvat)}
          </p>
          <div className="text-lg text-gray-700 mb-2">
            {panchang.dates?.vikramSamvat.vaar &&
              translateSanskritSafe(
                panchang.dates.vikramSamvat.vaar.toLowerCase()
              )}
          </div>
          <div className="text-base text-gray-600">
            {translateSanskritSafe(panchang.dates.samvatsara.name)} संवत्सर •
            विक्रम संवत् {panchang.dates.vikramSamvat.year}
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-blue-900">नेपाल समय</h4>
          </div>
          <p className="text-3xl font-bold text-blue-900 font-mono">
            {formatDateNepali(panchang.dates.zonedDate)}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Nepal Standard Time (NPT)
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-green-900">तपाईंको समय</h4>
          </div>
          <p className="text-3xl font-bold text-green-900 font-mono">
            {formatTime(currentTime)}
          </p>
          <p className="text-sm text-green-700 mt-1">Your Local Time</p>
        </div>
      </div>

      {/* Sun & Moon Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sunrise & Sunset */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-amber-900">सूर्य</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-700">सूर्योदय:</span>
              <span className="font-semibold text-amber-900">
                {panchang.surya.sunrise
                  ? formatDateNepali(panchang.surya.sunrise)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">सूर्यास्त:</span>
              <span className="font-semibold text-amber-900">
                {panchang.surya.sunset
                  ? formatDateNepali(panchang.surya.sunset)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Moonrise & Moonset */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <h4 className="font-semibold text-indigo-900">चन्द्र</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-700">चन्द्रोदय:</span>
              <span className="font-semibold text-indigo-900">
                {panchang.nakshatra.moonrise
                  ? formatDateNepali(panchang.nakshatra.moonrise)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-700">चन्द्रास्त:</span>
              <span className="font-semibold text-indigo-900">
                {panchang.nakshatra.moonset
                  ? formatDateNepali(panchang.nakshatra.moonset)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panchang Details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-rose-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          पञ्चाङ्ग विवरण
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-gray-600">तिथि:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.tithi.tithi)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600">पक्ष:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.tithi.paksha)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600">नक्षत्र:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.nakshatra.name)} (
              {panchang.nakshatra.pada})
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600">योग:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.tithi.yoga.name)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600">करण:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.tithi.karana.name)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600">चन्द्र मास:</span>
            <span className="font-semibold text-gray-900">
              {translateSanskritSafe(panchang.tithi.chandraMasa)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-teal-900 mb-3">अतिरिक्त विवरण</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-teal-700">ऋतु:</span>
            <span className="font-semibold text-teal-900">
              {translateSanskritSafe(panchang.surya.ritu)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-700">अयन:</span>
            <span className="font-semibold text-teal-900">
              {translateSanskritSafe(panchang.surya.suryaAyana)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-700">राशि:</span>
            <span className="font-semibold text-teal-900">
              {translateSanskritSafe(panchang.nakshatra.rashi)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-700">गण:</span>
            <span className="font-semibold text-teal-900">
              {translateSanskritSafe(panchang.nakshatra.gana)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          जानकारी
        </h4>
        <p className="text-sm text-amber-800">
          यो पञ्चाङ्ग वैदिक ज्योतिष र सूर्य सिद्धान्तमा आधारित छ। तिथि, नक्षत्र,
          योग र करण प्रत्येक दिनको महत्त्वपूर्ण ज्योतिषीय तत्व हुन्।
        </p>
      </div>
    </div>
  );
}

function LoadingPanchang() {
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8 animate-pulse">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full mb-4 shadow-lg opacity-50" />
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
      </div>
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-6 mb-6">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-3" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export default function DailyPanchang() {
  return (
    <Suspense fallback={<LoadingPanchang />}>
      <PanchangContent />
    </Suspense>
  );
}

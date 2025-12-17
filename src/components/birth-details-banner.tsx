"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JanmaFormValues } from '@internal/app/astro/janma/page';
import NepaliDate from "nepali-date-converter";

// Simple SVG Icons
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SupportIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface BirthDetailsBannerProps {
  janmaDetails: JanmaFormValues;
}

// Convert AD date to BS date string
const adToBs = (adDate: string): string => {
  try {
    if (!adDate || !/^\d{4}-\d{2}-\d{2}$/.test(adDate)) return "";
    const [year, month, day] = adDate.split("-").map(Number);
    const nd = new NepaliDate(new Date(year, month - 1, day));
    return nd.format ? nd.format("YYYY-MM-DD") : `${nd.getYear()}-${String(nd.getMonth() + 1).padStart(2, "0")}-${String(nd.getDate()).padStart(2, "0")}`;
  } catch {
    return adDate;
  }
};

export function BirthDetailsBanner({ janmaDetails }: BirthDetailsBannerProps) {
  const router = useRouter();

  const handleEditDetails = () => {
    router.push('/astro/janma');
  };

  // Format date based on calendar type
  const formattedDate = janmaDetails.calendarType === 'BS' 
    ? adToBs(janmaDetails.dateOfBirth)
    : janmaDetails.dateOfBirth;

  // Format time (remove :00 seconds if present)
  const formattedTime = janmaDetails.timeOfBirth 
    ? janmaDetails.timeOfBirth.slice(0, 5)
    : '';

  return (
    <div className="bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 border border-orange-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Birth Details */}
        <div className="flex-1 space-y-3">
          {/* Name if provided */}
          {janmaDetails.name && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500"></div>
              <span className="text-lg font-semibold text-gray-800">
                {janmaDetails.name}
              </span>
            </div>
          )}

          {/* Birth Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs">
                  जन्म मिति ({janmaDetails.calendarType === 'AD' ? 'ई.स.' : 'वि.स.'})
                </span>
                <span className="font-medium text-gray-800">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs">
                  जन्म समय
                </span>
                <span className="font-medium text-gray-800">
                  {formattedTime || 'N/A'}
                </span>
              </div>
            </div>

            {/* Place */}
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs">
                  जन्म स्थान
                </span>
                <span className="font-medium text-gray-800">
                  {janmaDetails.placeOfBirth.district_np}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="sm:flex-shrink-0">
          <button
            onClick={handleEditDetails}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
          >
            <EditIcon className="w-4 h-4" />
            <span>परिवर्तन गर्नुहोस्</span>
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <div className="mt-4 pt-3 border-t border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            यो कुण्डली उपरोक्त जन्म विवरणका आधारमा तयार गरिएको हो।
          </p>
          
          <div className="flex justify-center sm:justify-end">
            <Link
              href="/contact?from=Astro Tools"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
              aria-label="समस्या रिपोर्ट गर्नुहोस् वा सहायता माग्नुहोस्"
            >
              <SupportIcon className="w-3 h-3" />
              <span>समस्या रिपोर्ट गर्नुहोस्</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
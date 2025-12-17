"use client";

import React from "react";

export interface CalendarToggleProps {
  value: "AD" | "BS";
  onChange: (calendarType: "AD" | "BS") => void;
  labels?: {
    ad: string;
    bs: string;
  };
  className?: string;
}

export function CalendarToggle({
  value,
  onChange,
  labels = { ad: "ई.स.", bs: "वि.स." },
  className = ""
}: CalendarToggleProps) {
  return (
    <div className={`inline-flex self-start rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm bg-white ${className}`}>
      {(["AD", "BS"] as const).map((cal) => (
        <button
          key={cal}
          type="button"
          onClick={() => {
            if (value !== cal) {
              onChange(cal);
            }
          }}
          className={`h-10 px-4 sm:px-5 text-sm sm:text-base font-semibold flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 whitespace-nowrap ${
            value === cal
              ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
              : "bg-transparent text-gray-700 hover:bg-gray-50"
          }`}
          aria-pressed={value === cal}
        >
          {cal === 'AD' ? labels.ad : labels.bs}
        </button>
      ))}
    </div>
  );
}
"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
// @ts-ignore - external lib types may be implicit
import NepaliDate from "nepali-date-converter";
import "nepali-datepicker-reactjs/dist/index.css";
import { format } from "date-fns";

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

// Convert BS date to AD date string  
const bsToAd = (bsDate: string): string => {
  try {
    if (!bsDate || !/^\d{4}-\d{2}-\d{2}$/.test(bsDate)) return "";
    const nd = new NepaliDate(bsDate);
    const jsDate = nd.toJsDate();
    return format(jsDate, "yyyy-MM-dd");
  } catch {
    return bsDate;
  }
};

export interface NepaliDatePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  required?: boolean;
  className?: string;
}

export function NepaliDatePickerComponent<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required = false,
  className = ""
}: NepaliDatePickerProps<TFieldValues>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm sm:text-base font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        rules={required ? { required: "मिति आवश्यक छ" } : undefined}
        render={({ field, fieldState: { error } }) => {
          const handleDateChange = (date: string) => {
            // Convert BS date to AD date for storage
            const adDate = bsToAd(date);
            field.onChange(adDate);
          };

          // Convert stored AD date to BS date for display
          const displayValue = field.value ? adToBs(field.value) : (() => {
            const today = new NepaliDate(new Date());
            return today.format ? today.format("YYYY-MM-DD") : `${today.getYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          })();

          return (
            <div className="flex flex-col">
              <div className="[&_.nepali-datepicker-reactjs]:w-full [&_.nepali-datepicker-reactjs_input]:w-full">
                <NepaliDatePicker
                  inputClassName="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border-2 border-gray-200 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                  className=""
                  value={displayValue}
                  onChange={handleDateChange}
                  options={{
                    calenderLocale: "ne",
                    valueLocale: "en",
                    closeOnSelect: true
                  }}
                />
              </div>
              
              {error && (
                <span className="text-red-500 text-xs sm:text-sm mt-1">{error.message}</span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
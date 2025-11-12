"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface TimePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  required?: boolean;
  className?: string;
}

export function TimePicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required = false,
  className = ""
}: TimePickerProps<TFieldValues>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        rules={required ? { required: "Time is required" } : undefined}
        render={({ field, fieldState: { error } }) => {
          const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let timeValue = e.target.value;
            // Convert HH:MM to HH:MM:SS format for panchang library
            if (timeValue && timeValue.length === 5) {
              timeValue = timeValue + ":00";
            }
            field.onChange(timeValue);
          };

          // Convert HH:MM:SS back to HH:MM for display
          const displayValue = field.value ? field.value.slice(0, 5) : "";

          return (
            <div className="flex flex-col">
              <input
                type="time"
                value={displayValue}
                onChange={handleTimeChange}
                onBlur={field.onBlur}
                className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                aria-invalid={error ? "true" : "false"}
              />
              
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
"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface EnglishDatePickerProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  className?: string;
  label?: string;
}

export function EnglishDatePicker<T extends FieldValues = FieldValues>({
  control,
  name,
  required = false,
  className = "",
  label
}: EnglishDatePickerProps<T>) {
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
        rules={{ required: required ? "Date is required" : false }}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col">
            <input
              {...field}
              type="date"
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 sm:px-4 py-2.5 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all cursor-pointer"
              aria-invalid={error ? "true" : "false"}
            />
            {error && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">{error.message}</span>
            )}
          </div>
        )}
      />
    </div>
  );
}
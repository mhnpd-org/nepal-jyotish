"use client";

import React, { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

export interface TimePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  /** Optional placeholder shown when empty */
  placeholder?: string;
  /** Optional initial time if form default not supplied (HH:MM:SS) */
  defaultTime?: string;
  /** Whether to show seconds (if false we still keep seconds internally as 00) */
  showSeconds?: boolean;
}

// Returns normalized HH:MM:SS string or empty string if invalid
function normalizeTime(raw: string, showSeconds: boolean): string {
  if (!raw) return "";
  const cleaned = raw.trim();
  // Accept separators : or space
  const parts = cleaned.split(/[:\s]/).filter(Boolean);
  let h = 0, m = 0, s = 0;
  if (parts.length === 1) {
    // Could be HH, HHMM, HHMMSS, HMM
    const digits = parts[0].replace(/[^0-9]/g, "");
    if (digits.length <= 2) {
      h = parseInt(digits, 10);
    } else if (digits.length === 3) { // e.g. 945 -> 09:45:00
      h = parseInt(digits.slice(0, 1), 10);
      m = parseInt(digits.slice(1, 3), 10);
    } else if (digits.length === 4) { // 0945 -> 09:45
      h = parseInt(digits.slice(0, 2), 10);
      m = parseInt(digits.slice(2, 4), 10);
    } else if (digits.length === 5) { // 12345 -> 1 23 45
      h = parseInt(digits.slice(0, 1), 10);
      m = parseInt(digits.slice(1, 3), 10);
      s = parseInt(digits.slice(3, 5), 10);
    } else if (digits.length >= 6) { // 123456 -> 12 34 56
      h = parseInt(digits.slice(0, 2), 10);
      m = parseInt(digits.slice(2, 4), 10);
      s = parseInt(digits.slice(4, 6), 10);
    }
  } else if (parts.length === 2) {
    h = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
  } else if (parts.length >= 3) {
    h = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    s = parseInt(parts[2], 10);
  }
  if (isNaN(h) || isNaN(m) || isNaN(s)) return "";
  // Clamp ranges
  h = Math.min(Math.max(h, 0), 23);
  m = Math.min(Math.max(m, 0), 59);
  s = Math.min(Math.max(s, 0), 59);
  if (!showSeconds) s = 0;
  const HH = h.toString().padStart(2, "0");
  const MM = m.toString().padStart(2, "0");
  const SS = s.toString().padStart(2, "0");
  return `${HH}:${MM}:${SS}`;
}

export function TimePicker<TFieldValues extends FieldValues>(props: TimePickerProps<TFieldValues>) {
  const {
    control,
    name,
    label = "Time",
    required = false,
    className = "",
    disabled = false,
    placeholder = "HH:MM:SS",
    defaultTime,
    showSeconds = true
  } = props;

  const [draft, setDraft] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={(defaultTime ? normalizeTime(defaultTime, showSeconds) : "") as unknown as TFieldValues[typeof name]}
      rules={required ? { required: "Time is required" } : undefined}
      render={({ field, fieldState }) => {
        const displayValue = draft || (field.value as string) || "";

        const commit = () => {
          const normalized = normalizeTime(displayValue, showSeconds);
            if (normalized) {
              field.onChange(normalized);
              setDraft("");
            } else if (displayValue.trim() === "") {
              field.onChange("");
              setDraft("");
            } // else keep draft to show user it's invalid format
        };

        const handleBlur = () => {
          commit();
          field.onBlur();
        };

        const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft("");
          }
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            // Increment / decrement minutes by 1
            const base = normalizeTime(displayValue || (field.value as string) || "00:00:00", showSeconds) || "00:00:00";
            const [hStr, mStr, sStr] = base.split(":");
            let h = parseInt(hStr, 10);
            let m = parseInt(mStr, 10);
            // seconds retained from original value (sStr) unless showSeconds false
            if (e.key === "ArrowUp") m = (m + 1) % 60; else m = (m + 59) % 60;
            if (m === 0) h = (h + (e.key === "ArrowUp" ? 1 : 23)) % 24;
            const next = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${showSeconds ? sStr : "00"}`;
            field.onChange(next);
            setDraft("");
            e.preventDefault();
          }
        };

        const currentValid = normalizeTime(displayValue, showSeconds);
        const hasTempInvalid = displayValue.length > 0 && !currentValid && draft.length > 0;

        return (
          <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={displayValue}
                disabled={disabled}
                onChange={e => setDraft(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${hasTempInvalid ? "border-red-400 ring-red-200" : "border-gray-300"}`}
              />
            </div>
            {hasTempInvalid && (
              <p className="mt-1 text-xs text-orange-600">Invalid format. Use HH:MM{showSeconds ? ":SS" : ""} (24h).</p>
            )}
            {fieldState.error && (
              <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default TimePicker;

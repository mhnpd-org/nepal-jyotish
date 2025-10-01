"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from "react";

// DatePickerProps: a composite input (day, month, year) that behaves like a single required input
// for react-hook-form. It exposes its value as a hidden input in YYYY-MM-DD format.
export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue"
  > {
  /** Optional label rendered above the fields */
  label?: string;
  /** Initial date (overrides today's date). Format: YYYY-MM-DD */
  initialDate?: string;
  /** Initial calendar system (AD or BS) */
  initialCalendar?: "AD" | "BS";
  /** Controlled date value (YYYY-MM-DD). If supplied, component syncs to it. */
  valueDate?: string;
  /** Controlled calendar value. If supplied, component syncs to it. */
  calendarValue?: "AD" | "BS";
  /** Minimum allowed year (default 1800) */
  minYear?: number;
  /** Maximum allowed year (default 2199) */
  maxYear?: number;
  /** Callback receiving the assembled date string (YYYY-MM-DD) whenever any segment changes */
  onValueChange?: (value: string) => void;
  /** Callback when calendar system changes */
  onCalendarChange?: (cal: "AD" | "BS") => void;
}

function isValidDateString(
  str: string | undefined,
  minYear: number,
  maxYear: number
) {
  if (!str) return false;
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(str.trim());
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (y < minYear || y > maxYear) return false;
  if (mo < 1 || mo > 12) return false;
  if (d < 1 || d > 32) return false; // Allow up to 32 per requirement (some astro calcs might need it)
  return true;
}

const pad2 = (n: number) => n.toString().padStart(2, "0");

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      name,
      label,
      initialDate,
      initialCalendar = "AD",
      valueDate,
      calendarValue,
      minYear = 1800,
      maxYear = 2199,
      onValueChange,
      onCalendarChange,
      id: providedId,
      className = "",
      required = true, // Always required as per spec
      onChange, // event-style onChange coming from react-hook-form register
      onBlur,
      ...rest
    },
    ref
  ) {
    if (!name) {
      throw new Error(
        "DatePicker requires a 'name' prop to integrate with forms"
      );
    }

    const today = new Date();
    const defaultYear = today.getFullYear();
    const defaultMonth = today.getMonth() + 1; // 1-12
    const defaultDay = today.getDate();

    const validInitial = isValidDateString(initialDate, minYear, maxYear)
      ? initialDate
      : undefined;
    let initialYear: number;
    let initialMonth: number;
    let initialDay: number;

    if (validInitial) {
      const [y, m, d] = (validInitial as string).split("-").map(Number);
      initialYear = y;
      initialMonth = m;
      initialDay = d;
    } else {
      initialYear = Math.min(Math.max(defaultYear, minYear), maxYear);
      initialMonth = defaultMonth;
      initialDay = defaultDay; // Already 1-31, acceptable within 1-32 range
    }

    // Calendar system (AD or BS)
    const [calendar, setCalendar] = useState<"AD" | "BS">(initialCalendar);
    const [year, setYear] = useState<string>(String(initialYear));
    const [month, setMonth] = useState<string>(pad2(initialMonth));
    const [day, setDay] = useState<string>(pad2(initialDay));

    // --- Calendar conversion helpers (NOTE: Simplified approximate conversion) ---
    // Bikram Sambat is roughly 56 years and 8 months ahead of Gregorian. Accurate conversion
    // requires a detailed lookup table; this approximation is provided for UI toggle only and
    // should be replaced with a precise algorithm if exact Nepali dates are critical.
    const BS_YEAR_OFFSET = 56;
    const BS_MONTH_OFFSET = 8; // Approximate (BS New Year mid-April)

    function adToBs(
      y: number,
      m: number,
      d: number
    ): { y: number; m: number; d: number } {
      let yy = y + BS_YEAR_OFFSET;
      let mm = m + BS_MONTH_OFFSET;
      if (mm > 12) {
        mm -= 12;
        yy += 1;
      }
      return { y: yy, m: mm, d };
    }
    function bsToAd(
      y: number,
      m: number,
      d: number
    ): { y: number; m: number; d: number } {
      let yy = y - BS_YEAR_OFFSET;
      let mm = m - BS_MONTH_OFFSET;
      if (mm < 1) {
        mm += 12;
        yy -= 1;
      }
      return { y: yy, m: mm, d };
    }

    // Hidden input ref (exposed via forwardRef)
    const hiddenRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => hiddenRef.current as HTMLInputElement, []);

    const internalId = useId();
    const id = providedId || `${name}-date-${internalId}`;
    const dayId = `${id}-day`;
    const monthId = `${id}-month`;
    const yearId = `${id}-year`;

    const assemble = useCallback((y: string, m: string, d: string) => {
      // Normalize inputs: year stays as typed (truncated to 4), month/day -> 2 digits if possible
      const normYear = y.padStart(4, "0").slice(0, 4);
      const mm = m.padStart(2, "0").slice(0, 2);
      const dd = d.padStart(2, "0").slice(0, 2);
      return `${normYear}-${mm}-${dd}`;
    }, []);

    const updateValue = useCallback(
      (y: string, m: string, d: string, cal: "AD" | "BS" = calendar) => {
        // Clamp numeric boundaries
        let yi = parseInt(y || "0", 10);
        if (!Number.isFinite(yi)) yi = minYear;
        yi = Math.min(Math.max(yi, minYear), maxYear);
        let mi = parseInt(m || "0", 10);
        if (!Number.isFinite(mi)) mi = 1;
        mi = Math.min(Math.max(mi, 1), 12);
        let di = parseInt(d || "0", 10);
        if (!Number.isFinite(di)) di = 1;
        di = Math.min(Math.max(di, 1), 32); // allow 32

        // Always emit value in AD (Gregorian) for form submission for consistency.
        let submitY = yi;
        let submitM = mi;
        let submitD = di;
        if (cal === "BS") {
          const back = bsToAd(yi, mi, di);
          submitY = back.y;
          submitM = back.m;
          submitD = back.d;
        }
        const val = assemble(String(submitY), String(submitM), String(submitD));
        if (hiddenRef.current) {
          hiddenRef.current.value = val;
          // Fire synthetic input/change events so RHF (or native forms) pick this up
          const event = new Event("input", { bubbles: true });
          hiddenRef.current.dispatchEvent(event);
          const changeEvent = new Event("change", { bubbles: true });
          hiddenRef.current.dispatchEvent(changeEvent);
        }
        onValueChange?.(val);
        if (onChange) {
          // Call RHF style onChange with synthetic event-like object
          const synthetic = {
            target: { name, value: val }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(synthetic);
        }
      },
      [assemble, maxYear, minYear, name, onChange, onValueChange, calendar]
    );

    // Initialize hidden input value after mount
    useEffect(() => {
      updateValue(year, month, day);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync when controlled date value changes
    useEffect(() => {
      if (valueDate && isValidDateString(valueDate, minYear, maxYear)) {
        const [y, m, d] = valueDate.split("-");
        // Only update internal state if different to avoid loops
        if (y !== year || m !== month || d !== day) {
          setYear(y);
          setMonth(m);
          setDay(d);
          updateValue(y, m, d, calendarValue || calendar);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDate]);

    // Sync controlled calendar value (display only). We do not convert; assume provided date matches AD submission
    useEffect(() => {
      if (calendarValue && calendarValue !== calendar) {
        setCalendar(calendarValue);
        // Re-emit value to ensure hidden input lines up (submission always AD)
        updateValue(year, month, day, calendarValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarValue]);

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
      setDay(raw);
      updateValue(year, month, raw);
    };
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
      setMonth(raw);
      updateValue(year, raw, day);
    };
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
      setYear(raw);
      updateValue(raw, month, day);
    };

    // Toggle calendar system and convert displayed triple accordingly
    const toggleCalendar = () => {
      setCalendar((prev) => {
        const next = prev === "AD" ? "BS" : "AD";
        // Convert current displayed values to the target calendar for UI continuity
        let yi = parseInt(year || "0", 10);
        let mi = parseInt(month || "1", 10);
        let di = parseInt(day || "1", 10);
        if (prev === "AD" && next === "BS") {
          const { y, m, d } = adToBs(yi, mi, di);
          yi = y;
          mi = m;
          di = d;
        } else if (prev === "BS" && next === "AD") {
          const { y, m, d } = bsToAd(yi, mi, di);
          yi = y;
          mi = m;
          di = d;
        }
        setYear(String(yi));
        setMonth(pad2(mi));
        setDay(pad2(di));
        // Update hidden input with submission value (always AD)
        updateValue(String(yi), String(mi), String(di), next);
        onCalendarChange?.(next);
        return next;
      });
    };

    // Auto-advance focus when segment filled
    const dayRef = useRef<HTMLInputElement | null>(null);
    const monthRef = useRef<HTMLInputElement | null>(null);
    const yearRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (day.length === 2 && monthRef.current) monthRef.current.focus();
    }, [day]);
    useEffect(() => {
      if (month.length === 2 && yearRef.current) yearRef.current.focus();
    }, [month]);

    const handleKeyNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
        if (e.currentTarget === monthRef.current && dayRef.current) {
          dayRef.current.focus();
        } else if (e.currentTarget === yearRef.current && monthRef.current) {
          monthRef.current.focus();
        }
      }
    };

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
            {label}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
        )}
        <div
          className="flex items-center gap-3"
          aria-describedby={`${id}-segments-desc`}
        >
          {/* Unified grouped box with internal calendar toggle */}
          <div className="inline-flex h-10 items-stretch rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400/40 divide-x divide-gray-300 dark:divide-gray-700">
            {/* Toggle segment */}
            <button
              type="button"
              onClick={toggleCalendar}
              className="relative flex flex-col justify-center px-3 text-xs md:text-sm font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 group h-full"
              aria-label="Toggle Calendar System"
            >
              <span className="flex items-center gap-1">
                <span
                  className={`px-2 py-1 rounded text-[11px] md:text-xs lg:text-sm transition-colors ${
                    calendar === "AD"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                  }`}
                >
                  AD
                </span>
                <span
                  className={`px-2 py-1 rounded text-[11px] md:text-xs lg:text-sm transition-colors ${
                    calendar === "BS"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                  }`}
                >
                  BS
                </span>
              </span>
            </button>
            {/* Year */}
            <input
              ref={yearRef}
              id={yearId}
              inputMode="numeric"
              placeholder={calendar === "AD" ? "YYYY" : "BS YYYY"}
              className="w-24 bg-transparent px-3 py-0 text-center text-sm focus:outline-none h-full"
              value={year}
              onChange={handleYearChange}
              onKeyDown={handleKeyNav}
              aria-label="Year"
              required
            />
            {/* Month */}
            <input
              ref={monthRef}
              id={monthId}
              inputMode="numeric"
              placeholder="MM"
              className="w-14 bg-transparent px-3 py-0 text-center text-sm focus:outline-none h-full"
              value={month}
              onChange={handleMonthChange}
              onKeyDown={handleKeyNav}
              aria-label="Month"
              required
            />
            {/* Day */}
            <input
              ref={dayRef}
              id={dayId}
              inputMode="numeric"
              placeholder="DD"
              className="w-14 bg-transparent px-3 py-0 text-center text-sm focus:outline-none h-full"
              value={day}
              onChange={handleDayChange}
              onKeyDown={handleKeyNav}
              aria-label="Day"
              required
            />
          </div>
          {/* Hidden input that integrates with forms / RHF */}
          <input
            type="hidden"
            id={id}
            name={name}
            ref={hiddenRef}
            required={required}
            onBlur={onBlur}
            // Spread remaining props that could be relevant (data-* etc.)
            {...rest}
          />
        </div>
        <p id={`${id}-segments-desc`} className="sr-only">
          Enter day, month, and year. Value submitted as YYYY-MM-DD.
        </p>
      </div>
    );
  }
);

export default DatePicker;

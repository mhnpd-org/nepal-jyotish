"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from "react";

// We only import the converter for the BS picker (tree-shaking keeps AD lean)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - external lib types may be implicit
import NepaliDate from "nepali-date-converter";

/*
  Simplified segmented date pickers.
  - ADDatePicker: Gregorian only (years 1900-2099 default)
  - BSDatePicker: Bikram Sambat only (years 2000-2090 default) but ALWAYS emits
                  the converted AD date string (YYYY-MM-DD) for form storage.

  Shared behaviour:
  - 3 numeric inputs (Year / Month / Day) acting as a single required field.
  - Hidden input (name prop) carries final AD date (YYYY-MM-DD) so forms / RHF work normally.
  - Auto focus advance Year<-Month<-Day with backspace reverse navigation.
  - Month clamped 1..12.
  - Day: AD picker allows 1..31. BS picker allows 1..32 (some BS months have 32 days).
*/

export interface BasePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  label?: string;
  /** Initial visible date in that calendar (YYYY-MM-DD). If absent defaults to today. */
  initialDate?: string;
  /** Callback with AD date (YYYY-MM-DD) whenever a valid (complete) date changes */
  onValueChange?: (value: string) => void;
  /** Optional uncontrolled -> controlled external AD value (for AD picker) */
  valueDate?: string;
  /** For react-hook-form style synthetic change event support */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const pad2 = (n: number) => n.toString().padStart(2, "0");

function buildHiddenDispatch(
  hidden: HTMLInputElement | null,
  name: string,
  externalOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
) {
  return (val: string) => {
    if (!hidden) return;
    hidden.value = val;
    const inputEvt = new Event("input", { bubbles: true });
    hidden.dispatchEvent(inputEvt);
    const changeEvt = new Event("change", { bubbles: true });
    hidden.dispatchEvent(changeEvt);
    if (externalOnChange) {
      const synthetic = { target: { name, value: val } } as unknown as React.ChangeEvent<HTMLInputElement>;
      externalOnChange(synthetic);
    }
  };
}

function useSegmentState(initial: { y: number; m: number; d: number }) {
  const [year, setYear] = useState<string>(String(initial.y));
  const [month, setMonth] = useState<string>(pad2(initial.m));
  const [day, setDay] = useState<string>(pad2(initial.d));
  return { year, month, day, setYear, setMonth, setDay };
}

function SegmentedInputs({
  name,
  label,
  className = "",
  id: providedId,
  values,
  onSegmentChange,
  placeholderYear
}: {
  name: string;
  label?: string;
  className?: string;
  id?: string;
  values: { year: string; month: string; day: string };
  onSegmentChange: (part: "y" | "m" | "d", raw: string) => void;
  placeholderYear: string;
}) {
  const { year, month, day } = values;

  const internalId = useId();
  const id = providedId || `${name}-date-${internalId}`;
  const dayId = `${id}-day`;
  const monthId = `${id}-month`;
  const yearId = `${id}-year`;

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  // Auto forward focus
  useEffect(() => {
    if (day.length === 2 && monthRef.current) monthRef.current.focus();
  }, [day]);
  useEffect(() => {
    if (month.length === 2 && yearRef.current) yearRef.current.focus();
  }, [month]);

  const handleKeyNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
      if (e.currentTarget === monthRef.current && dayRef.current) dayRef.current.focus();
      else if (e.currentTarget === yearRef.current && monthRef.current) monthRef.current.focus();
    }
  };

  return (
    <div className={`flex flex-col gap-1 px-1 sm:px-0 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          {label}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
      )}
      <div className="flex items-center gap-3 w-full" aria-describedby={`${id}-segments-desc`}>
        <div className="inline-flex h-10 items-stretch rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400/40 divide-x divide-gray-300 dark:divide-gray-700 max-w-full">
          {/* Year */}
          <input
            ref={yearRef}
            id={yearId}
            inputMode="numeric"
            placeholder={placeholderYear}
            className="w-16 sm:w-20 md:w-24 bg-transparent px-2 sm:px-2.5 md:px-3 py-0 text-center text-sm focus:outline-none h-full"
            value={year}
            onChange={(e) => onSegmentChange("y", e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
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
            className="w-12 md:w-14 bg-transparent px-1.5 sm:px-2.5 md:px-3 py-0 text-center text-sm focus:outline-none h-full"
            value={month}
            onChange={(e) => onSegmentChange("m", e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
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
            className="w-12 md:w-14 bg-transparent px-1.5 sm:px-2.5 md:px-3 py-0 text-center text-sm focus:outline-none h-full"
            value={day}
            onChange={(e) => onSegmentChange("d", e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
            onKeyDown={handleKeyNav}
            aria-label="Day"
            required
          />
        </div>
        {/* Hidden input is rendered by parent */}
      </div>
      <p id={`${id}-segments-desc`} className="sr-only">
        Enter day, month, and year. Value submitted as YYYY-MM-DD.
      </p>
    </div>
  );
}

/* ---------------- AD (Gregorian) Picker ---------------- */
export interface ADDatePickerProps extends BasePickerProps {
  minYear?: number; // default 1900
  maxYear?: number; // default 2099
}

export const ADDatePicker = forwardRef<HTMLInputElement, ADDatePickerProps>(
  function ADDatePicker(
    {
      name,
      label,
      className,
      initialDate,
      minYear = 1900,
      maxYear = 2099,
      onValueChange,
      valueDate,
      id: providedId,
      required = true,
      onBlur,
      onChange,
      ...rest
    },
    ref
  ) {
    if (!name) throw new Error("ADDatePicker requires a 'name'");

    const today = new Date();
    const base = (() => {
      if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
        const [y, m, d] = initialDate.split("-").map(Number);
        return { y, m, d };
      }
      return { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };
    })();
    const state = useSegmentState(base);

    // Hidden input ref
    const hiddenRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => hiddenRef.current as HTMLInputElement, []);

    // External -> internal sync for controlled value (AD)
    useEffect(() => {
      if (valueDate && /^\d{4}-\d{2}-\d{2}$/.test(valueDate)) {
        if (valueDate !== `${state.year}-${state.month}-${state.day}`) {
          const [y, m, d] = valueDate.split("-");
          state.setYear(y);
          state.setMonth(m);
          state.setDay(d);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDate]);

    const emitIfComplete = useCallback(
      (y: string, m: string, d: string) => {
        if (y.length === 4 && m.length === 2 && d.length === 2) {
          const yi = Math.min(Math.max(parseInt(y, 10) || minYear, minYear), maxYear);
          const mi = Math.min(Math.max(parseInt(m, 10) || 1, 1), 12);
          const di = Math.min(Math.max(parseInt(d, 10) || 1, 1), 31);
          const val = `${yi.toString().padStart(4, "0")}-${pad2(mi)}-${pad2(di)}`;
          buildHiddenDispatch(hiddenRef.current, name, onChange)(val);
          onValueChange?.(val);
        }
      },
      [maxYear, minYear, onValueChange, name, onChange]
    );

    // Initialize
    useEffect(() => {
      emitIfComplete(state.year, state.month, state.day);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSegmentChange = (part: "y" | "m" | "d", raw: string) => {
      if (part === "y") state.setYear(raw);
      else if (part === "m") state.setMonth(raw);
      else state.setDay(raw);
      emitIfComplete(
        part === "y" ? raw : state.year,
        part === "m" ? raw : state.month,
        part === "d" ? raw : state.day
      );
    };

    return (
      <>
        <SegmentedInputs
          name={name}
          label={label}
          className={className}
          id={providedId}
          values={{ year: state.year, month: state.month, day: state.day }}
          onSegmentChange={onSegmentChange}
          placeholderYear="YYYY"
        />
        <input
          type="hidden"
          name={name}
          ref={hiddenRef}
          required={required}
          onBlur={onBlur}
          {...rest}
        />
      </>
    );
  }
);

/* ---------------- BS (Bikram Sambat) Picker ---------------- */
export interface BSDatePickerProps extends BasePickerProps {
  minYear?: number; // BS default 2000
  maxYear?: number; // BS default 2090
}

export const BSDatePicker = forwardRef<HTMLInputElement, BSDatePickerProps>(
  function BSDatePicker(
    {
      name,
      label,
      className,
      initialDate, // Interpreted as BS date here
      minYear = 2000,
      maxYear = 2090,
      onValueChange,
      id: providedId,
      required = true,
      onBlur,
      onChange,
      ...rest
    },
    ref
  ) {
    if (!name) throw new Error("BSDatePicker requires a 'name'");

    // Derive today's BS date for default
    const today = new NepaliDate(new Date());
    const todayParts = today.format
      ? (today.format("YYYY-MM-DD") as string).split("-").map(Number)
      : [today.getYear(), today.getMonth() + 1, today.getDate()]; // Fallback if format not present

    const base = (() => {
      if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
        const [y, m, d] = initialDate.split("-").map(Number);
        return { y, m, d };
      }
      return { y: todayParts[0], m: todayParts[1], d: todayParts[2] };
    })();

    const state = useSegmentState(base);
    const hiddenRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => hiddenRef.current as HTMLInputElement, []);
    const emitIfComplete = useCallback(
      (y: string, m: string, d: string) => {
        if (y.length === 4 && m.length === 2 && d.length === 2) {
          const yi = Math.min(Math.max(parseInt(y, 10) || minYear, minYear), maxYear);
          const mi = Math.min(Math.max(parseInt(m, 10) || 1, 1), 12);
          const di = Math.min(Math.max(parseInt(d, 10) || 1, 1), 32); // allow up to 32
          const bsVal = `${yi.toString().padStart(4, "0")}-${pad2(mi)}-${pad2(di)}`;
          try {
            const adDate: Date = new NepaliDate(bsVal).toJsDate();
            const adY = adDate.getFullYear();
            const adM = pad2(adDate.getMonth() + 1);
            const adD = pad2(adDate.getDate());
            const adStr = `${adY.toString().padStart(4, "0")}-${adM}-${adD}`;
            buildHiddenDispatch(hiddenRef.current, name, onChange)(adStr);
            onValueChange?.(adStr);
          } catch {
            // Invalid BS date combination -> ignore
          }
        }
      },
      [maxYear, minYear, onValueChange, name, onChange]
    );

    // Initialize
    useEffect(() => {
      emitIfComplete(state.year, state.month, state.day);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSegmentChange = (part: "y" | "m" | "d", raw: string) => {
      if (part === "y") state.setYear(raw);
      else if (part === "m") state.setMonth(raw);
      else state.setDay(raw);
      emitIfComplete(
        part === "y" ? raw : state.year,
        part === "m" ? raw : state.month,
        part === "d" ? raw : state.day
      );
    };

    return (
      <>
        <SegmentedInputs
          name={name}
          label={label}
          className={className}
          id={providedId}
          values={{ year: state.year, month: state.month, day: state.day }}
          onSegmentChange={onSegmentChange}
          placeholderYear="BS YYYY"
        />
        <input
          type="hidden"
          name={name}
          ref={hiddenRef}
          required={required}
          onBlur={onBlur}
          {...rest}
        />
      </>
    );
  }
);

// Backwards compatibility default export (AD picker)
export default ADDatePicker;
// Legacy-style wrapper selecting AD or BS based on legacy props (initialCalendar/calendarValue)
export interface LegacyDatePickerProps extends ADDatePickerProps, BSDatePickerProps {
  initialCalendar?: "AD" | "BS";
  calendarValue?: "AD" | "BS"; // takes precedence if provided
  onCalendarChange?: (cal: "AD" | "BS") => void; // called once (no internal toggle now)
}

export const DatePicker = React.forwardRef<HTMLInputElement, LegacyDatePickerProps>(
  function DatePickerLegacy(
    {
      initialCalendar,
      calendarValue,
      onCalendarChange,
      // Pull out legacy-only props so they are NOT forwarded to DOM
      ...rest
    },
    ref
  ) {
    const chosen = calendarValue || initialCalendar || "AD";
    // Fire callback once (mount) with chosen calendar
    useEffect(() => {
      onCalendarChange?.(chosen);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosen]);

    if (chosen === "BS") {
      // We accept that provided initialDate (if any) is already a BS string. If valueDate (AD) is provided,
      // we do NOT attempt to convert for display to keep wrapper simple; recommend using BSDatePicker directly.
      return <BSDatePicker ref={ref} {...rest} />;
    }
    return <ADDatePicker ref={ref} {...rest} />;
  }
);

export { ADDatePicker as ADPicker, BSDatePicker as BSPicker };

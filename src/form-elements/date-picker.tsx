"use client";

import React, { useCallback, useEffect, useId, useImperativeHandle, useRef, useState, forwardRef } from "react";

// DatePickerProps: a composite input (day, month, year) that behaves like a single required input
// for react-hook-form. It exposes its value as a hidden input in YYYY-MM-DD format.
export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue"> {
	/** Optional label rendered above the fields */
	label?: string;
	/** Initial date (overrides today's date). Format: YYYY-MM-DD */
	initialDate?: string;
	/** Minimum allowed year (default 1800) */
	minYear?: number;
	/** Maximum allowed year (default 2199) */
	maxYear?: number;
	/** Callback receiving the assembled date string (YYYY-MM-DD) whenever any segment changes */
	onValueChange?: (value: string) => void;
}

function isValidDateString(str: string | undefined, minYear: number, maxYear: number) {
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

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
	{
		name,
		label,
		initialDate,
		minYear = 1800,
		maxYear = 2199,
		onValueChange,
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
		throw new Error("DatePicker requires a 'name' prop to integrate with forms");
	}

	const today = new Date();
	const defaultYear = today.getFullYear();
	const defaultMonth = today.getMonth() + 1; // 1-12
	const defaultDay = today.getDate();

	const validInitial = isValidDateString(initialDate, minYear, maxYear) ? initialDate : undefined;
	let initialYear: number;
	let initialMonth: number;
	let initialDay: number;

	if (validInitial) {
		const [y, m, d] = (validInitial as string).split("-").map(Number);
		initialYear = y; initialMonth = m; initialDay = d;
	} else {
		initialYear = Math.min(Math.max(defaultYear, minYear), maxYear);
		initialMonth = defaultMonth;
		initialDay = defaultDay; // Already 1-31, acceptable within 1-32 range
	}

	const [year, setYear] = useState<string>(String(initialYear));
	const [month, setMonth] = useState<string>(pad2(initialMonth));
	const [day, setDay] = useState<string>(pad2(initialDay));

	// Hidden input ref (exposed via forwardRef)
	const hiddenRef = useRef<HTMLInputElement | null>(null);
	useImperativeHandle(ref, () => hiddenRef.current as HTMLInputElement, []);

	const internalId = useId();
	const id = providedId || `${name}-date-${internalId}`;
	const dayId = `${id}-day`;
	const monthId = `${id}-month`;
	const yearId = `${id}-year`;

	const assemble = useCallback(
		(y: string, m: string, d: string) => {
			// Normalize inputs: year stays as typed (truncated to 4), month/day -> 2 digits if possible
			const normYear = y.padStart(4, "0").slice(0, 4);
			const mm = m.padStart(2, "0").slice(0, 2);
			const dd = d.padStart(2, "0").slice(0, 2);
			return `${normYear}-${mm}-${dd}`;
		},
		[]
	);

	const updateValue = useCallback(
		(y: string, m: string, d: string) => {
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

			const val = assemble(String(yi), String(mi), String(di));
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
				const synthetic = { target: { name, value: val } } as unknown as React.ChangeEvent<HTMLInputElement>;
				onChange(synthetic);
			}
		},
		[assemble, maxYear, minYear, name, onChange, onValueChange]
	);

	// Initialize hidden input value after mount
	useEffect(() => {
		updateValue(year, month, day);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		if (e.key === "Backspace" && (e.currentTarget.value.length === 0)) {
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
				<label htmlFor={id} className="text-sm font-medium text-gray-800 dark:text-gray-200">
					{label}
					<span className="text-red-500 ml-0.5">*</span>
				</label>
			)}
			<div className="flex items-center gap-2" aria-describedby={`${id}-segments-desc`}>
				<div className="flex items-center gap-1">
					<input
						ref={dayRef}
						id={dayId}
						inputMode="numeric"
						placeholder="DD"
						className="w-14 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 dark:bg-gray-800 dark:border-gray-600"
						value={day}
						onChange={handleDayChange}
						onKeyDown={handleKeyNav}
						aria-label="Day"
						required
					/>
					<span className="select-none text-gray-500">/</span>
					<input
						ref={monthRef}
						id={monthId}
						inputMode="numeric"
						placeholder="MM"
						className="w-14 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 dark:bg-gray-800 dark:border-gray-600"
						value={month}
						onChange={handleMonthChange}
						onKeyDown={handleKeyNav}
						aria-label="Month"
						required
					/>
					<span className="select-none text-gray-500">/</span>
					<input
						ref={yearRef}
						id={yearId}
						inputMode="numeric"
						placeholder="YYYY"
						className="w-20 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 dark:bg-gray-800 dark:border-gray-600"
						value={year}
						onChange={handleYearChange}
						onKeyDown={handleKeyNav}
						aria-label="Year"
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
			<p id={`${id}-segments-desc`} className="sr-only">Enter day, month, and year. Value submitted as YYYY-MM-DD.</p>
		</div>
	);
});

export default DatePicker;



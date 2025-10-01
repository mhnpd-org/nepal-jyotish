"use client";

import React, { useMemo, useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { districtOfNepal, type DistrictOfNepal } from "./district";

export interface PickDistrictProps<TFieldValues extends FieldValues> {
	/** react-hook-form control */
	control: Control<TFieldValues>;
	/** Name of the form field */
	name: Path<TFieldValues>;
	/** Optional field label */
	label?: string;
	/** Display an asterisk */
	required?: boolean;
	/** Tailwind class overrides */
	className?: string;
	/** Placeholder for search input */
	searchPlaceholder?: string;
	/** Disable the widget */
	disabled?: boolean;
	/** Force a selected district externally (will sync into form value) */
	selected?: DistrictOfNepal;
}

/**
 * A searchable dropdown (combination of a text filter + select) listing Nepali districts.
 * - Label for each option: `Zone / District` (English)
 * - Stored form value: `{ lat, long }`
 * - Default selection: Kathmandu (always enforced on mount if empty)
 * - Search filters by zone, english or nepali district names (case-insensitive)
 */
export function PickDistrict<TFieldValues extends FieldValues>(props: PickDistrictProps<TFieldValues>) {
	const {
		control,
		name,
		label = "District",
		required,
		className = "",
		searchPlaceholder = "Search district...",
		disabled = false,
		selected
	} = props;

	const [search, setSearch] = useState("");

	const kathmandu = useMemo(() => districtOfNepal.find(d => d.district_en === "Kathmandu"), []);

	const filtered = useMemo(() => {
		if (!search.trim()) return districtOfNepal;
		const q = search.toLowerCase();
		return districtOfNepal.filter(d =>
			d.zone.toLowerCase().includes(q) ||
			d.district_en.toLowerCase().includes(q) ||
			d.district_np.includes(search)
		);
	}, [search]);

		return (
			<Controller
				name={name}
				control={control}
				// Default to Kathmandu full object
				defaultValue={kathmandu ? (kathmandu as unknown as TFieldValues[typeof name]) : undefined}
				render={({ field, fieldState }) => {
					// Sync externally provided selected district if differs
					if (selected && (!field.value || (field.value as DistrictOfNepal).district_en !== selected.district_en)) {
						field.onChange(selected);
					}

					const current: DistrictOfNepal | undefined = field.value as DistrictOfNepal | undefined;
					const selectedDistrictName = current?.district_en || kathmandu?.district_en || "";

					const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
						const district = districtOfNepal.find(d => d.district_en === e.target.value);
						if (district) field.onChange(district);
					};

					return (
						<div className={`w-full ${className}`}>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								{label}{required && <span className="text-red-500">*</span>}
							</label>
							<div className="flex flex-col gap-2 rounded-md border border-gray-300 p-3 bg-white shadow-sm">
								<input
									type="text"
									value={search}
									onChange={e => setSearch(e.target.value)}
									placeholder={searchPlaceholder}
									className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									disabled={disabled}
								/>
								<select
									value={selectedDistrictName}
									onChange={handleSelectChange}
									disabled={disabled}
									className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									{filtered.length === 0 && (
										<option disabled value="">No matches</option>
									)}
									{filtered.map(d => (
										<option key={d.district_en} value={d.district_en}>
											{d.zone} / {d.district_en}
										</option>
									))}
								</select>
								{fieldState.error && (
									<p className="text-xs text-red-600 mt-1">{fieldState.error.message}</p>
								)}
							</div>
						</div>
					);
				}}
			/>
		);
}

export default PickDistrict;


"use client";

import React, { useMemo } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Select, { SingleValue, StylesConfig, GroupBase, CSSObjectWithLabel } from "react-select";
import type { ControlProps, OptionProps } from "react-select";
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
	/** Placeholder for the select input */
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

	const kathmandu = useMemo(() => districtOfNepal.find(d => d.district_en === "Kathmandu"), []);

	// Map districts to react-select options
	const options = useMemo(() => districtOfNepal.map(d => ({
		value: d.district_en,
		label: `${d.zone} / ${d.district_en}`,
		data: d
	})), []);

	type OptionType = { value: string; label: string; data: DistrictOfNepal };

	const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
		control: (base: CSSObjectWithLabel, state: ControlProps<OptionType, false>) => ({
			...base,
			borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
			boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.35)' : 'none',
			'&:hover': { borderColor: '#3b82f6' },
			fontSize: '0.875rem',
			minHeight: '38px'
		}),
		menu: (base: CSSObjectWithLabel) => ({
			...base,
			zIndex: 60,
			fontSize: '0.875rem'
		}),
		option: (base: CSSObjectWithLabel, state: OptionProps<OptionType, false>) => ({
			...base,
			backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
			color: state.isSelected ? 'white' : '#111827',
			cursor: 'pointer'
		}),
		input: (base: CSSObjectWithLabel) => ({ ...base, fontSize: '0.875rem' }),
		singleValue: (base: CSSObjectWithLabel) => ({ ...base, fontSize: '0.875rem' }),
		placeholder: (base: CSSObjectWithLabel) => ({ ...base, fontSize: '0.875rem', color: '#6b7280' })
	};

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
					// current selection resolved from form state; no separate string needed


					return (
						<div className={`w-full ${className}`}>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								{label}{required && <span className="text-red-500">*</span>}
							</label>
							<Select
								instanceId={`${name}-district-select`}
								isDisabled={disabled}
								options={options}
								menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
								menuPosition="absolute"
								placeholder={searchPlaceholder}
								defaultValue={options.find(o => o.value === (kathmandu?.district_en))}
								value={current ? options.find(o => o.value === current.district_en) : undefined}
								styles={customStyles}
								onChange={(val: SingleValue<{ value: string; label: string; data: DistrictOfNepal }>) => {
									if (val) field.onChange(val.data);
								}}
								classNamePrefix="district-select"
								noOptionsMessage={() => "No matches"}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-600 mt-2">{fieldState.error.message}</p>
							)}
						</div>
					);
				}}
			/>
		);
}

export default PickDistrict;


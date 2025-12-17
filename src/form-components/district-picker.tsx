"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Select, { SingleValue, StylesConfig, GroupBase, CSSObjectWithLabel } from "react-select";
import type { ControlProps, OptionProps } from "react-select";
import { districtOfNepal, type DistrictOfNepal } from "./nepal-districts";

export interface DistrictPickerProps<TFieldValues extends FieldValues> {
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
export function DistrictPicker<TFieldValues extends FieldValues>(props: DistrictPickerProps<TFieldValues>) {
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

	// Portal target must be set client-side to avoid SSR/CSR differences
	const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
	useEffect(() => {
		setPortalTarget(document.body);
	}, []);

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
			borderColor: state.isFocused ? '#f97316' : '#d1d5db', // Orange focus like other inputs
			borderWidth: '2px', // Match our border-2
			borderRadius: '0.5rem', // Match rounded-lg
			boxShadow: state.isFocused ? '0 0 0 2px rgba(249, 115, 22, 0.2)' : 'none', // Orange ring
			'&:hover': { borderColor: '#f97316' }, // Orange hover
			backgroundColor: 'white', // Will be handled by CSS classes for dark mode
			minHeight: '44px', // Match py-2.5 height
			fontSize: '0.875rem', // text-sm for mobile, will be overridden by media query
			paddingLeft: '0.75rem', // px-3 on mobile, will be overridden by media query
			paddingRight: '0.75rem',
			'@media (min-width: 640px)': {
				fontSize: '1rem', // text-base for desktop
				paddingLeft: '1rem', // px-4 on desktop
				paddingRight: '1rem'
			}
		}),
		menu: (base: CSSObjectWithLabel) => ({
			...base,
			zIndex: 60,
			fontSize: '0.875rem',
			borderRadius: '0.5rem',
			border: '2px solid #d1d5db',
			backgroundColor: 'white',
			boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			'@media (min-width: 640px)': {
				fontSize: '1rem'
			}
		}),
		option: (base: CSSObjectWithLabel, state: OptionProps<OptionType, false>) => ({
			...base,
			backgroundColor: state.isSelected 
				? '#f97316' // Orange selected
				: state.isFocused 
					? '#fed7aa' // Orange-100 focused
					: 'white',
			color: state.isSelected ? 'white' : '#111827',
			cursor: 'pointer',
			fontSize: '0.875rem',
			'@media (min-width: 640px)': {
				fontSize: '1rem'
			},
			'&:active': {
				backgroundColor: state.isSelected ? '#ea580c' : '#fdba74' // Orange-600 active
			}
		}),
		input: (base: CSSObjectWithLabel) => ({ 
			...base, 
			fontSize: '0.875rem',
			color: '#111827', // text-gray-900
			'@media (min-width: 640px)': {
				fontSize: '1rem'
			}
		}),
		singleValue: (base: CSSObjectWithLabel) => ({ 
			...base, 
			fontSize: '0.875rem',
			color: '#111827', // text-gray-900
			'@media (min-width: 640px)': {
				fontSize: '1rem'
			}
		}),
		placeholder: (base: CSSObjectWithLabel) => ({ 
			...base, 
			fontSize: '0.875rem', 
			color: '#6b7280', // text-gray-500
			'@media (min-width: 640px)': {
				fontSize: '1rem'
			}
		}),
		indicatorSeparator: (base: CSSObjectWithLabel) => ({
			...base,
			backgroundColor: '#d1d5db'
		}),
		dropdownIndicator: (base: CSSObjectWithLabel) => ({
			...base,
			color: '#6b7280',
			'&:hover': {
				color: '#f97316'
			}
		})
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
							<label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
								{label}{required && <span className="text-red-500 ml-1">*</span>}
							</label>
							<div className="[&_.district-select__control]:!bg-white [&_.district-select__control]:!border-gray-200 [&_.district-select__single-value]:!text-gray-900 [&_.district-select__input]:!text-gray-900">
								<Select
									instanceId={`${name}-district-select`}
									isDisabled={disabled}
									options={options}
									menuPortalTarget={portalTarget}
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
							</div>
							{fieldState.error && (
								<span className="text-red-500 text-xs sm:text-sm mt-1">{fieldState.error.message}</span>
							)}
						</div>
					);
				}}
			/>
		);
}

export default DistrictPicker;


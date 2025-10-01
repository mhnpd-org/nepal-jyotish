"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "@internal/form-elements/date-picker";
import { TimePicker } from "@internal/form-elements/time-picker";
import { PickDistrict } from "@internal/form-elements/pick-district";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@internal/components/card";
import type { DistrictOfNepal } from "@internal/form-elements/district";

interface JanmaFormValues {
	name?: string;
	dateOfBirth: string; // YYYY-MM-DD (from DatePicker hidden input)
	timeOfBirth?: string; // HH:MM:SS (optional)
	placeOfBirth: DistrictOfNepal; // object from PickDistrict
}

export default function JanmaPage() {
	const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<JanmaFormValues>({
		defaultValues: {
			name: "",
			// dateOfBirth populated automatically by DatePicker on mount
			timeOfBirth: "",
			// placeOfBirth defaulted internally to Kathmandu by PickDistrict
		}
	});

	const [submitted, setSubmitted] = useState<JanmaFormValues | null>(null);

		const onSubmit = (data: JanmaFormValues) => {
			setSubmitted(data);
			console.log("Janma form data", data); // For now just log; integrate with API / next step later
		};

	return (
		<main className="w-full mx-auto px-2 sm:px-4 py-10 space-y-10">
			<Card variant="gradient" className="w-full" unpadded>
				<form onSubmit={handleSubmit(onSubmit)} className="relative px-6 sm:px-8 py-6 sm:py-8 space-y-8">
					<CardHeader className="gap-3 pb-6">
						<div className="flex items-center gap-4">
							<div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-lg font-semibold shadow-inner shadow-orange-200/40 ring-1 ring-white/40 dark:ring-white/10">🜚</div>
							<div>
								<CardTitle className="text-2xl">Janma Details</CardTitle>
								<CardDescription className="mt-1">Enter birth details to generate astrological calculations.</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							{/* Name (optional) */}
							<div className="flex flex-col gap-1 w-full">
								<label htmlFor="name" className="text-sm font-medium text-gray-800 dark:text-gray-200">Name</label>
								<input
									id="name"
									type="text"
									placeholder="Enter name (optional)"
									className="rounded-md border border-gray-300/70 dark:border-gray-600 bg-white/90 dark:bg-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:border-orange-400 transition"
									{...register("name")}
								/>
							</div>

							{/* Date of Birth (required) */}
							<div className="flex flex-col gap-1 w-full">
								<DatePicker
									label="Date of Birth"
									required
									{...register("dateOfBirth", { required: "Date of Birth is required" })}
									className=""
								/>
								{errors.dateOfBirth && (
									<p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>
								)}
							</div>

							{/* Time of Birth (optional) */}
							<div className="flex flex-col gap-1 w-full">
								<TimePicker
									control={control}
									name="timeOfBirth"
									label="Time of Birth"
									required={false}
									showSeconds={false}
									className=""
								/>
							</div>

							{/* Place of Birth (required) */}
							<div className="flex flex-col w-full">
								<PickDistrict
									control={control}
									name="placeOfBirth"
									label="Place of Birth"
									required
									className=""
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-500 hover:via-rose-500 hover:to-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-medium shadow-md shadow-orange-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400/60 focus:ring-offset-white dark:focus:ring-offset-gray-950 transition"
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
						<button
							type="reset"
							onClick={() => { setSubmitted(null); }}
							className="text-sm px-5 py-2 rounded-md border border-gray-300/70 dark:border-gray-600 bg-white/70 dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
						>Reset</button>
					</CardFooter>
				</form>
			</Card>

			{submitted && (
				<section className="bg-white/60 dark:bg-gray-900/60 backdrop-blur border border-gray-200/70 dark:border-gray-700/60 rounded-xl p-5 text-xs md:text-sm font-mono overflow-x-auto shadow-sm">
					<h2 className="text-sm font-semibold mb-3 tracking-wide text-gray-700 dark:text-gray-200">Submitted Data</h2>
					<pre className="whitespace-pre-wrap break-words leading-relaxed">{JSON.stringify(submitted, null, 2)}</pre>
				</section>
			)}
		</main>
	);
}

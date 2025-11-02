"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ADDatePicker, BSDatePicker } from "@internal/form-elements/date-picker";
// NepaliDate for AD -> BS conversion when switching calendars
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NepaliDate from "nepali-date-converter";
import { TimePicker } from "@internal/form-elements/time-picker";
import { PickDistrict } from "@internal/form-elements/pick-district";
// translations removed — using static English labels
import {
  districtOfNepal,
  type DistrictOfNepal
} from "@internal/form-elements/district";
import {
  getFormDetails,
  setFormDetails
} from "@internal/utils/get-form-details";

export interface JanmaFormValues {
  name?: string;
  dateOfBirth: string; // Always stored in AD (YYYY-MM-DD)
  calendarType: "AD" | "BS";
  timeOfBirth?: string;
  placeOfBirth: DistrictOfNepal;
}

export default function JanmaPage() {
  const router = useRouter();
  
  // Do NOT access localStorage during initial render; hydration handled in useEffect.
  const isJanma = (v: unknown): v is JanmaFormValues => {
    if (!v || typeof v !== "object") return false;
    return Object.prototype.hasOwnProperty.call(
      v as Record<string, unknown>,
      "dateOfBirth"
    );
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<JanmaFormValues>({
    defaultValues: {
      name: "",
      dateOfBirth: format(new Date(), "yyyy-MM-dd"),
      calendarType: "AD",
      timeOfBirth: format(new Date(), "HH:mm:ss"),
      placeOfBirth: districtOfNepal.find((d) => d.district_en === "Kathmandu")
    }
  });

  // After mount (client), re-hydrate with any stored values (SSR got undefined).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const stored = getFormDetails() as JanmaFormValues | undefined;
    if (stored && isJanma(stored)) {
      reset(stored);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: JanmaFormValues) => {
    setFormDetails(data);
    router.push("/astro/traditional");
  };

  // Auto-persist (debounced) whenever values change after hydration
  const watchedAll = watch();
  useEffect(() => {
    if (!hydrated) return;
    const handle = setTimeout(() => {
      setFormDetails(watchedAll);
    }, 300);
    return () => clearTimeout(handle);
  }, [watchedAll, hydrated]);

  const dateValue = watch("dateOfBirth");
  const calendarValue = watch("calendarType");

  // Helper: convert stored AD date (YYYY-MM-DD) to BS date string for initializing BS picker
  const adToBs = (ad: string | undefined): string | undefined => {
    if (!ad || !/^\d{4}-\d{2}-\d{2}$/.test(ad)) return undefined;
    try {
      const [y, m, d] = ad.split("-").map(Number);
      const nd = new NepaliDate(new Date(y, m - 1, d));
      if (nd.format) {
        return nd.format("YYYY-MM-DD") as string;
      }
      // Fallback if format not present; approximate using getters
      return `${nd.getYear()}-${String(nd.getMonth() + 1).padStart(2, "0")}-${String(nd.getDate()).padStart(2, "0")}`;
    } catch {
      return undefined;
    }
  };

  // static English labels (previously in en.json)
  const labels = {
    title: 'Janma Details',
    description: 'Enter birth details below. Fields are prefilled with current Kathmandu/Nepal date, time and coordinates.',
    name: 'Full name (optional)',
    date_of_birth: 'Date of Birth',
    ad: 'AD',
    bs: 'BS',
    datetime_required: 'Date & time is required',
    time_of_birth: 'Time of Birth',
    place_of_birth: 'Place of Birth',
    submit: 'Submit'
  } as const;
  return (
    <main className="w-full px-2 sm:px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl"
      >
        <div className="rounded-xl border border-white/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md shadow-lg px-5 sm:px-7 py-6 flex flex-col gap-8">
          {/* Header inside card */}
          <header className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold shadow ring-1 ring-white/40 dark:ring-white/10">
                🜚
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-wide text-gray-800 dark:text-gray-100">
                  {labels.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-snug max-w-prose">
                  {labels.description}
                </p>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-6">
              {/* Name (optional) */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="name" className="text-sm font-medium text-gray-800 dark:text-gray-200">{labels.name}</label>
                <input
                  id="name"
                  type="text"
                  placeholder={labels.name}
                  className="rounded-md border border-gray-300/70 dark:border-gray-600 bg-white/90 dark:bg-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:border-orange-400 transition"
                  {...register("name")}
                />
              </div>

              {/* Date of Birth (required) */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {labels.date_of_birth} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                  {/* Calendar toggle */}
                  <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm h-10">
                    {(["AD", "BS"] as const).map((cal) => (
                      <button
                        key={cal}
                        type="button"
                        onClick={() => {
                          if (calendarValue !== cal) {
                            setValue("calendarType", cal, { shouldDirty: true });
                          }
                        }}
                        className={`h-full px-4 text-xs sm:text-sm font-medium flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                          calendarValue === cal
                            ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        aria-pressed={calendarValue === cal}
                      >
                        {cal === 'AD' ? labels.ad : labels.bs}
                      </button>
                    ))}
                  </div>
                  {/* Date Picker (no internal label now) */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {hydrated ? (
                      calendarValue === "AD" ? (
                        <ADDatePicker
                          required
                          valueDate={dateValue}
                          maxYear={2099}
                          minYear={1900}
                          {...register("dateOfBirth", {
                            required: labels.datetime_required
                          })}
                        />
                      ) : (
                        <BSDatePicker
                          required
                          initialDate={adToBs(dateValue)}
                          maxYear={2090}
                          minYear={2000}
                          {...register("dateOfBirth", {
                            required: labels.datetime_required
                          })}
                        />
                      )
                    ) : (
                      <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                  </div>
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              {/* Hidden calendar type field for persistence (kept for RHF) */}
              <input type="hidden" {...register("calendarType")} />

              {/* Time of Birth (optional) */}
              <div className="flex flex-col gap-1 w-full">
                <TimePicker control={control} name="timeOfBirth" label={labels.time_of_birth} required={false} showSeconds={false} className="" />
              </div>

              {/* Place of Birth (required) */}
              <div className="flex flex-col w-full">
                {hydrated ? (
                  <PickDistrict control={control} name="placeOfBirth" label={labels.place_of_birth} required className="" />
                ) : (
                  <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>

            {/* Submit button inside card */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-500 hover:via-rose-500 hover:to-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-medium shadow-md shadow-orange-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400/60 focus:ring-offset-white dark:focus:ring-offset-gray-950 transition"
              >
                {isSubmitting ? '...' : labels.submit}
              </button>
            </div>
        </div>
      </form>
    </main>
  );
}

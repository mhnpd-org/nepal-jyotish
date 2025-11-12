"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { EnglishDatePicker } from "@internal/form-components/english-date-picker";
import { NepaliDatePickerComponent } from "@internal/form-components/nepali-date-picker";
import { TimePicker } from "@internal/form-components/time-picker";
import { CalendarToggle } from "@internal/form-components/calendar-toggle";
import { DistrictPicker } from "@internal/form-components/district-picker";
// translations removed — using static English labels
import {
  districtOfNepal,
  type DistrictOfNepal
} from "@internal/form-components/nepal-districts";
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

  // static English labels (previously in en.json)
  const labels = {
    title: 'जन्म विवरण',
    description: 'तल जन्म विवरण प्रविष्ट गर्नुहोस्। फिल्डहरू हालको काठमाडौं/नेपाल मिति, समय र निर्देशांकहरूसँग पूर्व भरिएका छन्।',
    name: 'पूरा नाम (वैकल्पिक)',
    date_of_birth: 'जन्म मिति',
    ad: 'ई.स.',
    bs: 'वि.स.',
    datetime_required: 'मिति र समय आवश्यक छ',
    time_of_birth: 'जन्म समय',
    place_of_birth: 'जन्म स्थान',
    submit: 'पेश गर्नुहोस्'
  } as const;
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl lg:max-w-3xl mx-auto"
      >
        {/* Header - clean and simple */}
        <header className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {labels.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            {labels.description}
          </p>
        </header>

        {/* Simple form without card wrapper */}
        <div className="flex flex-col gap-4 sm:gap-6">
            {/* Name (optional) */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">{labels.name}</label>
              <input
                id="name"
                type="text"
                placeholder={labels.name}
                className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 sm:px-4 py-2.5 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
                {...register("name")}
              />
            </div>

            {/* Date of Birth (required) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                {labels.date_of_birth} <span className="text-red-500">*</span>
              </label>
              
              {/* Calendar toggle */}
              <CalendarToggle
                value={calendarValue}
                onChange={(cal) => setValue("calendarType", cal, { shouldDirty: true })}
                labels={{ ad: labels.ad, bs: labels.bs }}
                className="mb-3"
              />

              {/* Date Picker */}
              <div className="relative">
                {hydrated ? (
                  calendarValue === "AD" ? (
                    <EnglishDatePicker
                      control={control}
                      name="dateOfBirth"
                      required={true}
                      className=""
                    />
                  ) : (
                    <NepaliDatePickerComponent
                      control={control}
                      name="dateOfBirth"
                      required={true}
                      className=""
                    />
                  )
                ) : (
                  <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>
            {/* Hidden calendar type field for persistence (kept for RHF) */}
            <input type="hidden" {...register("calendarType")} />

            {/* Time of Birth (required) */}
            <div className="flex flex-col gap-2 w-full">
              {hydrated ? (
                <TimePicker 
                  control={control} 
                  name="timeOfBirth" 
                  label={labels.time_of_birth} 
                  required={true}
                />
              ) : (
                <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
            </div>

            {/* Place of Birth (required) */}
            <div className="flex flex-col w-full">
              {hydrated ? (
                <DistrictPicker control={control} name="placeOfBirth" label={labels.place_of_birth} required className="" />
              ) : (
                <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-600 hover:via-rose-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg shadow-orange-300/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
            >
              {isSubmitting ? 'पेश गर्दै...' : labels.submit}
            </button>
          </div>
      </form>
    </main>
  );
}

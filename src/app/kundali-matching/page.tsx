"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { EnglishDatePicker } from "@internal/form-components/english-date-picker";
import { NepaliDatePickerComponent } from "@internal/form-components/nepali-date-picker";
import { TimePicker } from "@internal/form-components/time-picker";
import { CalendarToggle } from "@internal/form-components/calendar-toggle";
import { DistrictPicker } from "@internal/form-components/district-picker";
import {
  districtOfNepal,
  type DistrictOfNepal,
} from "@internal/form-components/nepal-districts";
import { matchKundali } from "@mhnpd-org/panchang";
import type { MatchKundaliResult, JanmaDetails } from "@mhnpd-org/panchang";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import MatchingResultsDisplay from "./results-display";

interface PersonFormValues {
  name?: string;
  dateOfBirth: string;
  calendarType: "AD" | "BS";
  timeOfBirth?: string;
  placeOfBirth: DistrictOfNepal;
}

interface MatchingFormValues {
  male: PersonFormValues;
  female: PersonFormValues;
}

const defaultPersonValues: PersonFormValues = {
  name: "",
  dateOfBirth: format(new Date(), "yyyy-MM-dd"),
  calendarType: "AD",
  timeOfBirth: format(new Date(), "HH:mm:ss"),
  placeOfBirth: districtOfNepal.find((d) => d.district_en === "Kathmandu")!,
};

export default function KundaliMatchingPage() {
  const [hydrated, setHydrated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [matchingResult, setMatchingResult] = useState<MatchKundaliResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<MatchingFormValues>({
    defaultValues: {
      male: defaultPersonValues,
      female: defaultPersonValues,
    },
  });

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("kundali-matching-form");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse stored form data", e);
      }
    }
    setHydrated(true);
  }, [reset]);

  // Auto-persist form data
  const watchedAll = watch();
  useEffect(() => {
    if (!hydrated) return;
    const handle = setTimeout(() => {
      localStorage.setItem("kundali-matching-form", JSON.stringify(watchedAll));
    }, 300);
    return () => clearTimeout(handle);
  }, [watchedAll, hydrated]);

  const onSubmit = async (data: MatchingFormValues) => {
    setIsCalculating(true);
    setShowResults(false);

    try {
      const maleDetails: JanmaDetails = {
        dateStr: data.male.dateOfBirth,
        timeStr: data.male.timeOfBirth || "12:00:00",
        latitude: data.male.placeOfBirth.lat,
        longitude: data.male.placeOfBirth.long,
        timeZone: "Asia/Kathmandu",
      };

      const femaleDetails: JanmaDetails = {
        dateStr: data.female.dateOfBirth,
        timeStr: data.female.timeOfBirth || "12:00:00",
        latitude: data.female.placeOfBirth.lat,
        longitude: data.female.placeOfBirth.long,
        timeZone: "Asia/Kathmandu",
      };

      const result = await matchKundali(maleDetails, femaleDetails);
      setMatchingResult(result);
      setShowResults(true);
    } catch (error) {
      console.error("Error calculating kundali match:", error);
      alert("कुण्डली मिलान गर्दा त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setMatchingResult(null);
    reset({
      male: defaultPersonValues,
      female: defaultPersonValues,
    });
    localStorage.removeItem("kundali-matching-form");
  };

  const maleCalendarValue = watch("male.calendarType");
  const femaleCalendarValue = watch("female.calendarType");

  if (showResults && matchingResult) {
    return (
      <>
        <AppHeader variant="solid" language="np" currentPage="services" />
        <MatchingResultsDisplay
          result={matchingResult}
          onReset={handleReset}
          maleData={watchedAll.male}
          femaleData={watchedAll.female}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppHeader variant="solid" language="np" currentPage="services" />
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-6xl mx-auto"
        >
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
            कुण्डली मिलान
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            विवाहको लागि वैदिक ज्योतिष अनुसार कुण्डली मिलान। अष्टकूट गुण मिलान, दोष विश्लेषण र विवाह संकेतकहरू।
          </p>
        </header>

        {/* Two Column Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Male Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-200 mb-6 flex items-center gap-2">
              <span className="text-2xl">👨</span>
              वरको विवरण
            </h2>

            <div className="flex flex-col gap-5">
              {/* Male Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="male-name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  पूरा नाम (वैकल्पिक)
                </label>
                <input
                  id="male-name"
                  type="text"
                  placeholder="वरको नाम"
                  className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                  {...register("male.name")}
                />
              </div>

              {/* Male Date of Birth */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  जन्म मिति <span className="text-red-500">*</span>
                </label>
                <CalendarToggle
                  value={maleCalendarValue}
                  onChange={(cal) => setValue("male.calendarType", cal, { shouldDirty: true })}
                  labels={{ ad: "ई.स.", bs: "वि.स." }}
                  className="mb-3"
                />
                <div className="relative">
                  {hydrated ? (
                    maleCalendarValue === "AD" ? (
                      <EnglishDatePicker
                        control={control}
                        name="male.dateOfBirth"
                        required={true}
                      />
                    ) : (
                      <NepaliDatePickerComponent
                        control={control}
                        name="male.dateOfBirth"
                        required={true}
                      />
                    )
                  ) : (
                    <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Male Time of Birth */}
              <div className="flex flex-col gap-2">
                {hydrated ? (
                  <TimePicker
                    control={control}
                    name="male.timeOfBirth"
                    label="जन्म समय"
                    required={true}
                  />
                ) : (
                  <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>

              {/* Male Place of Birth */}
              <div className="flex flex-col">
                {hydrated ? (
                  <DistrictPicker
                    control={control}
                    name="male.placeOfBirth"
                    label="जन्म स्थान"
                    required
                  />
                ) : (
                  <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Female Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-pink-100 dark:border-pink-900">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-900 dark:text-pink-200 mb-6 flex items-center gap-2">
              <span className="text-2xl">👩</span>
              वधुको विवरण
            </h2>

            <div className="flex flex-col gap-5">
              {/* Female Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="female-name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  पूरा नाम (वैकल्पिक)
                </label>
                <input
                  id="female-name"
                  type="text"
                  placeholder="वधुको नाम"
                  className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-all"
                  {...register("female.name")}
                />
              </div>

              {/* Female Date of Birth */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  जन्म मिति <span className="text-red-500">*</span>
                </label>
                <CalendarToggle
                  value={femaleCalendarValue}
                  onChange={(cal) => setValue("female.calendarType", cal, { shouldDirty: true })}
                  labels={{ ad: "ई.स.", bs: "वि.स." }}
                  className="mb-3"
                />
                <div className="relative">
                  {hydrated ? (
                    femaleCalendarValue === "AD" ? (
                      <EnglishDatePicker
                        control={control}
                        name="female.dateOfBirth"
                        required={true}
                      />
                    ) : (
                      <NepaliDatePickerComponent
                        control={control}
                        name="female.dateOfBirth"
                        required={true}
                      />
                    )
                  ) : (
                    <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Female Time of Birth */}
              <div className="flex flex-col gap-2">
                {hydrated ? (
                  <TimePicker
                    control={control}
                    name="female.timeOfBirth"
                    label="जन्म समय"
                    required={true}
                  />
                ) : (
                  <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>

              {/* Female Place of Birth */}
              <div className="flex flex-col">
                {hydrated ? (
                  <DistrictPicker
                    control={control}
                    name="female.placeOfBirth"
                    label="जन्म स्थान"
                    required
                  />
                ) : (
                  <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="submit"
            disabled={isCalculating || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 text-base font-semibold shadow-lg shadow-rose-300/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                गणना गर्दै...
              </>
            ) : (
              "कुण्डली मिलान गर्नुहोस्"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 text-base font-semibold transition-all"
          >
            नयाँ फारम
          </button>
        </div>
      </form>
    </main>
    <Footer />
    </>
  );
}

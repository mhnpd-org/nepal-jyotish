"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { DatePicker } from "@internal/form-elements/date-picker";
import { TimePicker } from "@internal/form-elements/time-picker";
import { PickDistrict } from "@internal/form-elements/pick-district";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from "@internal/components/card";
import {
  districtOfNepal,
  type DistrictOfNepal
} from "@internal/form-elements/district";
import {
  getFormDetails,
  setFormDetails
} from "@internal/utils/get-form-details";

interface JanmaFormValues {
  name?: string;
  dateOfBirth: string; // Always stored in AD (YYYY-MM-DD)
  calendarType: "AD" | "BS";
  timeOfBirth?: string;
  placeOfBirth: DistrictOfNepal;
}

export default function JanmaPage() {
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

  const [submitted, setSubmitted] = useState<JanmaFormValues | null>(null);

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
    setSubmitted(data);
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

  return (
    <main className="w-full mx-auto px-2 sm:px-4 py-10 space-y-10">
      <Card variant="gradient" className="w-full" unpadded>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative px-6 sm:px-8 py-6 sm:py-8 space-y-8"
        >
          <CardHeader className="gap-3 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-lg font-semibold shadow-inner shadow-orange-200/40 ring-1 ring-white/40 dark:ring-white/10">
                🜚
              </div>
              <div>
                <CardTitle className="text-2xl">Janma Details</CardTitle>
                <CardDescription className="mt-1">
                  Enter birth details to generate astrological calculations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Name (optional) */}
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Name
                </label>
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
                {hydrated && (
                  <DatePicker
                    label="Date of Birth"
                    required
                    valueDate={dateValue}
                    calendarValue={calendarValue}
                    initialCalendar={calendarValue}
                    onCalendarChange={(cal) => {
                      setValue("calendarType", cal, { shouldDirty: true });
                    }}
                    {...register("dateOfBirth", {
                      required: "Date of Birth is required"
                    })}
                    className=""
                  />
                )}
                {!hydrated && (
                  <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              {/* Hidden calendar type field for persistence */}
              <input type="hidden" {...register("calendarType")} />

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
                {hydrated ? (
                  <PickDistrict
                    control={control}
                    name="placeOfBirth"
                    label="Place of Birth"
                    required
                    className=""
                  />
                ) : (
                  <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
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
          </CardFooter>
        </form>
      </Card>

      {submitted && (
        <section className="bg-white/60 dark:bg-gray-900/60 backdrop-blur border border-gray-200/70 dark:border-gray-700/60 rounded-xl p-5 text-xs md:text-sm font-mono overflow-x-auto shadow-sm">
          <h2 className="text-sm font-semibold mb-3 tracking-wide text-gray-700 dark:text-gray-200">
            Submitted Data
          </h2>
          <pre className="whitespace-pre-wrap break-words leading-relaxed">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}

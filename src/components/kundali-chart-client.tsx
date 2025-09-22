"use client";
import React, { useEffect, useState } from "react";
import VedicChart from "./diamond-lagna-chart";
import type { AstronomicalCalculationResult } from "@internal/types/kundali-types";

export default function KundaliChartClient() {
  const [data, setData] = useState<AstronomicalCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const body = {
      date: "1990-07-15",
      time: "14:30:00",
      latitude: 27.7172,
      longitude: 85.324,
      timezone: "Asia/Kathmandu",
    };

    async function fetchKundali() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/kundali", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err?.message || `Error ${res.status}`);
          setLoading(false);
          return;
        }
        const json = (await res.json()) as AstronomicalCalculationResult;
        setData(json);
      } catch (e: unknown) {
        let msg = String(e);
        if (typeof e === "object" && e !== null) {
          const maybe = e as { message?: unknown };
          if (maybe.message && typeof maybe.message === "string") {
            msg = maybe.message;
          }
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchKundali();
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {loading && <div>Loading Kundali...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div>
          <VedicChart data={data} size={480} title="Generated Kundali" />
        </div>
      )}
    </div>
  );
}

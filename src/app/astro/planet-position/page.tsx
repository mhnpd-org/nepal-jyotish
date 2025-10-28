"use client";
import React from "react";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, Kundali, PlanetCombinedInfo, PlanetsInTimeFrameResult } from "@mhnpd-org/panchang";
import { translateSanskritSafe } from "@internal/lib/devanagari";

// Helper to render a vedic styled cell (sanskrit focus)
const SanskritCell: React.FC<{ value: string | number | undefined | null }> = ({ value }) => (
  <span className="font-medium tracking-wide">{translateSanskritSafe(String(value ?? ""))}</span>
);
const TS = translateSanskritSafe;

export default function PlanetPositionsPage() {
  const [kundali, setKundali] = React.useState<Kundali | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      const details = getJanmaDetails();
      if (!details) {
        setError("Missing birth details. Redirecting...");
        window.location.replace("/astro/janma");
        return;
      }
      try {
        const k = await getKundali(details);
        if (mounted) setKundali(k);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load planetary data");
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!kundali) return <div>Loading planetary positions...</div>;

  const planets: PlanetsInTimeFrameResult = kundali.planets;

  const rows = Object.keys(planets) as (keyof PlanetsInTimeFrameResult)[];

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-red-700">
          {TS("ग्रह स्थितिः")}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          जन्मकाले ग्रहाणां निरयन राशिस्थानं तथा नक्षत्र-पाद विवरणम्।
        </p>
      </header>
      <div className="overflow-x-auto rounded-lg border border-red-200/50 bg-red-50/20 p-2 sm:p-3">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-red-50 via-amber-50 to-red-50 text-red-700">
              <th className="px-2 py-1 border border-red-200 font-semibold text-left">{TS("ग्रहः")}</th>
              <th className="px-2 py-1 border border-red-200 font-semibold text-left whitespace-nowrap">{TS("राशि")} <span className="font-normal text-[10px] text-red-500">(D°M′S″)</span></th>
              <th className="px-2 py-1 border border-red-200 font-semibold text-left">{TS("नक्षत्र")}</th>
              <th className="px-2 py-1 border border-red-200 font-semibold text-left">{TS("पादः")}</th>
              <th className="px-2 py-1 border border-red-200 font-semibold text-left">{TS("नक्षत्रेशः")}</th>
              <th className="px-2 py-1 border border-red-200 font-semibold text-left whitespace-nowrap">{TS("दीर्घा 360°")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(key => {
              const g = planets[key] as PlanetCombinedInfo | undefined;
              if (!g) return null;
              const rowHighlight = rows.indexOf(key) % 2 === 0 ? 'bg-white/70' : 'bg-red-50/40';
              return (
                <tr key={String(key)} className={`${rowHighlight} hover:bg-amber-100/60 transition-colors`}> 
                  <td className="px-2 py-1 border border-red-200 font-semibold text-red-700"><SanskritCell value={key} /></td>
                  <td className="px-2 py-1 border border-red-200 whitespace-nowrap">
                    <SanskritCell value={g.rashi} />&nbsp;
                    <SanskritCell value={g.siderealLonDMS30} />
                  </td>
                  <td className="px-2 py-1 border border-red-200"><SanskritCell value={g.nakshatra} /></td>
                  <td className="px-2 py-1 border border-red-200"><SanskritCell value={g.pada} /></td>
                  <td className="px-2 py-1 border border-red-200"><SanskritCell value={g.nakshatraLord} /></td>
                  <td className="px-2 py-1 border border-red-200"><SanskritCell value={g.siderealLonDMS360} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-[11px] text-gray-500 mt-2">टीप्: निरयन (sidereal) दिगंशाः दर्शिताः।</p>
      </div>
    </div>
  );
}

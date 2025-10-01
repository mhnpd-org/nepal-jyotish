"use client";
import React from "react";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, KundaliResult, PlanetCombinedInfo, PlanetsInTimeFrameResult } from "@mhnpd/panchang";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@internal/components/card";
import { translateSanskritSafe } from "@internal/lib/devanagari";

// Helper to render a vedic styled cell (sanskrit focus)
const SanskritCell: React.FC<{ value: string | number | undefined | null }> = ({ value }) => (
  <span className="font-medium tracking-wide">{translateSanskritSafe(String(value ?? ""))}</span>
);
const TS = translateSanskritSafe;

export default function PlanetPositionsPage() {
  const [kundali, setKundali] = React.useState<KundaliResult | null>(null);
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ग्रह स्थितिः (Planetary Positions)</CardTitle>
          <CardDescription>
            जन्मकाले ग्रहाणां निरयन (sidereal) राशिस्थानं तथा नक्षत्रादि विवरणम्।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-red-700/60 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-red-50 text-red-800">
                  <th className="px-2 py-1 border border-red-700/40">{TS("ग्रहः")}</th>
                  <th className="px-2 py-1 border border-red-700/40">{TS("राशि (D°M′S″)")}</th>
                  <th className="px-2 py-1 border border-red-700/40">{TS("नक्षत्र")}</th>
                  <th className="px-2 py-1 border border-red-700/40">{TS("पादः")}</th>
                  <th className="px-2 py-1 border border-red-700/40">{TS("नक्षत्रेशः")}</th>
                  <th className="px-2 py-1 border border-red-700/40">{TS("दीर्घा (360°)")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(key => {
                  const g = planets[key] as PlanetCombinedInfo | undefined;
                  if (!g) return null;
                  return (
                    <tr key={String(key)} className="even:bg-white odd:bg-amber-50/40 hover:bg-amber-100/60 transition-colors">
                      <td className="px-2 py-1 border border-red-700/20 font-semibold text-red-800"><SanskritCell value={key} /></td>
                      <td className="px-2 py-1 border border-red-700/20 whitespace-nowrap">
                        <SanskritCell value={g.rashi} />&nbsp;
                        <SanskritCell value={g.siderealLonDMS30} />
                      </td>
                      <td className="px-2 py-1 border border-red-700/20"><SanskritCell value={g.nakshatra} /></td>
                      <td className="px-2 py-1 border border-red-700/20"><SanskritCell value={g.pada} /></td>
                      <td className="px-2 py-1 border border-red-700/20"><SanskritCell value={g.nakshatraLord} /></td>
                      <td className="px-2 py-1 border border-red-700/20"><SanskritCell value={g.siderealLonDMS360} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[11px] text-gray-500 mt-2">टीप्: निरयन (sidereal) दिगंशाः दर्शिताः।</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

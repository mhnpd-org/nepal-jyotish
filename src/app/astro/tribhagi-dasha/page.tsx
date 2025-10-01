"use client";
import React from "react";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, KundaliResult, TribhagiDasha } from "@mhnpd/panchang";
import { Card, CardHeader, CardTitle, CardContent } from "@internal/components/card";
import { translateSanskritSafe } from "@internal/lib/devanagari";
import { astroTranslate } from "@internal/lib/astro-translator";

interface DashaItemProps { item: TribhagiDasha; index: number; }
const DashaItem: React.FC<DashaItemProps> = ({ item, index }) => {
  return (
    <li className="relative pl-8 py-5 group">
      <span className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-400 via-rose-400 to-pink-400" />
      <span className="absolute left-0 top-6 h-6 w-6 rounded-full bg-white border-2 border-rose-500 flex items-center justify-center text-[10px] font-bold text-rose-600 shadow group-hover:scale-105 transition-transform">
        {translateSanskritSafe(index + 1 + "")}
      </span>
      <div className="flex flex-col gap-1 text-[15px] sm:text-base leading-relaxed">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-rose-700 tracking-wide">
            {translateSanskritSafe(item.dashaLord)} {astroTranslate("Tribhagi")} {astroTranslate("mahadasha")}
          </h3>
          <span className="text-xs sm:text-sm font-medium text-gray-600 bg-rose-100/70 px-2 py-0.5 rounded">
            {translateSanskritSafe(item.startDateInBs)} — {translateSanskritSafe(item.endDateInBs)}
          </span>
        </div>
        <div className="text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-1">
          <span><b>{astroTranslate("वर्ष")}</b>: {translateSanskritSafe(item.remainingYears.toFixed(2))}</span>
          <span><b>{astroTranslate("मास")}</b>: {translateSanskritSafe(item.remainingMonths.toString())}</span>
          <span><b>{astroTranslate("दिन")}</b>: {translateSanskritSafe(item.remainingDays.toString())}</span>
          <span><b>{astroTranslate("योग")}</b>: {translateSanskritSafe(item.cumulativeYears.toFixed(2))}</span>
        </div>
        <div className="text-xs sm:text-sm italic text-gray-500">
          AD: {item.startDateInAd.toDateString()} – {item.endDateInAd.toDateString()}
        </div>
      </div>
    </li>
  );
};

export default function TribhagiDashaVerticalPage() {
  const [kundali, setKundali] = React.useState<KundaliResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const details = getJanmaDetails();
    if (!details) {
      window.location.replace("/astro/janma");
      return;
    }
    (async () => {
      try {
        const k = await getKundali(details);
        if (mounted) setKundali(k);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load dasha");
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!kundali) return <div>Loading Tribhagi Dasha...</div>;

  const list: TribhagiDasha[] = kundali.tribhagiDasa;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{translateSanskritSafe("त्रिभागि महादशा क्रम")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative">
            {list.map((d, i) => <DashaItem key={d.dashaLord + i} item={d} index={i} />)}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

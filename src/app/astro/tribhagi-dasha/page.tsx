"use client";
import React from "react";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, Kundali, TribhagiDasha } from "@mhnpd/panchang";
import { translateSanskritSafe } from "@internal/lib/devanagari";
import { astroTranslate } from "@internal/lib/astro-translator";

interface DashaItemProps { item: TribhagiDasha; index: number; }

const AntardashaTable: React.FC<{ data: NonNullable<TribhagiDasha['antardashas']> }>= ({ data }) => {
  if (!data.length) return null;
  return (
    <div className="mt-4 border border-rose-200 rounded-md overflow-hidden bg-white/60 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
            <tr className="text-rose-700">
              <th className="border border-rose-200 px-2 py-1 font-semibold">#</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold">{astroTranslate("antardasha") || "अन्तर्दशा"}</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold whitespace-nowrap">{astroTranslate("अवधि (BS)")}</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold">{astroTranslate("वर्ष")}</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold">{astroTranslate("मास")}</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold">{astroTranslate("दिन")}</th>
              <th className="border border-rose-200 px-2 py-1 font-semibold">{astroTranslate("योग")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ad, i) => {
              const rowHighlight = ad.isCurrent ? "bg-rose-100/70" : i % 2 === 0 ? "bg-white" : "bg-rose-50/40";
              return (
                <tr key={ad.antardashaLord + i} className={`${rowHighlight} transition-colors`}> 
                  <td className="border border-rose-200 px-2 py-1 font-medium text-rose-600">{translateSanskritSafe((i+1)+"")}</td>
                  <td className="border border-rose-200 px-2 py-1 font-semibold text-rose-700">{translateSanskritSafe(ad.antardashaLord)}</td>
                  <td className="border border-rose-200 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">{translateSanskritSafe(ad.startDateInBs)} – {translateSanskritSafe(ad.endDateInBs)}</td>
                  <td className="border border-rose-200 px-2 py-1">{translateSanskritSafe(ad.durationYears.toFixed(2))}</td>
                  <td className="border border-rose-200 px-2 py-1">{translateSanskritSafe(ad.durationMonths.toString())}</td>
                  <td className="border border-rose-200 px-2 py-1">{translateSanskritSafe(ad.durationDays.toString())}</td>
                  <td className="border border-rose-200 px-2 py-1 font-medium">{translateSanskritSafe(ad.cumulativeYearsInParent.toFixed(2))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-1 text-[10px] sm:text-[11px] text-gray-500 border-t border-rose-200 bg-rose-50/60 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-rose-300" /> {astroTranslate("Current")} {astroTranslate("antardasha") || "अन्तर्दशा"}
      </div>
    </div>
  );
};

const DashaItem: React.FC<DashaItemProps> = ({ item, index }) => {
  const [open, setOpen] = React.useState<boolean>(Boolean(item.isCurrent));
  const hasAntar = (item.antardashas && item.antardashas.length > 0);

  // Ensure that if an item is marked current later (e.g., async enhancement), it auto-expands
  React.useEffect(() => {
    if (item.isCurrent) setOpen(true);
  }, [item.isCurrent]);
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
          {hasAntar && (
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="ml-auto inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-rose-700 bg-rose-100/70 hover:bg-rose-200/70 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400/50"
              aria-expanded={open}
            >
              <span className={`transform transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">▶</span>
              {astroTranslate("antardasha") || "अन्तर्दशा"}
            </button>
          )}
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
        {hasAntar && open && item.antardashas && (
          <AntardashaTable data={item.antardashas} />
        )}
      </div>
    </li>
  );
};

export default function TribhagiDashaVerticalPage() {
  const [kundali, setKundali] = React.useState<Kundali | null>(null);
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
  <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-rose-700">
          {translateSanskritSafe("त्रिभागि महादशा क्रम")}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          {astroTranslate("Tribhagi")} {astroTranslate("mahadasha")} {astroTranslate("overview") || "क्रम र यसको अन्तर्दशा विवरण"}
        </p>
      </header>
      <ol className="relative divide-y divide-rose-100/60 border border-rose-200/40 rounded-lg bg-rose-50/20 dark:bg-rose-50/10 p-2 sm:p-3">
        {list.map((d, i) => (
          <DashaItem key={d.dashaLord + i} item={d} index={i} />
        ))}
      </ol>
      <p className="text-[11px] sm:text-xs text-gray-500 italic pt-1">
        {astroTranslate("Current")} {astroTranslate("antardasha") || "अन्तर्दशा"} {astroTranslate("highlighted") || "हल्का रङ्गमा देखाइएको छ"}.
      </p>
    </div>
  );
}

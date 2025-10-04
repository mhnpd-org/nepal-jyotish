"use client";
import React from 'react';
import { getJanmaDetails } from '@internal/utils/get-form-details';
import { getKundali, KundaliResult, PlanetCombinedInfo, PlanetsInTimeFrameResult } from '@mhnpd/panchang';
import { translateSanskritSafe } from '@internal/lib/devanagari';

// ---------- UI PRIMITIVES ----------
interface KV { label: string; value: React.ReactNode; hint?: React.ReactNode; }
const KVGrid: React.FC<{ items: KV[]; cols?: string }>= ({ items, cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' }) => (
  <dl className={`grid gap-4 ${cols}`}>
    {items.map((i) => (
      <div key={i.label} className="group relative pl-3 border-l-2 border-gradient-to-b from-orange-400 to-pink-500 border-amber-300/60">
        <dt className="text-[11px] uppercase tracking-wide font-medium text-gray-500">{i.label}</dt>
        <dd className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5 flex flex-wrap gap-1 items-baseline">
          {i.value}
          {i.hint && <span className="text-[10px] font-normal text-gray-400">{i.hint}</span>}
        </dd>
      </div>
    ))}
  </dl>
);

const Section: React.FC<{ title: string; children: React.ReactNode; description?: string }>= ({ title, description, children }) => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase flex items-center gap-2">
        <span className="h-4 w-1 rounded bg-gradient-to-b from-orange-400 via-rose-500 to-pink-500" />{title}
      </h2>
      {description && <p className="text-[12px] text-gray-500 leading-snug max-w-prose">{description}</p>}
    </header>
    {children}
  </section>
);

const SoftPanel: React.FC<{ tone?: 'red' | 'rose' | 'fuchsia'; children: React.ReactNode; title: string }>= ({ tone = 'red', children, title }) => {
  const toneStyles: Record<string,string> = {
    red: 'from-red-50 to-amber-50 border-red-200/70',
    rose: 'from-rose-50 to-pink-50 border-rose-200/70',
    fuchsia: 'from-fuchsia-50 to-pink-50 border-fuchsia-200/70',
  };
  const textTone: Record<string,string> = { red: 'text-red-700', rose: 'text-rose-700', fuchsia: 'text-fuchsia-700' };
  return (
    <div className={`relative rounded-xl border bg-gradient-to-br ${toneStyles[tone]} p-4 flex flex-col gap-3 shadow-sm`}>
      <h3 className={`text-sm font-semibold ${textTone[tone]}`}>{title}</h3>
      {children}
    </div>
  );
};

export default function AstroOverviewPage() {
  const [kundali, setKundali] = React.useState<KundaliResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const details = getJanmaDetails();
    if (!details) {
      window.location.replace('/astro/janma');
      return;
    }
    (async () => {
      try {
        const k = await getKundali(details);
        if (mounted) setKundali(k);
      } catch (e) {
        console.error(e);
        if (mounted) setError('Failed to load overview');
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!kundali) return <div>Loading overview...</div>;

  // Current/first dashas (assuming library flags .isCurrent)
  const currentVim = kundali.vimshottariDasa.find(d => d.isCurrent) || kundali.vimshottariDasa[0];
  const currentTri = kundali.tribhagiDasa.find(d => d.isCurrent) || kundali.tribhagiDasa[0];
  const currentYog = kundali.yoginiDasa.find(d => d.isCurrent) || kundali.yoginiDasa[0];

  const currentVimAntar = currentVim?.antardashas?.find(a => a.isCurrent) || currentVim?.antardashas?.[0];
  const currentTriAntar = currentTri?.antardashas?.find(a => a.isCurrent) || currentTri?.antardashas?.[0];
  const currentYogAntar = currentYog?.antardashas?.find(a => a.isCurrent) || currentYog?.antardashas?.[0];

  // Planet positions at birth (PlanetsInTimeFrameResult is object map)
  const planetEntries = Object.entries(kundali.planets as PlanetsInTimeFrameResult) as [string, PlanetCombinedInfo][];
  const planetList = planetEntries.map(([name, info]) => ({ name, info }));

  const isoDate = kundali.zonedDate.toISOString();
  const birthDateStr = isoDate.split('T')[0];
  const birthTimeStr = isoDate.split('T')[1]?.slice(0,8);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-12">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
          {translateSanskritSafe('त्वरित संक्षेपिका')}
        </h1>
        <p className="text-sm text-gray-600 max-w-prose leading-relaxed">
          जन्म क्षणका मूलभूत पञ्चाङ्ग तथा राशिचक्र सूचकहरू सहित चालु महादशा तथा अन्तर्दशाहरुको संक्षेप विवरण। सबै मानहरू जन्मको क्षण ({birthDateStr} {birthTimeStr}) अनुसारका हुन्।
        </p>
      </header>

      {/* Birth & Temporal */}
      <Section
        title={translateSanskritSafe('जन्म काल')} 
        description="जन्मसमयका संवत्, ऋतु, अयन तथा माससम्बन्धी तथ्य।"
      >
        <KVGrid items={[
          { label: 'ग्रेगोरियन', value: birthDateStr },
          { label: 'समय', value: birthTimeStr },
          { label: 'वार', value: translateSanskritSafe(kundali.vaar) },
          { label: 'अयन', value: translateSanskritSafe(kundali.suryaDetails.surayAyan) },
          { label: 'ऋतु', value: translateSanskritSafe(kundali.suryaDetails.ritu) },
          { label: 'सौर मास', value: translateSanskritSafe(kundali.suryaDetails.surayMasa) },
          { label: 'विक्रम', value: kundali.vikaramSamvat.year },
          { label: 'शक', value: kundali.sakaSamvat.year },
          { label: 'संवत्सर', value: translateSanskritSafe(kundali.samvatsara.name) },
          { label: 'मास दिन', value: kundali.suryaDetails.solarMonthDays.toFixed(0) },
        ]} />
      </Section>

      {/* Lunar & Anga */}
      <Section title={translateSanskritSafe('चन्द्र अङ्ग')} description="तिथि, पक्ष, नक्षत्र, योग तथा करण।">
        <KVGrid items={[
          { label: 'तिथि', value: translateSanskritSafe(kundali.tithi.name) },
          { label: 'पक्ष', value: translateSanskritSafe(kundali.tithi.paksha) },
          { label: 'नक्षत्र', value: translateSanskritSafe(kundali.nakshatra.nakshatra), hint: `पाद ${kundali.nakshatra.pada || ''}` },
          { label: 'योग', value: translateSanskritSafe(kundali.yoga.name) },
          { label: 'करण', value: translateSanskritSafe(kundali.karana.name) },
        ]} />
      </Section>

      {/* Lagna & Rashi */}
      <Section title={translateSanskritSafe('लग्न तथा राशि')} description="जन्म लग्न तथा चन्द्रसम्बद्ध आधारहरू।">
        <KVGrid items={[
          { label: 'लग्न', value: translateSanskritSafe(kundali.lagna.lagna) },
          { label: 'नवांश लग्न', value: translateSanskritSafe(kundali.lagna.navamshaLagna) },
          { label: 'चन्द्र राशि', value: translateSanskritSafe(kundali.lagna.chandraRashi) },
          { label: 'चन्द्र मास', value: translateSanskritSafe(kundali.lagna.chandraMasa) },
          { label: 'राशि (Asc)', value: translateSanskritSafe(kundali.lagna.lagna) },
        ]} />
      </Section>

      {/* Current Dashas */}
  <Section title={translateSanskritSafe('चालु दशा')} description="वर्तमान महादशा तथा सोभित्र चलिरहेका अन्तर्दशाहरू।">
        <div className="grid gap-5 lg:grid-cols-3">
          <SoftPanel title={`${translateSanskritSafe('विंशोत्तरी')} ${translateSanskritSafe('महादशा')}`} tone="red">
            {currentVim && (
              <div className="space-y-3 text-[11px] sm:text-xs">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium text-xs">{translateSanskritSafe(currentVim.dashaLord)}</span>
                  <span className="text-gray-600 text-[11px]">{translateSanskritSafe(currentVim.startDateInBs)} – {translateSanskritSafe(currentVim.endDateInBs)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    ['Yrs', currentVim.remainingYears.toFixed(2)],
                    ['Mon', currentVim.remainingMonths],
                    ['Days', currentVim.remainingDays],
                    ['Cum', currentVim.cumulativeYears.toFixed(2)],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-lg bg-white/80 border border-red-100 p-1.5 flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-wide text-gray-500 uppercase">{k}</span>
                      <span className="font-semibold text-[11px]">{v}</span>
                    </div>
                  ))}
                </div>
                {currentVimAntar && (
                  <div className="flex flex-wrap gap-2 items-center text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">{translateSanskritSafe(currentVimAntar.antardashaLord)}</span>
                    <span className="text-gray-600">{translateSanskritSafe(currentVimAntar.startDateInBs)} – {translateSanskritSafe(currentVimAntar.endDateInBs)}</span>
                    <span className="text-gray-500">{currentVimAntar.durationYears.toFixed(2)}y</span>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
          <SoftPanel title={`${translateSanskritSafe('त्रिभागी')} ${translateSanskritSafe('महादशा')}`} tone="rose">
            {currentTri && (
              <div className="space-y-3 text-[11px] sm:text-xs">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-medium text-xs">{translateSanskritSafe(currentTri.dashaLord)}</span>
                  <span className="text-gray-600 text-[11px]">{translateSanskritSafe(currentTri.startDateInBs)} – {translateSanskritSafe(currentTri.endDateInBs)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    ['Yrs', currentTri.remainingYears.toFixed(2)],
                    ['Mon', currentTri.remainingMonths],
                    ['Days', currentTri.remainingDays],
                    ['Cum', currentTri.cumulativeYears.toFixed(2)],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-lg bg-white/80 border border-rose-100 p-1.5 flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-wide text-gray-500 uppercase">{k}</span>
                      <span className="font-semibold text-[11px]">{v}</span>
                    </div>
                  ))}
                </div>
                {currentTriAntar && (
                  <div className="flex flex-wrap gap-2 items-center text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-medium">{translateSanskritSafe(currentTriAntar.antardashaLord)}</span>
                    <span className="text-gray-600">{translateSanskritSafe(currentTriAntar.startDateInBs)} – {translateSanskritSafe(currentTriAntar.endDateInBs)}</span>
                    <span className="text-gray-500">{currentTriAntar.durationYears.toFixed(2)}y</span>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
          <SoftPanel title={`${translateSanskritSafe('योगिनी')} ${translateSanskritSafe('महादशा')}`} tone="fuchsia">
            {currentYog && (
              <div className="space-y-3 text-[11px] sm:text-xs">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700 font-medium text-xs">{translateSanskritSafe(currentYog.yogini)}</span>
                  <span className="text-gray-600 text-[11px]">{translateSanskritSafe(currentYog.startDateInBs)} – {translateSanskritSafe(currentYog.endDateInBs)}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Cycle {currentYog.cycle}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    ['Yrs', currentYog.remainingYears.toFixed(2)],
                    ['Mon', currentYog.remainingMonths],
                    ['Days', currentYog.remainingDays],
                    ['Cum', currentYog.cumulativeYears.toFixed(2)],
                    ['Cycle', currentYog.cycle],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-lg bg-white/80 border border-fuchsia-100 p-1.5 flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-wide text-gray-500 uppercase">{k}</span>
                      <span className="font-semibold text-[11px]">{v}</span>
                    </div>
                  ))}
                </div>
                {currentYogAntar && (
                  <div className="flex flex-wrap gap-2 items-center text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-medium">{translateSanskritSafe(currentYogAntar.antardashaIndex.toString())}</span>
                    <span className="text-gray-600">{translateSanskritSafe(currentYogAntar.startDateInBs)} – {translateSanskritSafe(currentYogAntar.endDateInBs)}</span>
                    <span className="text-gray-500">{currentYogAntar.durationYears.toFixed(2)}y</span>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
        </div>
      </Section>

      {/* Planet Positions */}
  <Section title={translateSanskritSafe('ग्रह स्थिति')} description="जन्म समयमा प्रत्येक ग्रहको साइडेरियल अंश तथा नक्षत्र-पाद।">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {planetList.map(({ name, info }) => {
            const retro = '';
            return (
              <div key={name} className="relative rounded-lg bg-white/80 dark:bg-gray-900/40 border border-gray-200/70 dark:border-gray-700/60 p-3 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-100 tracking-wide">{translateSanskritSafe(name)}</span>
                  <span className="text-[10px] uppercase text-gray-400 font-medium">{translateSanskritSafe(info.rashi)}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-tight text-gray-600">
                  <span className="flex items-center gap-1"><span className="text-gray-400">अंश</span><b className="font-mono text-gray-800 dark:text-gray-100">{translateSanskritSafe(info.siderealLonDMS30)}</b></span>
                  <span className="flex items-center gap-1"><span className="text-gray-400">नक्ष</span><b>{translateSanskritSafe(info.nakshatra)}</b><em className="text-[10px] text-gray-400">({translateSanskritSafe(String(info.pada))})</em></span>
                  {retro && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold text-[10px]">{retro}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

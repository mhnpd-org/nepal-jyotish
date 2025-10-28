"use client";
import React from 'react';
import { getJanmaDetails } from '@internal/utils/get-form-details';
import { getKundali, Kundali, PlanetCombinedInfo, PlanetsInTimeFrameResult } from '@mhnpd-org/panchang';
import { translateSanskritSafe } from '@internal/lib/devanagari';

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
  const [kundali, setKundali] = React.useState<Kundali | null>(null);
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

  const birthDateStr = kundali.dates.zonedDate.toLocaleDateString();
  const birthTimeStr = kundali.dates.timeStr;

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
          { label: 'ग्रेगोरियन', value: translateSanskritSafe(birthDateStr) },
          { label: 'समय', value: translateSanskritSafe(birthTimeStr) },
          { label: 'वार', value: translateSanskritSafe(kundali.dates.ishwiSamvat.vaar!.toLowerCase()) },
          { label: 'अयन', value: translateSanskritSafe(kundali.surya.suryaAyana) },
          { label: 'ऋतु', value: translateSanskritSafe(kundali.surya.ritu) },
          { label: 'सौर मास', value: translateSanskritSafe(kundali.surya.masa) },
          { label: 'विक्रम', value: translateSanskritSafe(kundali.dates.vikramSamvat.year.toString()) },
          { label: 'शक', value: translateSanskritSafe(kundali.dates.sakaSamvat.year.toString()) },
          { label: 'संवत्सर', value: translateSanskritSafe(kundali.dates.samvatsara.name) },
          { label: 'मास दिन', value: translateSanskritSafe(kundali.surya.sauraMasaDays.toFixed(2)) },
        ]} />
      </Section>

      {/* Lunar & Anga */}
      <Section title={translateSanskritSafe('चन्द्र अङ्ग')} description="तिथि, पक्ष, नक्षत्र, योग तथा करण।">
        <KVGrid items={[
          { label: 'तिथि', value: translateSanskritSafe(kundali.tithi.tithi) },
          { label: 'पक्ष', value: translateSanskritSafe(kundali.tithi.paksha) },
          { label: 'नक्षत्र', value: translateSanskritSafe(kundali.nakshatra.name), hint: `पाद ${translateSanskritSafe(kundali.nakshatra.pada?.toString() || '')}` },
          { label: 'योग', value: translateSanskritSafe(kundali.tithi.yoga.name) },
          { label: 'करण', value: translateSanskritSafe(kundali.tithi.karana.name) },
        ]} />
      </Section>

      {/* Lagna & Rashi */}
      <Section title={translateSanskritSafe('लग्न तथा राशि')} description="जन्म लग्न तथा चन्द्रसम्बद्ध आधारहरू।">
        <KVGrid items={[
          { label: 'लग्न', value: translateSanskritSafe(kundali.lagna.lagna) },
          { label: 'नवांश लग्न', value: translateSanskritSafe(kundali.lagna.navamshaLagna) },
          { label: 'चन्द्र राशि', value: translateSanskritSafe(kundali.nakshatra.rashi) },
          { label: 'चन्द्र मास', value: translateSanskritSafe(kundali.tithi.chandraMasa) },
          { label: 'राशि (Asc)', value: translateSanskritSafe(kundali.lagna.lagna) },
        ]} />
      </Section>

      {/* Current Dashas */}
  <Section title={translateSanskritSafe('चालु दशा')} description="वर्तमान महादशा तथा सोभित्र चलिरहेका अन्तर्दशाहरू।">
        <div className="grid gap-6 lg:grid-cols-3">
          <SoftPanel title={`${translateSanskritSafe('विंशोत्तरी')} ${translateSanskritSafe('महादशा')}`} tone="red">
            {currentVim && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border-l-4 border-red-500">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-red-800">{translateSanskritSafe(currentVim.dashaLord)}</span>
                      <span className="text-xs text-red-600 font-medium px-2 py-1 bg-white/60 rounded">महादशा</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {translateSanskritSafe(currentVim.startDateInBs)} – {translateSanskritSafe(currentVim.endDateInBs)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['वर्ष', translateSanskritSafe(currentVim.remainingYears.toFixed(2))],
                    ['मास', translateSanskritSafe(currentVim.remainingMonths.toString())],
                    ['दिन', translateSanskritSafe(currentVim.remainingDays.toString())],
                    ['योग', translateSanskritSafe(currentVim.cumulativeYears.toFixed(2))],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-xl bg-white border-2 border-red-100 p-3 flex flex-col gap-1 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{k}</span>
                      <span className="text-lg font-bold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
                {currentVimAntar && (
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-700 font-semibold uppercase">अन्तर्दशा</span>
                        <span className="text-sm font-bold text-amber-900">{translateSanskritSafe(currentVimAntar.antardashaLord)}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {translateSanskritSafe(currentVimAntar.startDateInBs)} – {translateSanskritSafe(currentVimAntar.endDateInBs)}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        अवधि: {translateSanskritSafe(currentVimAntar.durationYears.toFixed(2))} वर्ष
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
          <SoftPanel title={`${translateSanskritSafe('त्रिभागी')} ${translateSanskritSafe('महादशा')}`} tone="rose">
            {currentTri && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border-l-4 border-rose-500">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-rose-800">{translateSanskritSafe(currentTri.dashaLord)}</span>
                      <span className="text-xs text-rose-600 font-medium px-2 py-1 bg-white/60 rounded">महादशा</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {translateSanskritSafe(currentTri.startDateInBs)} – {translateSanskritSafe(currentTri.endDateInBs)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['वर्ष', translateSanskritSafe(currentTri.remainingYears.toFixed(2))],
                    ['मास', translateSanskritSafe(currentTri.remainingMonths.toString())],
                    ['दिन', translateSanskritSafe(currentTri.remainingDays.toString())],
                    ['योग', translateSanskritSafe(currentTri.cumulativeYears.toFixed(2))],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-xl bg-white border-2 border-rose-100 p-3 flex flex-col gap-1 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{k}</span>
                      <span className="text-lg font-bold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
                {currentTriAntar && (
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-pink-700 font-semibold uppercase">अन्तर्दशा</span>
                        <span className="text-sm font-bold text-pink-900">{translateSanskritSafe(currentTriAntar.antardashaLord)}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {translateSanskritSafe(currentTriAntar.startDateInBs)} – {translateSanskritSafe(currentTriAntar.endDateInBs)}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        अवधि: {translateSanskritSafe(currentTriAntar.durationYears.toFixed(2))} वर्ष
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
          <SoftPanel title={`${translateSanskritSafe('योगिनी')} ${translateSanskritSafe('महादशा')}`} tone="fuchsia">
            {currentYog && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-3 border-l-4 border-fuchsia-500">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-fuchsia-800">{translateSanskritSafe(currentYog.yogini)}</span>
                      <span className="text-xs text-fuchsia-600 font-medium px-2 py-1 bg-white/60 rounded">चक्र {translateSanskritSafe(currentYog.cycle.toString())}</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {translateSanskritSafe(currentYog.startDateInBs)} – {translateSanskritSafe(currentYog.endDateInBs)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['वर्ष', translateSanskritSafe(currentYog.remainingYears.toFixed(2))],
                    ['मास', translateSanskritSafe(currentYog.remainingMonths.toString())],
                    ['दिन', translateSanskritSafe(currentYog.remainingDays.toString())],
                    ['योग', translateSanskritSafe(currentYog.cumulativeYears.toFixed(2))],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-xl bg-white border-2 border-fuchsia-100 p-3 flex flex-col gap-1 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{k}</span>
                      <span className="text-lg font-bold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
                {currentYogAntar && (
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-700 font-semibold uppercase">अन्तर्दशा</span>
                        <span className="text-sm font-bold text-purple-900">#{translateSanskritSafe(currentYogAntar.antardashaIndex.toString())}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {translateSanskritSafe(currentYogAntar.startDateInBs)} – {translateSanskritSafe(currentYogAntar.endDateInBs)}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        अवधि: {translateSanskritSafe(currentYogAntar.durationYears.toFixed(2))} वर्ष
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SoftPanel>
        </div>
      </Section>

      {/* Planet Positions */}
  <Section title={translateSanskritSafe('ग्रह स्थिति')} description="जन्म समयमा प्रत्येक ग्रहको साइडेरियल अंश तथा नक्षत्र-पाद।">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
          {planetList.map(({ name, info }) => {
            const retro = '';
            return (
              <div key={name} className="relative rounded-xl bg-white/80 dark:bg-gray-900/40 border-2 border-gray-200/70 dark:border-gray-700/60 p-4 flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide">{translateSanskritSafe(name)}</span>
                  <span className="text-sm uppercase text-gray-500 font-semibold px-2 py-0.5 bg-gray-100 rounded">{translateSanskritSafe(info.rashi)}</span>
                </div>
                <div className="flex flex-col gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium min-w-[3rem]">अंश</span>
                    <b className="font-mono text-base text-gray-900 dark:text-gray-100">{translateSanskritSafe(info.siderealLonDMS30)}</b>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium min-w-[3rem]">नक्ष</span>
                    <b className="text-base">{translateSanskritSafe(info.nakshatra)}</b>
                    <em className="text-sm text-gray-500">(पाद {translateSanskritSafe(info.pada?.toString() || '')})</em>
                  </span>
                  {retro && <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold text-sm self-start">{retro}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

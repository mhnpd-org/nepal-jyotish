"use client";
import React from 'react';
import { getJanmaDetails } from '@internal/utils/get-form-details';
import { getKundali, Kundali } from '@mhnpd-org/panchang';
import { translateSanskritSafe } from '@internal/lib/devanagari';
import { ErrorState } from '@internal/layouts/error-state';
import { LoadingState } from '@internal/layouts/loading-state';



const Section: React.FC<{ title: string; children: React.ReactNode; description?: string }>= ({ title, description, children }) => (
  <section className="space-y-4">
    <header className="space-y-2 border-b border-gray-200 pb-3">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-3">
        <span className="h-5 w-2 rounded-full bg-gradient-to-b from-orange-500 via-rose-500 to-pink-500" />
        {title}
      </h2>
      {description && <p className="text-sm text-gray-600 leading-relaxed max-w-prose ml-5">{description}</p>}
    </header>
    {children}
  </section>
);

const SoftPanel: React.FC<{ tone?: 'red' | 'rose' | 'fuchsia'; children: React.ReactNode; title: string }>= ({ tone = 'red', children, title }) => {
  const toneStyles: Record<string,string> = {
    red: 'from-red-50 to-amber-50 border-red-300/70 shadow-red-100',
    rose: 'from-rose-50 to-pink-50 border-rose-300/70 shadow-rose-100',
    fuchsia: 'from-fuchsia-50 to-purple-50 border-fuchsia-300/70 shadow-fuchsia-100',
  };
  const textTone: Record<string,string> = { red: 'text-red-800', rose: 'text-rose-800', fuchsia: 'text-fuchsia-800' };
  return (
    <div className={`relative rounded-2xl border-2 bg-gradient-to-br ${toneStyles[tone]} p-4 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <h3 className={`text-base lg:text-lg font-bold ${textTone[tone]} border-b border-current/20 pb-2`}>{title}</h3>
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
        if (mounted) setError('कुण्डली लोड गर्न सकिएन');
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <ErrorState message={error} />;
  
  if (!kundali) return <LoadingState />;

  // Extract data from kundali for display
  const birthData = kundali ? {
    vikramSamvat: `${translateSanskritSafe(kundali.surya.masa)} ${translateSanskritSafe(kundali.tithi.tithi)}, ${translateSanskritSafe(kundali.dates.vikramSamvat.year.toString())}-${translateSanskritSafe(kundali.dates.vikramSamvat.month?.toString())}-${translateSanskritSafe(kundali.dates.vikramSamvat.day?.toFixed(0).toString())}`,
    ishwiSamvat: `${translateSanskritSafe(kundali.dates.ishwiSamvat.month?.toString())} ${translateSanskritSafe(kundali.dates.ishwiSamvat.day?.toFixed(0).toString())}, ${translateSanskritSafe(kundali.dates.ishwiSamvat.year.toString())}`,
    time: translateSanskritSafe(kundali.dates.timeStr),
    weekday: translateSanskritSafe(kundali.dates.ishwiSamvat.vaar?.toLowerCase() || 'saturday'),
    ayana: translateSanskritSafe(kundali.surya.suryaAyana),
    tithi: translateSanskritSafe(kundali.tithi.tithi),
    nakshatra: translateSanskritSafe(kundali.nakshatra.name),
    nakshatraPada: translateSanskritSafe(kundali.nakshatra.pada?.toString() || '२'),
    yoga: translateSanskritSafe(kundali.tithi.yoga.name),
    karana: translateSanskritSafe(kundali.tithi.karana.name),
    samvatsara: translateSanskritSafe(kundali.dates.samvatsara.name),
    lagna: translateSanskritSafe(kundali.lagna.lagna),
    chandraRashi: translateSanskritSafe(kundali.nakshatra.rashi),
    navamshaLagna: translateSanskritSafe(kundali.lagna.navamshaLagna),
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Page Header */}
      <header className="text-center space-y-6 py-8">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
          त्वरित संक्षेपिका
        </h1>
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
            जन्म क्षणका मूलभूत पञ्चाङ्ग तथा राशिचक्र सूचकहरू सहित चालु महादशा तथा अन्तर्दशाहरुको संक्षेप विवरण।
          </p>
          <p className="text-base text-gray-600">
            सबै मानहरू जन्मको क्षण (<span className="font-mono font-bold text-gray-800">{translateSanskritSafe(kundali?.dates.zonedDate.toLocaleDateString() || '')} {birthData?.time}</span>) अनुसारका हुन्।
          </p>
        </div>
      </header>

      {/* Compact Birth Details */}
      <Section title="जन्म विवरण" description="जन्म काल, पञ्चाङ्ग तथा लग्न सूचकहरू">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Basic Birth Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 text-sm border-b border-gray-200 pb-1">जन्म काल</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">विक्रम संवत्:</span>
                <span className="font-medium">{birthData?.vikramSamvat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ईश्वी संवत्:</span>
                <span className="font-medium">{birthData?.ishwiSamvat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">समय:</span>
                <span className="font-medium">{birthData?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">वार:</span>
                <span className="font-medium">{birthData?.weekday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">अयन:</span>
                <span className="font-medium">{birthData?.ayana}</span>
              </div>
            </div>
          </div>

          {/* Panchang Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 text-sm border-b border-gray-200 pb-1">पञ्चाङ्ग विवरण</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">तिथि:</span>
                <span className="font-medium">{birthData?.tithi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">नक्षत्र:</span>
                <span className="font-medium">{birthData?.nakshatra} पाद {birthData?.nakshatraPada}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">योग:</span>
                <span className="font-medium">{birthData?.yoga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">करण:</span>
                <span className="font-medium">{birthData?.karana}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">संवत्सर:</span>
                <span className="font-medium">{birthData?.samvatsara}</span>
              </div>
            </div>
          </div>

          {/* Lagna & Calendar */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 text-sm border-b border-gray-200 pb-1">लग्न तथा संवत्</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">लग्न:</span>
                <span className="font-medium">{birthData?.lagna}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">चन्द्र राशि:</span>
                <span className="font-medium">{birthData?.chandraRashi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">नवांश लग्न:</span>
                <span className="font-medium">{birthData?.navamshaLagna}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Current Dashas */}
      <Section title="चालु दशा" description="वर्तमान महादशा तथा सोभित्र चलिरहेका अन्तर्दशाहरू।">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vimshottari Dasha */}
          {(() => {
            const currentVim = kundali.vimshottariDasa.find(d => d.isCurrent);
            const currentVimAntar = currentVim?.antardashas?.find(a => a.isCurrent);
            return (
              <SoftPanel title="विंशोत्तरी महादशा" tone="red">
                <div className="space-y-4">
                  {currentVim && (
                    <>
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border-l-6 border-red-500 text-base lg:text-lg">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl lg:text-2xl font-bold text-red-800">{translateSanskritSafe(currentVim.dashaLord)}</span>
                            <span className="text-sm lg:text-base text-red-600 font-bold px-3 py-1 bg-white/80 rounded-full">महादशा</span>
                          </div>
                          <div className="text-base lg:text-lg text-gray-700 font-semibold">
                            {translateSanskritSafe(currentVim.startDateInBs)} – {translateSanskritSafe(currentVim.endDateInBs)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['बाँकी वर्ष', translateSanskritSafe(currentVim.remainingYears.toFixed(2))],
                          ['बाँकी मास', translateSanskritSafe(currentVim.remainingMonths.toString())],
                          ['बाँकी दिन', translateSanskritSafe(currentVim.remainingDays.toString())],
                          ['कुल योग', translateSanskritSafe(currentVim.cumulativeYears.toFixed(2))],
                        ].map(([k,v]) => (
                          <div key={k} className="rounded-2xl bg-white border-2 border-red-200 p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-200">
                            <span className="text-sm lg:text-base font-bold text-gray-600 uppercase tracking-wider">{k}</span>
                            <span className="text-xl lg:text-2xl font-bold text-gray-900">{v}</span>
                          </div>
                        ))}
                      </div>
                      {currentVimAntar && (
                        <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 text-base lg:text-lg">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm lg:text-base text-amber-700 font-bold uppercase px-3 py-1 bg-amber-200 rounded-full">अन्तर्दशा</span>
                              <span className="text-lg lg:text-xl font-bold text-amber-900">{translateSanskritSafe(currentVimAntar.antardashaLord)}</span>
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 font-semibold">
                              {translateSanskritSafe(currentVimAntar.startDateInBs)} – {translateSanskritSafe(currentVimAntar.endDateInBs)}
                            </div>
                            <div className="text-sm lg:text-base text-gray-600 font-medium">
                              अवधि: {translateSanskritSafe(currentVimAntar.durationYears.toFixed(2))} वर्ष
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SoftPanel>
            );
          })()}

          {/* Tribhagi Dasha */}
          {(() => {
            const currentTrib = kundali.tribhagiDasa.find(d => d.isCurrent);
            const currentTribAntar = currentTrib?.antardashas?.find(a => a.isCurrent);
            return (
              <SoftPanel title="त्रिभागी महादशा" tone="rose">
                <div className="space-y-4">
                  {currentTrib && (
                    <>
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border-l-6 border-rose-500 text-base lg:text-lg">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl lg:text-2xl font-bold text-rose-800">{translateSanskritSafe(currentTrib.dashaLord)}</span>
                            <span className="text-sm lg:text-base text-rose-600 font-bold px-3 py-1 bg-white/80 rounded-full">महादशा</span>
                          </div>
                          <div className="text-base lg:text-lg text-gray-700 font-semibold">
                            {translateSanskritSafe(currentTrib.startDateInBs)} – {translateSanskritSafe(currentTrib.endDateInBs)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['बाँकी वर्ष', translateSanskritSafe(currentTrib.remainingYears.toFixed(2))],
                          ['बाँकी मास', translateSanskritSafe(currentTrib.remainingMonths.toString())],
                          ['बाँकी दिन', translateSanskritSafe(currentTrib.remainingDays.toString())],
                          ['कुल योग', translateSanskritSafe(currentTrib.cumulativeYears.toFixed(2))],
                        ].map(([k,v]) => (
                          <div key={k} className="rounded-2xl bg-white border-2 border-rose-200 p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-200">
                            <span className="text-sm lg:text-base font-bold text-gray-600 uppercase tracking-wider">{k}</span>
                            <span className="text-xl lg:text-2xl font-bold text-gray-900">{v}</span>
                          </div>
                        ))}
                      </div>
                      {currentTribAntar && (
                        <div className="bg-pink-50 rounded-2xl p-5 border-2 border-pink-300 text-base lg:text-lg">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm lg:text-base text-pink-700 font-bold uppercase px-3 py-1 bg-pink-200 rounded-full">अन्तर्दशा</span>
                              <span className="text-lg lg:text-xl font-bold text-pink-900">{translateSanskritSafe(currentTribAntar.antardashaLord)}</span>
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 font-semibold">
                              {translateSanskritSafe(currentTribAntar.startDateInBs)} – {translateSanskritSafe(currentTribAntar.endDateInBs)}
                            </div>
                            <div className="text-sm lg:text-base text-gray-600 font-medium">
                              अवधि: {translateSanskritSafe(currentTribAntar.durationYears.toFixed(2))} वर्ष
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SoftPanel>
            );
          })()}

          {/* Yogini Dasha */}
          {(() => {
            const currentYog = kundali.yoginiDasa.find(d => d.isCurrent);
            const currentYogAntar = currentYog?.antardashas?.find(a => a.isCurrent);
            return (
              <SoftPanel title="योगिनी महादशा" tone="fuchsia">
                <div className="space-y-4">
                  {currentYog && (
                    <>
                      <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-5 border-l-6 border-fuchsia-500 text-base lg:text-lg">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl lg:text-2xl font-bold text-fuchsia-800">{translateSanskritSafe(currentYog.yogini)}</span>
                            <span className="text-sm lg:text-base text-fuchsia-600 font-bold px-3 py-1 bg-white/80 rounded-full">चक्र {translateSanskritSafe(currentYog.cycle.toString())}</span>
                          </div>
                          <div className="text-base lg:text-lg text-gray-700 font-semibold">
                            {translateSanskritSafe(currentYog.startDateInBs)} – {translateSanskritSafe(currentYog.endDateInBs)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['बाँकी वर्ष', translateSanskritSafe(currentYog.remainingYears.toFixed(2))],
                          ['बाँकी मास', translateSanskritSafe(currentYog.remainingMonths.toString())],
                          ['बाँकी दिन', translateSanskritSafe(currentYog.remainingDays.toString())],
                          ['कुल योग', translateSanskritSafe(currentYog.cumulativeYears.toFixed(2))],
                        ].map(([k,v]) => (
                          <div key={k} className="rounded-2xl bg-white border-2 border-fuchsia-200 p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-200">
                            <span className="text-sm lg:text-base font-bold text-gray-600 uppercase tracking-wider">{k}</span>
                            <span className="text-xl lg:text-2xl font-bold text-gray-900">{v}</span>
                          </div>
                        ))}
                      </div>
                      {currentYogAntar && (
                        <div className="bg-purple-50 rounded-2xl p-5 border-2 border-purple-300 text-base lg:text-lg">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm lg:text-base text-purple-700 font-bold uppercase px-3 py-1 bg-purple-200 rounded-full">अन्तर्दशा</span>
                              <span className="text-lg lg:text-xl font-bold text-purple-900">{translateSanskritSafe(currentYogAntar.parentYogini)}-{translateSanskritSafe(currentYogAntar.antardashaIndex.toString())}</span>
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 font-semibold">
                              {translateSanskritSafe(currentYogAntar.startDateInBs)} – {translateSanskritSafe(currentYogAntar.endDateInBs)}
                            </div>
                            <div className="text-sm lg:text-base text-gray-600 font-medium">
                              अवधि: {translateSanskritSafe(currentYogAntar.durationYears.toFixed(2))} वर्ष
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SoftPanel>
            );
          })()}
        </div>
      </Section>


    </div>
  );
}

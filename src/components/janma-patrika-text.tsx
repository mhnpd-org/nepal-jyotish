import React from "react";
import { translateSanskritSafe, placeholder, toDevanagariDigits } from "@internal/lib/devanagari";

/* ===================== Grouped Domain Interfaces ===================== */
export interface EraInfo { shaka?: string; vikram?: string; ad?: string; samvatsara?: string; weekday?: string }
export interface SolarInfo { suryaAyana?: string; ritu?: string; solarMonth?: string; solarMonthDays?: string }
export interface LunarInfo { chandraMasa?: string; chandraPaksha?: string; nakshatra?: string; nakshatraPada?: string; nakshatraGhatyadi?: string }
export interface TithiInfo { tithi?: string; tithiStartGhatyadi?: string; bhuktGhatyadi?: string; bhogyaGhatyadi?: string; tithiRefDetails?: string }
export interface LagnaInfo { lagna?: string; navamshaLagna?: string; chandraRashi?: string; rashi?: string }
export interface BirthInfo { janmaTime?: string; janmaSthan?: string; standardTimeOffset?: string; localBirthTime?: string; pramanikTime?: string; sunriseGhatyadi?: string; gregorianMonth?: string; gregorianDate?: string }
export interface PersonalInfo { gotra?: string; kula?: string; spouseName?: string; childName?: string; syllableAkshara?: string; yoni?: string; nadi?: string; gana?: string; varna?: string; additionalNotes?: string }
export interface YogaKaranaInfo { yoga?: string; karana?: string }

/** New grouped props interface (legacy top-level fallbacks supported). */
export interface JanmaPatrikaTextProps {
  era?: EraInfo;
  solar?: SolarInfo;
  lunar?: LunarInfo;
  tithiBlock?: TithiInfo;
  lagnaBlock?: LagnaInfo;
  birth?: BirthInfo;
  personal?: PersonalInfo;
  yogaKarana?: YogaKaranaInfo;
  /* ---- Legacy flat props (will be merged if provided) ---- */
  shalivahaniShaka?: string;
  veerVikramadityaSamvat?: string;
  adYear?: string;
  samvatsaraName?: string;
  suryaAyana?: string; ritu?: string;
  chandraMasa?: string; chandraPaksha?: string; nakshatra?: string; nakshatraPada?: string; nakshatraGhatyadi?: string;
  weekday?: string; tithi?: string; tithiStartGhatyadi?: string; bhuktGhatyadi?: string; bhogyaGhatyadi?: string; tithiRefDetails?: string;
  yoga?: string; karana?: string;
  solarMonth?: string; solarMonthDays?: string;
  gregorianMonth?: string; gregorianDate?: string;
  pramanikTime?: string; sunriseGhatyadi?: string; janmaTime?: string;
  lagna?: string; navamshaLagna?: string; chandraRashi?: string; rashi?: string;
  janmaSthan?: string; standardTimeOffset?: string; localBirthTime?: string;
  gotra?: string; kula?: string; spouseName?: string; childName?: string; syllableAkshara?: string; yoni?: string; nadi?: string; gana?: string; varna?: string; additionalNotes?: string;
}

/** Janma Patrika React component */
export const JanmaPatrikaText: React.FC<JanmaPatrikaTextProps> = (props) => {
  const ph = placeholder();

  // Merge grouped + legacy flat fields into a unified flat structure expected by template.
  const data = {
    shalivahaniShaka: props.era?.shaka ?? props.shalivahaniShaka ?? ph,
    veerVikramadityaSamvat: props.era?.vikram ?? props.veerVikramadityaSamvat ?? ph,
    adYear: props.era?.ad ?? props.adYear ?? ph,
    samvatsaraName: props.era?.samvatsara ?? props.samvatsaraName ?? ph,
    weekday: props.era?.weekday ?? props.weekday ?? ph,

    suryaAyana: props.solar?.suryaAyana ?? props.suryaAyana ?? ph,
    ritu: props.solar?.ritu ?? props.ritu ?? ph,
    solarMonth: props.solar?.solarMonth ?? props.solarMonth ?? ph,
    solarMonthDays: props.solar?.solarMonthDays ?? props.solarMonthDays ?? ph,

    chandraMasa: props.lunar?.chandraMasa ?? props.chandraMasa ?? ph,
    chandraPaksha: props.lunar?.chandraPaksha ?? props.chandraPaksha ?? ph,
    nakshatra: props.lunar?.nakshatra ?? props.nakshatra ?? ph,
    nakshatraPada: props.lunar?.nakshatraPada ?? props.nakshatraPada ?? ph,
    nakshatraGhatyadi: props.lunar?.nakshatraGhatyadi ?? props.nakshatraGhatyadi ?? ph,

    tithi: props.tithiBlock?.tithi ?? props.tithi ?? ph,
    tithiStartGhatyadi: props.tithiBlock?.tithiStartGhatyadi ?? props.tithiStartGhatyadi ?? ph,
    bhuktGhatyadi: props.tithiBlock?.bhuktGhatyadi ?? props.bhuktGhatyadi ?? ph,
    bhogyaGhatyadi: props.tithiBlock?.bhogyaGhatyadi ?? props.bhogyaGhatyadi ?? ph,
    tithiRefDetails: props.tithiBlock?.tithiRefDetails ?? ph,

    lagna: props.lagnaBlock?.lagna ?? props.lagna ?? ph,
    navamshaLagna: props.lagnaBlock?.navamshaLagna ?? props.navamshaLagna ?? ph,
    chandraRashi: props.lagnaBlock?.chandraRashi ?? props.chandraRashi ?? ph,
    rashi: props.lagnaBlock?.rashi ?? props.rashi ?? ph,

    janmaTime: props.birth?.janmaTime ?? props.janmaTime ?? ph,
    janmaSthan: props.birth?.janmaSthan ?? props.janmaSthan ?? ph,
    standardTimeOffset: props.birth?.standardTimeOffset ?? props.standardTimeOffset ?? ph,
    localBirthTime: props.birth?.localBirthTime ?? props.localBirthTime ?? ph,
    pramanikTime: props.birth?.pramanikTime ?? props.pramanikTime ?? ph,
    sunriseGhatyadi: props.birth?.sunriseGhatyadi ?? props.sunriseGhatyadi ?? ph,
    gregorianMonth: props.birth?.gregorianMonth ?? props.gregorianMonth ?? ph,
    gregorianDate: props.birth?.gregorianDate ?? props.gregorianDate ?? ph,

    yoga: props.yogaKarana?.yoga ?? props.yoga ?? ph,
    karana: props.yogaKarana?.karana ?? props.karana ?? ph,

    gotra: props.personal?.gotra ?? props.gotra ?? ph,
    kula: props.personal?.kula ?? props.kula ?? ph,
    spouseName: props.personal?.spouseName ?? props.spouseName ?? ph,
    childName: props.personal?.childName ?? props.childName ?? ph,
    syllableAkshara: props.personal?.syllableAkshara ?? props.syllableAkshara ?? ph,
    yoni: props.personal?.yoni ?? props.yoni ?? ph,
    nadi: props.personal?.nadi ?? props.nadi ?? ph,
    gana: props.personal?.gana ?? props.gana ?? ph,
    varna: props.personal?.varna ?? props.varna ?? ph,
    additionalNotes: props.personal?.additionalNotes ?? props.additionalNotes ?? ph,
  };

  // Translate & digit-normalize once (avoid recomputation in JSX)
  const tr = (v: string) => (v === ph ? v : translateSanskritSafe(v));
  const t = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, tr(v as string)])
  ) as typeof data;

  // Styled semantic chunks
  const EmRed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="text-red-600">{children}</span>
  );
  const EmBlue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="text-blue-700">{children}</span>
  );

  return (
  <article className="font-[var(--font-devanagari,inherit)] leading-relaxed font-semibold text-base sm:text-lg md:text-xl tracking-wide selection:bg-rose-100 selection:text-rose-700">
      <section className="space-y-6">
        <p className="[text-wrap:pretty] [text-align:justify]">
          श्रीशालिवाहन शके <EmRed>{t.shalivahaniShaka}</EmRed>{" "}
          श्रीवीरविक्रमादित्य संवत्
          <EmRed> {t.veerVikramadityaSamvat}</EmRed> ईसवीय सन्
          <EmRed> {t.adYear}</EmRed> अत्रास्मिन् वर्षे{" "}
          <EmBlue>{t.samvatsaraName}</EmBlue> नाम संवत्सरे श्रीसूर्य{" "}
          <EmBlue>{t.suryaAyana}</EmBlue> अयने <EmBlue>{t.ritu}</EmBlue> ऋतौ अथ
          चान्द्रमानेन <EmBlue>{t.chandraMasa}</EmBlue> मासे{" "}
          <EmBlue>{t.chandraPaksha}</EmBlue> पक्षे आगत{" "}
          <EmBlue>{t.weekday}</EmBlue> वासरे <EmBlue>{t.tithi}</EmBlue> तिथौ
          घट्यादिः
          <EmRed> {t.tithiStartGhatyadi}</EmRed> तत् तिथि{" "}
          <EmRed>{t.nakshatra}</EmRed> नक्षत्रे घट्यादिः
          <EmRed> {t.nakshatraGhatyadi}</EmRed> जन्मसमये भुक्त घट्यादिः{" "}
          <EmRed>{t.bhuktGhatyadi}</EmRed>
          भोग्य घट्यादिः <EmRed>{t.bhogyaGhatyadi}</EmRed> प्रसंगादय{" "}
          <EmBlue>{t.yoga}</EmBlue> योगे तात्कालिक <EmBlue>{t.karana}</EmBlue>{" "}
          करणे इति पश्चात् सौरमानेन
          <EmBlue> {t.solarMonth}</EmBlue> मासे सूर्यसंक्रमादिनेषु{" "}
          <EmRed>{t.solarMonthDays}</EmRed>
          तदनुसार ( ईसवीय मास <EmRed>{t.gregorianMonth}</EmRed> तारिखः
          <EmRed> {t.gregorianDate}</EmRed> ) प्रमाणिक{" "}
          <EmRed>{t.pramanikTime}</EmRed>
          समये स्थानीय सूर्योदयदिष्ट घट्यादिः <EmRed>{t.sunriseGhatyadi}</EmRed>
          तदा जन्मसमये <EmRed>{t.janmaTime}</EmRed> लग्ने{" "}
          <EmBlue>{t.lagna}</EmBlue>
          नवमांशे <EmBlue>{t.navamshaLagna}</EmBlue> राशौ चन्द्रमसि{" "}
          <EmBlue>{t.chandraRashi}</EmBlue> राशिगते एवं विधे पश्चात् देशे मण्डले
          तदनन्तर्गत स्थाने (जन्मस्थान <EmRed>{t.janmaSthan}</EmRed> मानक समय{" "}
          <EmRed>{toDevanagariDigits(t.standardTimeOffset)}</EmRed> स्थानीय
          जन्मसमय
          <EmRed> {t.localBirthTime}</EmRed>) निवसतः गोत्रोत्पन्न
          <EmRed> {t.gotra}</EmRed> कुल <EmRed>{t.kula}</EmRed> विवाहिता
          भार्याया
          <EmRed> {t.spouseName}</EmRed> गर्भस्थ रत्नम् अजीजनत्।
        </p>
        <p className="[text-wrap:pretty] [text-align:justify]">
          अस्य होराशास्त्र प्रमाणेन <EmBlue>{t.nakshatra}</EmBlue> नक्षत्रस्य
          <EmRed> {t.nakshatraPada}</EmRed> चरणत्वेन काराक्षरः
          <EmRed> {t.syllableAkshara}</EmRed> योनि <EmRed>{t.yoni}</EmRed>
          नाडी <EmRed>{t.nadi}</EmRed> गण <EmRed>{t.gana}</EmRed>
          वर्ण <EmRed>{t.varna}</EmRed> राशि <EmRed>{t.rashi}</EmRed>
          शुभ नाम <EmRed>{t.childName}</EmRed> प्रतिष्ठितम्।
          {t.additionalNotes.trim() && t.additionalNotes !== ph && (
            <> {t.additionalNotes}</>
          )}
        </p>
        <p className="[text-align:justify]">
          तिथेयः विवरणम् : <EmBlue>{t.tithiRefDetails}</EmBlue>
        </p>
      </section>
    </article>
  );
};

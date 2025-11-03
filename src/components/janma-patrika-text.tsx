import React from "react";
import { translateSanskritSafe, placeholder, toDevanagariDigits } from "@internal/lib/devanagari";

export interface EraInfo { shaka?: string; vikram?: string; ad?: string; samvatsara?: string; weekday?: string }
export interface SolarInfo { suryaAyana?: string; ritu?: string; solarMonth?: string; solarMonthDays?: string }
export interface LunarInfo { chandraMasa?: string; chandraPaksha?: string; nakshatra?: string; nakshatraPada?: string; nakshatraGhatyadi?: string }
export interface TithiInfo { tithi?: string; tithiStartGhatyadi?: string; bhuktGhatyadi?: string; bhogyaGhatyadi?: string; tithiRefDetails?: string }
export interface LagnaInfo { lagna?: string; navamshaLagna?: string; chandraRashi?: string; rashi?: string }
export interface BirthInfo { janmaTime?: string; janmaSthan?: string; standardTimeOffset?: string; localBirthTime?: string; pramanikTime?: string; sunriseGhatyadi?: string; gregorianMonth?: string; gregorianDate?: string }
export interface PersonalInfo { gotra?: string; kula?: string; spouseName?: string; childName?: string; syllableAkshara?: string; yoni?: string; nadi?: string; gana?: string; varna?: string; additionalNotes?: string }
export interface YogaKaranaInfo { yoga?: string; karana?: string }

/** Props interface (post-migration: only grouped domain objects). */
export interface JanmaPatrikaTextProps {
  era?: EraInfo;
  solar?: SolarInfo;
  lunar?: LunarInfo;
  tithiBlock?: TithiInfo;
  lagnaBlock?: LagnaInfo;
  birth?: BirthInfo;
  personal?: PersonalInfo;
  yogaKarana?: YogaKaranaInfo;
}

/** Janma Patrika React component */
export const JanmaPatrikaText: React.FC<JanmaPatrikaTextProps> = (props) => {
  const ph = placeholder();

  // Build flat structure only from grouped props (legacy props removed).
  const data = {
    shalivahaniShaka: props.era?.shaka ?? ph,
    veerVikramadityaSamvat: props.era?.vikram ?? ph,
    adYear: props.era?.ad ?? ph,
    samvatsaraName: props.era?.samvatsara ?? ph,
    weekday: props.era?.weekday ?? ph,

    suryaAyana: props.solar?.suryaAyana ?? ph,
    ritu: props.solar?.ritu ?? ph,
    solarMonth: props.solar?.solarMonth ?? ph,
    solarMonthDays: props.solar?.solarMonthDays ?? ph,

    chandraMasa: props.lunar?.chandraMasa ?? ph,
    chandraPaksha: props.lunar?.chandraPaksha ?? ph,
    nakshatra: props.lunar?.nakshatra ?? ph,
    nakshatraPada: props.lunar?.nakshatraPada ?? ph,
    nakshatraGhatyadi: props.lunar?.nakshatraGhatyadi ?? ph,

    tithi: props.tithiBlock?.tithi ?? ph,
    tithiStartGhatyadi: props.tithiBlock?.tithiStartGhatyadi ?? ph,
    bhuktGhatyadi: props.tithiBlock?.bhuktGhatyadi ?? ph,
    bhogyaGhatyadi: props.tithiBlock?.bhogyaGhatyadi ?? ph,
    tithiRefDetails: props.tithiBlock?.tithiRefDetails ?? ph,

    lagna: props.lagnaBlock?.lagna ?? ph,
    navamshaLagna: props.lagnaBlock?.navamshaLagna ?? ph,
    chandraRashi: props.lagnaBlock?.chandraRashi ?? ph,
    rashi: props.lagnaBlock?.rashi ?? ph,

    janmaTime: props.birth?.janmaTime ?? ph,
    janmaSthan: props.birth?.janmaSthan ?? ph,
    standardTimeOffset: props.birth?.standardTimeOffset ?? ph,
    localBirthTime: props.birth?.localBirthTime ?? ph,
    pramanikTime: props.birth?.pramanikTime ?? ph,
    sunriseGhatyadi: props.birth?.sunriseGhatyadi ?? ph,
    gregorianMonth: props.birth?.gregorianMonth ?? ph,
    gregorianDate: props.birth?.gregorianDate ?? ph,

    yoga: props.yogaKarana?.yoga ?? ph,
    karana: props.yogaKarana?.karana ?? ph,

    gotra: props.personal?.gotra ?? ph,
    kula: props.personal?.kula ?? ph,
    spouseName: props.personal?.spouseName ?? ph,
    childName: props.personal?.childName ?? ph,
    syllableAkshara: props.personal?.syllableAkshara ?? ph,
    yoni: props.personal?.yoni ?? ph,
    nadi: props.personal?.nadi ?? ph,
    gana: props.personal?.gana ?? ph,
    varna: props.personal?.varna ?? ph,
    additionalNotes: props.personal?.additionalNotes ?? ph,
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
          <EmRed>GMT {toDevanagariDigits(t.standardTimeOffset)}</EmRed> स्थानीय
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

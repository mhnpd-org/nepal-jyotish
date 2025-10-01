import React from "react";
import {
  translateSanskritSafe,
  placeholder,
  toDevanagariDigits
} from "@internal/lib/devanagari";
/** Interface for Janma Patrika dynamic variables */
export interface JanmaPatrikaTextProps {
  shalivahaniShaka?: string; // वर्ष संख्या (e.g., १९९२)
  veerVikramadityaSamvat?: string; // संवत् (e.g., २०१७)
  adYear?: string; // ईसवीय सन
  samvatsaraName?: string; // संवत्सर नाम (e.g., शुभानु)
  suryaAyana?: string; // उत्तरायण / दक्षिणायन
  ritu?: string; // ऋतु (ग्रीष्म, वर्षा ...)
  chandraMasa?: string; // चान्द्रमास (श्रावण ...)
  chandraPaksha?: string; // पक्ष (शुक्ल / कृष्ण)
  weekday?: string; // वासरः (e.g., शुक्र, सोम)
  tithi?: string; // तिथि (अष्टमी ...)
  tithiStartGhatyadi?: string; // घट्यादिः (प्रथम) e.g., ४०:२४
  nakshatra?: string; // नक्षत्र (रेवती)
  nakshatraGhatyadi?: string; // नक्षत्र घट्यादिः (२०:३५)
  bhuktGhatyadi?: string; // भुक्त घट्यादिः (५२:३०)
  bhogyaGhatyadi?: string; // भोग्य घट्यादिः (५७:००)
  yoga?: string; // योग (सुकर्मा)
  karana?: string; // करण (कौलव इत्यादि)
  solarMonth?: string; // सौर मास (e.g., श्रावण / आषाढ़)
  solarMonthDays?: string; // सूर्यसंक्रमादिनेषु दिन संख्या (३१)
  gregorianMonth?: string; // Gregorian month (जुलाइ)
  gregorianDate?: string; // Gregorian date (१५)
  pramanikTime?: string; // प्रमाणिक समय (१४:३०:००)
  sunriseGhatyadi?: string; // सूर्योदय घट्यादिः (२३:०५:००)
  janmaTime?: string; // जन्म समय (display)
  lagna?: string; // लग्न
  navamshaLagna?: string; // नवमांश लग्न / नवमांशे (मिथुन)
  chandraRashi?: string; // चन्द्र राशि (मीन)
  janmaSthan?: string; // जन्म स्थान निर्देशांक
  standardTimeOffset?: string; // मानक समय +०५:४५
  localBirthTime?: string; // स्थानीय जन्म समय १४:३९:१६
  gotra?: string; // गोत्र
  kula?: string; // कुल
  spouseName?: string; // विवाहिता / भार्या नाम
  childName?: string; // जातक नाम / शुभ नाम
  nakshatraPada?: string; // नक्षत्र चरण (चतुर्थ)
  syllableAkshara?: string; // काराक्षर (ची / क / इत्यादि)
  yoni?: string; // योनि (गज)
  nadi?: string; // नाडी (अन्त्य / आदि / मध्य)
  gana?: string; // गण (देव / मानव / राक्षस)
  varna?: string; // वर्ण (विप्र / क्षत्रिय ...)
  rashi?: string; // राशि (कुम्भ / मीन ...)
  additionalNotes?: string; // अन्य टीका / प्रसंगादय
  tithiRefDetails?: string; // तिथेयः संदर्भ (e.g., शुक्र वासरः ...)
}

/** Janma Patrika React component */
export const JanmaPatrikaText: React.FC<JanmaPatrikaTextProps> = (props) => {
  const ph = placeholder();
  // Destructure with placeholders
  const data = {
    shalivahaniShaka: props.shalivahaniShaka ?? ph,
    veerVikramadityaSamvat: props.veerVikramadityaSamvat ?? ph,
    adYear: props.adYear ?? ph,
    samvatsaraName: props.samvatsaraName ?? ph,
    suryaAyana: props.suryaAyana ?? ph,
    ritu: props.ritu ?? ph,
    chandraMasa: props.chandraMasa ?? ph,
    chandraPaksha: props.chandraPaksha ?? ph,
    weekday: props.weekday ?? ph,
    tithi: props.tithi ?? ph,
    tithiStartGhatyadi: props.tithiStartGhatyadi ?? ph,
    nakshatra: props.nakshatra ?? ph,
    nakshatraGhatyadi: props.nakshatraGhatyadi ?? ph,
    bhuktGhatyadi: props.bhuktGhatyadi ?? ph,
    bhogyaGhatyadi: props.bhogyaGhatyadi ?? ph,
    yoga: props.yoga ?? ph,
    karana: props.karana ?? ph,
    solarMonth: props.solarMonth ?? ph,
    solarMonthDays: props.solarMonthDays ?? ph,
    gregorianMonth: props.gregorianMonth ?? ph,
    gregorianDate: props.gregorianDate ?? ph,
    pramanikTime: props.pramanikTime ?? ph,
    sunriseGhatyadi: props.sunriseGhatyadi ?? ph,
    janmaTime: props.janmaTime ?? ph,
    lagna: props.lagna ?? ph,
    navamshaLagna: props.navamshaLagna ?? ph,
    chandraRashi: props.chandraRashi ?? ph,
    janmaSthan: props.janmaSthan ?? ph,
    standardTimeOffset: props.standardTimeOffset ?? ph,
    localBirthTime: props.localBirthTime ?? ph,
    gotra: props.gotra ?? ph,
    kula: props.kula ?? ph,
    spouseName: props.spouseName ?? ph,
    childName: props.childName ?? ph,
    nakshatraPada: props.nakshatraPada ?? ph,
    syllableAkshara: props.syllableAkshara ?? ph,
    yoni: props.yoni ?? ph,
    nadi: props.nadi ?? ph,
    gana: props.gana ?? ph,
    varna: props.varna ?? ph,
    rashi: props.rashi ?? ph,
    additionalNotes: props.additionalNotes ?? ph,
    tithiRefDetails: props.tithiRefDetails ?? ph
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
    <article className="font-[var(--font-devanagari,inherit)] leading-relaxed font-semibold text-lg md:text-xl tracking-wide selection:bg-rose-100 selection:text-rose-700">
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

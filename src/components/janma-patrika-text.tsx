import React from "react";

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
  const underscore = '____________'
  const {
    shalivahaniShaka = underscore,
    veerVikramadityaSamvat = underscore,
    adYear = underscore,
    samvatsaraName = underscore,
    suryaAyana = underscore,
    ritu = underscore,
    chandraMasa = underscore,
    chandraPaksha = underscore,
    weekday = underscore,
    tithi = underscore,
    tithiStartGhatyadi = underscore,
    nakshatra = underscore,
    nakshatraGhatyadi = underscore,
    bhuktGhatyadi = underscore,
    bhogyaGhatyadi = underscore,
    yoga = underscore,
    karana = underscore,
    solarMonth = underscore,
    solarMonthDays = underscore,
    gregorianMonth = underscore,
    gregorianDate = underscore,
    pramanikTime = underscore,
    sunriseGhatyadi = underscore,
    janmaTime = underscore,
  lagna = underscore,
    navamshaLagna = underscore,
    chandraRashi = underscore,
    janmaSthan = underscore,
    standardTimeOffset = underscore,
    localBirthTime = underscore,
    gotra = underscore,
    kula = underscore,
    spouseName = underscore,
    childName = underscore,
    nakshatraPada = underscore,
    syllableAkshara = underscore,
    yoni = underscore,
    nadi = underscore,
    gana = underscore,
    varna = underscore,
    rashi = underscore,
    additionalNotes = underscore,
    tithiRefDetails = underscore,
  } = props
  return (
    <div
      style={{
        fontFamily: "Noto Sans Devanagari, serif",
        lineHeight: 1.6,
        fontWeight: 700,
        fontSize: "1.25rem",
        textAlign: "center",
      }}
    >
      <p>
        श्रीशालिवाहन शके <span style={{ color:'#ff0000' }}>{shalivahaniShaka}</span> श्रीवीरविक्रमादित्य संवत्
        <span style={{ color:'#ff0000' }}> {veerVikramadityaSamvat}</span> ईसवीय सन्
        <span style={{ color:'#ff0000' }}> {adYear}</span> अत्रास्मिन् वर्षे <span style={{ color:'#245bdb' }}>{samvatsaraName}</span> नाम संवत्सरे
        श्रीसूर्य <span style={{ color:'#245bdb' }}>{suryaAyana}</span> अयने <span style={{ color:'#245bdb' }}>{ritu}</span> ऋतौ
        अथ चान्द्रमानेन <span style={{ color:'#245bdb' }}>{chandraMasa}</span> मासे <span style={{ color:'#245bdb' }}>{chandraPaksha}</span> पक्षे
        आगत <span style={{ color:'#245bdb' }}>{weekday}</span> वासरे <span style={{ color:'#245bdb' }}>{tithi}</span> तिथौ घट्यादिः
        <span style={{ color:'#ff0000' }}> {tithiStartGhatyadi}</span> तत् तिथि <span style={{ color:'#ff0000' }}>{nakshatra}</span> नक्षत्रे घट्यादिः
        <span style={{ color:'#ff0000' }}> {nakshatraGhatyadi}</span> जन्मसमये भुक्त घट्यादिः <span style={{ color:'#ff0000' }}>{bhuktGhatyadi}</span>
        भोग्य घट्यादिः <span style={{ color:'#ff0000' }}>{bhogyaGhatyadi}</span> प्रसंगादय <span style={{ color:'#245bdb' }}>{yoga}</span> योगे
        तात्कालिक <span style={{ color:'#245bdb' }}>{karana}</span> करणे इति पश्चात् सौरमानेन
        <span style={{ color:'#245bdb' }}> {solarMonth}</span> मासे सूर्यसंक्रमादिनेषु <span style={{ color:'#ff0000' }}>{solarMonthDays}</span>
        तदनुसार ( ईसवीय मास <span style={{ color:'#ff0000' }}>{gregorianMonth}</span> तारिखः
        <span style={{ color:'#ff0000' }}> {gregorianDate}</span> ) प्रमाणिक <span style={{ color:'#ff0000' }}>{pramanikTime}</span>
        समये स्थानीय सूर्योदयदिष्ट घट्यादिः <span style={{ color:'#ff0000' }}>{sunriseGhatyadi}</span>
  तदा जन्मसमये <span style={{ color:'#ff0000' }}>{janmaTime}</span> लग्ने <span style={{ color:'#245bdb' }}>{lagna}</span>
        नवमांशे <span style={{ color:'#245bdb' }}>{navamshaLagna}</span> राशौ चन्द्रमसि <span style={{ color:'#245bdb' }}>{chandraRashi}</span> राशिगते
        एवं विधे पश्चात् देशे मण्डले तदनन्तर्गत स्थाने
        (जन्मस्थान <span style={{ color:'#ff0000' }}>{janmaSthan}</span> मानक समय {standardTimeOffset} स्थानीय जन्मसमय
        <span style={{ color:'#ff0000' }}> {localBirthTime}</span>) निवसतः गोत्रोत्पन्न
        <span style={{ color:'#ff0000' }}> {gotra}</span> कुल <span style={{ color:'#ff0000' }}>{kula}</span> विवाहिता भार्याया
        <span style={{ color:'#ff0000' }}> {spouseName}</span> गर्भस्थ रत्नम् अजीजनत्।
      </p>
      <p>
        अस्य होराशास्त्र प्रमाणेन <span style={{ color:'#245bdb' }}>{nakshatra}</span> नक्षत्रस्य
        <span style={{ color:'#ff0000' }}> {nakshatraPada}</span> चरणत्वेन काराक्षरः
        <span style={{ color:'#ff0000' }}> {syllableAkshara}</span> योनि <span style={{ color:'#ff0000' }}>{yoni}</span>
        नाडी <span style={{ color:'#ff0000' }}>{nadi}</span> गण <span style={{ color:'#ff0000' }}>{gana}</span>
        वर्ण <span style={{ color:'#ff0000' }}>{varna}</span> राशि <span style={{ color:'#ff0000' }}>{rashi}</span>
        शुभ नाम <span style={{ color:'#ff0000' }}>{childName}</span> प्रतिष्ठितम्।
        {additionalNotes !== underscore && (
          <> {additionalNotes}</>
        )}
      </p>
      <p>
        तिथेयः विवरणम् : <span style={{ color:'#245bdb' }}>{tithiRefDetails}</span>
      </p>
    </div>
  );
};

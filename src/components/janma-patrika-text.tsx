import React from "react";

/** Interface for Janma Patrika dynamic variables */
export interface JanmaPatrikaTextProps {
  /** Shalivahani Shaka year */
  shalivahaniShaka: number;
  /** Veer Vikramaditya Samvat year */
  veerVikramadityaSamvat: number;
  /** AD / Gregorian year */
  adYear: number;
  /** Kala Yukt (time relevant) */
  kalayukta?: string;
  /** Surya position */
  suryaAyana?: string;
  /** Chandra Month */
  chandraMasa?: string;
  /** Chandra Paksha (Shukla/ Krishna) */
  chandraPaksha?: string;
  /** Tithi */
  tithi?: string;
  /** Nakshatra at tithi */
  nakshatra?: string;
  /** Ghatyadi time of tithi */
  ghatyadiTithi?: string;
  /** Birth time in local hours */
  janmaTime?: string;
  /** Lagna sign at birth */
  lagna?: string;
  /** Chandra Rashi */
  chandraRashi?: string;
  /** Birth place coordinates */
  janmaSthan?: string;
  /** Standard time offset */
  standardTimeOffset?: string;
  /** Local birth time */
  localBirthTime?: string;
  /** Gotra / lineage */
  gotra?: string;
  /** Kula / family */
  kula?: string;
  /** Spouse name */
  spouseName?: string;
  /** Nakshatra pada */
  nakshatraPada?: number;
  /** Karana */
  karana?: string;
  /** Yoni */
  yoni?: string;
  /** Nadi */
  nadi?: string;
  /** Gana */
  gana?: string;
  /** Varna */
  varna?: string;
  /** Rashi chart at birth */
  rashi?: string;
}

/** Janma Patrika React component */
export const JanmaPatrikaText: React.FC<JanmaPatrikaTextProps> = ({
  shalivahaniShaka,
  veerVikramadityaSamvat,
  adYear,
  kalayukta = "कालयुक्त",
  suryaAyana = "दक्षिण",
  chandraMasa = "श्रावण",
  chandraPaksha = "शुक्ल",
  tithi = "नवमी",
  nakshatra = "पूर्वाभाद्र",
  ghatyadiTithi = "१९:३६",
  janmaTime = "१२:४२:३६",
  lagna = "तुला",
  chandraRashi = "मिथुन",
  janmaSthan = "यत्राक्षांश २६:१४ उ. देशान्तः ८५:१४ पू.",
  standardTimeOffset = "+०५:४५",
  localBirthTime = "१२:४२:३६",
  gotra = "____________",
  kula = "____________",
  spouseName = "____________",
  nakshatraPada = 4,
  karana = "तैतिल",
  yoni = "वानर",
  nadi = "नर",
  gana = "श्वान",
  varna = "क्षत्रिय",
  rashi = "वृष",
}) => {
  return (
    <div style={{ fontFamily: "Noto Sans Devanagari, serif", lineHeight: 1.6 }}>
      <p>
        श्रीशालिवाहनीय शक <span style={{ color: "#ff0000" }}>{shalivahaniShaka}</span>, 
        श्रीवीरविक्रमादित्य संवत् <span style={{ color: "#ff0000" }}>{veerVikramadityaSamvat}</span>, 
        ईस्वीय सन <span style={{ color: "#ff0000" }}>{adYear}</span> अत्रास्मिन् वर्षे 
        <span style={{ color: "#245bdb" }}>{kalayukta}</span> नाम संवत्सरे 
        श्रीसूर्य <span style={{ color: "#245bdb" }}>{suryaAyana}</span> अयने वर्षा ऋतौ, 
        अथ चान्द्रमानेन <span style={{ color: "#245bdb" }}>{chandraMasa}</span> मासे 
        <span style={{ color: "#245bdb" }}>{chandraPaksha}</span> वासरे <span style={{ color: "#245bdb" }}>{tithi}</span> तिथौ, 
        घट्यादिः <span style={{ color: "#ff0000" }}>{ghatyadiTithi}</span> ततः नवमी, 
        तिथिः <span style={{ color: "#ff0000" }}>{nakshatra}</span> नक्षत्रे, जन्म समये 
        <span style={{ color: "#ff0000" }}>{janmaTime}</span>, लग्नः <span style={{ color: "#245bdb" }}>{lagna}</span>, 
        नवमांशके <span style={{ color: "#245bdb" }}>{chandraRashi}</span> राशिगते चन्द्रमसि 
        स्थानम् <span style={{ color: "#ff0000" }}>{janmaSthan}</span>, मानक समय {standardTimeOffset}, 
        स्थानिक जन्मसमय <span style={{ color: "#ff0000" }}>{localBirthTime}</span>, गोत्रः {gotra}, कुलः {kula}, 
        विवाहिता भार्या <span style={{ color: "#ff0000" }}>{spouseName}</span>.
      </p>
      <p>
        अस्य होराशास्त्र प्रमाणेण {nakshatra} नक्षत्रस्य {nakshatraPada} चरणत्वेन, 
        करकाक्षरः <span style={{ color: "#ff0000" }}>{karana}</span>, योनि <span style={{ color: "#ff0000" }}>{yoni}</span>, 
        नाडी <span style={{ color: "#ff0000" }}>{nadi}</span>, गण <span style={{ color: "#ff0000" }}>{gana}</span>, 
        वर्ग <span style={{ color: "#ff0000" }}>{varna}</span>, राशिः <span style={{ color: "#ff0000" }}>{rashi}</span>.
      </p>
    </div>
  );
};

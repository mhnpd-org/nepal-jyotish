"use client";
import Image from "next/image";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, JanmaDetails, Kundali} from "@mhnpd/panchang";
import React from "react";
import { JanmaPatrikaText } from "@internal/components/janma-patrika-text";
import NorthDrekkanaChart from "@internal/components/north-drekkana-chart";
import { translateSanskritSafe } from "@internal/lib/devanagari";
import { GrahaTable } from "@internal/components/ghara-table";
import { VimshottariDashaTable } from "@internal/components/vimshottari-dasha-table";
import { TribhagiDashaTable } from "@internal/components/tribhaagi-dasha-table";
import { YoginiDashaTable } from "@internal/components/yogini-dasha-table";
import { ChhinaFrame } from "@internal/components/chhina-frame";

export default function TraditionalPage() {
  const [kundali, setKundali] = React.useState<Kundali | null>(null);
  const [janmaDetails, setJanmaDetails] = React.useState<JanmaDetails | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadKundali = async () => {
      let details: JanmaDetails | undefined;
      try {
        details = getJanmaDetails();
      } catch (e) {
        // Validation failed (likely empty or malformed date/time)
        console.warn("Invalid or missing janma details; redirecting.", e);
      }

      if (!details) {
        if (mounted) window.location.replace("/astro/janma");
        return;
      }
      if (mounted) setJanmaDetails(details);

      try {
        const result = await getKundali(details);
        if (mounted) setKundali(result);
      } catch (error) {
        console.error("Failed to fetch kundali:", error);
        if (mounted) window.location.replace("/astro/janma");
      }
    };

    loadKundali();

    return () => {
      mounted = false;
    };
  }, []);

  if (!kundali) {
    return <div>Loading...</div>;
  }

  /* Traditional Kundali rendering logic goes here */
  return (
    <div className="w-full">
      <ChhinaFrame className="bg-white min-h-screen mx-auto w-full sm:w-11/12 md:w-4/5 xl:w-3/5 max-w-5xl">
        {/* Ganesh image centered near the top with slight spacing */}
        <div className="flex justify-center mt-6">
          <Image
            src="/ganesh.png"
            alt="Ganesh"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>

        {/* Ganesh text */}
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line">
          <p className="text-2xl font-bold text-red-600">
            श्री महालक्ष्म्यै नमः
          </p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            आदित्याद्या ग्रहाः सर्वे साक्षिणः सराशयाः ॥
          </p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            कुर्युः सदा तस्य यत्रैषा जन्मपत्रिका ॥
          </p>
        </div>

        {/* decorative divider */}
        <hr className="my-6 border-t-4 border-red-600 w-1/2 mx-auto" />

        {/* Janma Patrika Text (grouped props) */}
        <JanmaPatrikaText
          era={{
            shaka: `${kundali.dates.sakaSamvat.year}`,
            vikram: `${kundali.dates.vikramSamvat.year}`,
            ad: `${kundali.dates.ishwiSamvat.year}`,
            samvatsara: `${kundali.dates.samvatsara.name}`,
            weekday: `${kundali.dates.ishwiSamvat.vaar?.toLowerCase()}`
          }}
          solar={{
            suryaAyana: kundali.surya.suryaAyana,
            ritu: kundali.surya.ritu,
            solarMonth: `${kundali.surya.masa}`,
            solarMonthDays: `${kundali.surya.sauraMasaDays.toFixed(2)}`,
          }}
          lunar={{
            chandraMasa: kundali.tithi.chandraMasa,
            chandraPaksha: kundali.tithi.paksha,
            nakshatra: kundali.nakshatra.name,
            nakshatraPada: kundali.nakshatra.pada?.toString() || "",
            nakshatraGhatyadi: ""
          }}
          tithiBlock={{
            tithi: kundali.tithi.tithi,
            tithiStartGhatyadi: `${kundali.tithi.tithiStartGhatyadi.toFixed(2)}`,
            bhuktGhatyadi: `${kundali.tithi.bhuktGhatyadi.toFixed(2)}`,
            bhogyaGhatyadi: `${kundali.tithi.bhogyaGhatyadi.toFixed(2)}`,
            tithiRefDetails: ""
          }}
          lagnaBlock={{
            lagna: kundali.lagna.lagna,
            navamshaLagna: kundali.lagna.navamshaLagna,
            chandraRashi: kundali.nakshatra.rashi,
            rashi: kundali.lagna.lagnaLord,
          }}
          birth={{
            janmaTime: kundali.dates.timeStr,
            standardTimeOffset:kundali.dates.timezone,
            localBirthTime: kundali.dates.timeStr,
            pramanikTime: kundali.dates.timeStr,
            sunriseGhatyadi: "", // need sunrise calculation
            gregorianMonth: kundali.dates.ishwiSamvat.month,
            gregorianDate: kundali.dates.zonedDate.toLocaleDateString(),
          }}
          yogaKarana={{
            yoga: kundali.tithi.yoga.name,
            karana: kundali.tithi.karana.name,
          }}
          personal={{
            gotra: "_____",
            kula: "____",
            spouseName: "____",
            childName: "_____",
            syllableAkshara: kundali.nakshatra.syllableAkshara,
            yoni: kundali.nakshatra.yoni,
            nadi: kundali.nakshatra.nadi,
            gana: kundali.nakshatra.gana,
            varna: kundali.nakshatra.varna,
          }}
        />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        <GrahaTable
          planets={kundali.planets}
          translator={translateSanskritSafe}
        />

        {/* Diamond charts grid: 1 per row on small screens, 2 per row on large screens */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 place-items-center">
          <NorthDrekkanaChart
            title="लग्न"
            hideRashi={true}
            houses={kundali.lagnaChart!}
          />
          <NorthDrekkanaChart
            title="राशि"
            hideRashi={true}
            houses={kundali.vargas[1]!}
          />
          <NorthDrekkanaChart
            title={"नवांश (D9)"}
            hideRashi={true}
            houses={kundali.vargas[9]!}
          />
          <NorthDrekkanaChart
            title="भाव"
            hideRashi={true}
            houses={kundali.bhavas}
          />
        </div>

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <VimshottariDashaTable dasha={kundali.vimshottariDasa} />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <TribhagiDashaTable dasha={kundali.tribhagiDasa} />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <YoginiDashaTable dasha={kundali.yoginiDasa} />
      </ChhinaFrame>
    </div>
  );
}

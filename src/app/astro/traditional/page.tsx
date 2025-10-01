"use client";
import Image from "next/image";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, KundaliResult } from "@mhnpd/panchang";
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
  const [kundali, setKundali] = React.useState<KundaliResult | null>(null);
  const [janmaDetails] = React.useState(getJanmaDetails());

  React.useEffect(() => {
    let mounted = true;

    const loadKundali = async () => {
      const janmaDetails = getJanmaDetails();
      if (!janmaDetails) {
        console.warn("Janma details are missing. Redirecting to form page.");
        if (mounted) window.location.replace("/astro/janma");
        return;
      }

      try {
        const result = await getKundali(janmaDetails);
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
      <ChhinaFrame className="bg-white min-h-screen mx-auto w-11/12 md:w-4/5 xl:w-3/5 max-w-5xl">
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
            shaka: String(kundali.sakaSamvat),
            vikram: String(kundali.vikaramSamvat),
            ad: new Date(janmaDetails?.dateStr || "").getFullYear().toString(),
            samvatsara: "________", // samvatsara not available in current kundali structure
            weekday: kundali.vaar
          }}
          solar={{
            suryaAyana: kundali.suryaDetails.ayana,
            ritu: kundali.suryaDetails.ritu,
            solarMonth: kundali.suryaDetails.masa || "",
            solarMonthDays: "________" // days in solar month not provided
          }}
          lunar={{
            chandraMasa: "________", // placeholder until implemented
            chandraPaksha: kundali.tithi.paksha,
            nakshatra: kundali.nakshatra.nakshatra,
            nakshatraPada: kundali.nakshatra.pada?.toString() || "",
            nakshatraGhatyadi: "________" // not yet provided
          }}
          tithiBlock={{
            tithi: kundali.tithi.name,
            tithiStartGhatyadi: "________",
            bhuktGhatyadi: "________",
            bhogyaGhatyadi: "________",
            tithiRefDetails: "________" // can synthesize reference string later
          }}
          lagnaBlock={{
            lagna: kundali.lagna.lagna,
            navamshaLagna: "", // detailed navamsha lagna value not present directly
            chandraRashi: kundali.lagna.chandraRashi,
            rashi: kundali.lagna.lagna
          }}
          birth={{
            janmaTime: kundali.zonedDate.toLocaleString(),
            janmaSthan: "___________",
            standardTimeOffset: "+05:45",
            localBirthTime: kundali.zonedDate.toLocaleTimeString(),
            pramanikTime:
              kundali.zonedDate.toISOString().split("T")[1]?.slice(0, 8) || "",
            sunriseGhatyadi: "", // need sunrise calculation
            gregorianMonth: kundali.zonedDate.toLocaleString(undefined, {
              month: "long"
            }),
            gregorianDate: kundali.zonedDate.getDate().toString()
          }}
          yogaKarana={{
            yoga: kundali.yoga.name,
            karana: kundali.karana.name
          }}
          personal={{
            gotra: "_____",
            kula: "____",
            spouseName: "____",
            childName: "_____",
            syllableAkshara: "_____",
            yoni: "_____",
            nadi: "____",
            gana: "____",
            varna: "____",
            additionalNotes: "____"
          }}
        />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        <GrahaTable
          planets={kundali.planets}
          translator={translateSanskritSafe}
        />

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            title="राशि"
            hideRashi={false}
            houses={kundali.vargas.D1}
          />
        </div>

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            title={"नवांश (D9)"}
            hideRashi={false}
            houses={kundali.vargas.D9}
          />
        </div>

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            title="भाव"
            hideRashi={false}
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

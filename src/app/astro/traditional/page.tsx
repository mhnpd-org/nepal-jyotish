"use client";
import Image from "next/image";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, KundaliResult } from "@mhnpd/panchang";
import React from "react";
import { JanmaPatrikaText } from "@internal/components/janma-patrika-text";
import NorthDrekkanaChart from "@internal/components/north-drekkana-chart";
import { translateSanskritSafe } from "@internal/lib/devanagari";
import { GrahaTable } from "@internal/components/ghara-table";

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
      <div
        style={borderStyle}
        className="bg-white rounded-2xl shadow p-6 min-h-screen mx-auto w-3/5 max-w-4xl"
      >
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

        {/* Janma Patrika Text */}
        <JanmaPatrikaText
          shalivahaniShaka={`${kundali.sakaSamvat}`}
          veerVikramadityaSamvat={`${kundali.vikaramSamvat}`}
          adYear={new Date(janmaDetails?.dateStr || "")
            .getFullYear()
            .toString()}
          janmaTime={`${kundali.zonedDate.toLocaleDateString()}`}
          lagna={`${kundali.lagna.lagna}`}
          chandraRashi={`${kundali.lagna.chandraRashi}`}
          janmaSthan={"janma sthan to be added"}
          rashi={kundali.lagna.lagna}
          suryaAyana={kundali.suryaDetails.ayana}
          ritu={kundali.suryaDetails.ritu}
          chandraMasa={"to be calculated"}
          chandraPaksha={kundali.tithi.paksha}
          weekday={kundali.vaar}
          tithi={kundali.tithi.name}
          tithiStartGhatyadi={"to be calculated"}
          nakshatra={kundali.nakshatra.nakshatra}
          yoga={kundali.yoga.name}
          karana={kundali.karana.name}
        />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        <GrahaTable planets={kundali.planets} translator={translateSanskritSafe} />

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
      </div>
    </div>
  );
}

const borderStyle: React.CSSProperties = {
  borderStyle: "solid",
  // border width controls how much of the image is shown — tweaked to be slimmer
  borderWidth: "20px",
  // Use explicit properties for better control
  borderImageSource: 'url("/border.png")',
  // slice value tuned for a slimmer border
  borderImageSlice: 30,
  borderImageRepeat: "round",
  borderColor: "transparent"
};

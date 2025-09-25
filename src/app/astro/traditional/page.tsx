"use client";
import React from "react";
import Image from "next/image";
import { JanmaPatrikaText } from "@internal/components/janma-patrika-text";
import {
  getJanmaPatrika,
  JanmaDetails,
  TribhaagiDasha,
  VimshottariDasha,
  YoginiDasha
} from "@mhnpd/panchang";
import { getJanmaDetails, loadJanmaForm } from "@internal/utils/janmaStorage";
import { GrahaTable } from "@internal/components/ghara-table";
import { NorthDrekkanaChart } from "@internal/components/north-drekkana-chart";
import { VimshottariDashaTable } from "@internal/components/vimshottari-dasha-table";
import TribhaagiDashaTable from "@internal/components/tribhaagi-dasha-table";
import YoginiDashaTable from "@internal/components/yogini-dasha-table";

export default function TraditionalPage() {
  const dob = loadJanmaForm()
  const { grahaPositions, rashiDetails, vargaKundali, bhavas, dashas } =
    getJanmaPatrika({ ...(getJanmaDetails() as JanmaDetails) });

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
          shalivahaniShaka={'1947'}
          veerVikramadityaSamvat={'2082'}
          adYear={'2025'}
          janmaTime={dob?.datetime}
          lagna={rashiDetails.lagna}
          chandraRashi={rashiDetails.chandraRashi}
          janmaSthan={dob?.place}
        />

        {/* decorative divider */}
        <hr className="my-6 border-t-4 border-red-600 w-1/2 mx-auto" />

        {/* Ghara Position */}
        <GrahaTable data={grahaPositions} />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            lagna={rashiDetails.ascendantLongitude}
            houses={bhavas}
            title="Bhavs"
            size={510}
          />
        </div>

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            lagna={rashiDetails.ascendantLongitude}
            // @ts-expect-error TODO fix types in panchang
            houses={vargaKundali[1]}
            title="Rashi"
            size={510}
          />
        </div>

        {/* Diamond chart */}
        <div className="flex justify-center mt-6">
          <NorthDrekkanaChart
            lagna={rashiDetails.ascendantLongitude}
            // @ts-expect-error TODO fix types in panchang
            houses={vargaKundali[9]}
            title="Navāmśa chart"
            size={510}
          />
        </div>

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        {/* Vimshottari Dasha table */}
        <VimshottariDashaTable
          dasha={dashas?.vimshottari as unknown as VimshottariDasha}
        />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        {/* Tribhaagi Dasha table */}
        <TribhaagiDashaTable
          tribhaagi={dashas?.tribhaagi as unknown as TribhaagiDasha}
        />

        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />
        <div className="mt-6 text-center leading-relaxed whitespace-pre-line" />

        <YoginiDashaTable
          yogini={dashas?.yogini as unknown as YoginiDasha}
        />

      </div>
    </div>
  );
}

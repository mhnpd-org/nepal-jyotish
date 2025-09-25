import React from "react";
import Image from "next/image";
import { JanmaPatrikaText } from "@internal/components/janma-patrika-text";

export default function TraditionalPage() {
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
        className="bg-white rounded-2xl shadow p-6 min-h-screen mx-auto w-4/5 max-w-4xl"
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
          shalivahaniShaka={1947}
          veerVikramadityaSamvat={2082}
          adYear={2025}
          janmaTime="१२:४२:३६"
          lagna="तुला"
          chandraRashi="मिथुन"
          janmaSthan="यत्राक्षांश २६:१४ उ. देशान्तः ८५:१४ पू."
        />
      </div>
    </div>
  );
}

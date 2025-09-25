import React from "react";
import Image from 'next/image';

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
      <div style={borderStyle} className="bg-white rounded-2xl shadow p-6 min-h-screen mx-auto w-4/5 max-w-4xl">
        {/* Ganesh image centered near the top with slight spacing */}
        <div className="flex justify-center mt-6">
          <Image src="/ganesh.png" alt="Ganesh" width={128} height={128} className="object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-amber-800 mb-2 mt-4 text-center">
          Traditional
        </h2>
        <p className="text-sm text-slate-600 text-center">
          Traditional readings and formats will be shown here.
        </p>
      </div>
    </div>
  );
}

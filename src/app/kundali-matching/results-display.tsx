"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MatchKundaliResult, KootaScore } from "@mhnpd-org/panchang";
import type { DistrictOfNepal } from "@internal/form-components/nepal-districts";
import { translateSanskritSafe } from "@internal/lib/devanagari";
import { setFormDetails } from "@internal/utils/get-form-details";

interface PersonFormValues {
  name?: string;
  dateOfBirth: string;
  calendarType: "AD" | "BS";
  timeOfBirth?: string;
  placeOfBirth: DistrictOfNepal;
}

interface MatchingResultsDisplayProps {
  result: MatchKundaliResult;
  onReset: () => void;
  maleData: PersonFormValues;
  femaleData: PersonFormValues;
}

export default function MatchingResultsDisplay({
  result,
  onReset,
  maleData,
  femaleData,
}: MatchingResultsDisplayProps) {
  const router = useRouter();
  const { ashtaKoota, dosha, overallAssessment, rashiCompatibility, nakshatraCompatibility } = result;

  const viewKundali = (personData: PersonFormValues) => {
    // Save to janma form using the same utility
    setFormDetails({
      name: personData.name || '',
      dateOfBirth: personData.dateOfBirth,
      calendarType: personData.calendarType,
      timeOfBirth: personData.timeOfBirth,
      placeOfBirth: personData.placeOfBirth
    });
    // Navigate directly to traditional kundali page
    router.push('/astro/traditional');
  };

  // Use compatibility level from library
  const compatibilityLevel = result.compatibilityLevel || {
    level: "Good",
    levelNp: "राम्रो",
    description: "Good match",
    descriptionNp: "राम्रो मेल",
    threshold: { min: 21, max: 25 }
  };

  // Map compatibility level to UI colors
  const getCompatibilityColor = () => {
    const score = ashtaKoota.totalScore;
    if (score >= 33) return "from-green-500 to-emerald-600";
    if (score >= 26) return "from-green-400 to-green-600";
    if (score >= 21) return "from-blue-400 to-blue-600";
    if (score >= 18) return "from-yellow-400 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  const compatibilityColor = getCompatibilityColor();

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return "text-green-600 dark:text-green-400";
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            कुण्डली मिलान परिणाम
          </h1>
        </div>

        {/* Overall Compatibility Card */}
        <div className={`bg-gradient-to-r ${compatibilityColor} rounded-xl shadow-lg p-4 sm:p-6 mb-6 text-white`}>
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-bold mb-3">
              {ashtaKoota.totalScore}<span className="text-2xl">/36</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {compatibilityLevel.descriptionNp}
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-3xl mx-auto line-clamp-3">
              {overallAssessment.summaryNp || overallAssessment.summary}
            </p>
            
            {/* Important Dosha Warnings */}
            {(dosha.nadiDosha.present || dosha.bhakootDosha.present) && (
              <div className="mt-3 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-xs font-semibold">
                  {dosha.nadiDosha.present && "नाडी दोष"}{dosha.nadiDosha.present && dosha.bhakootDosha.present && "/"}{dosha.bhakootDosha.present && "भकूट दोष"} - ज्योतिष परामर्श आवश्यक
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Couple Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Male Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <span className="text-xl">👨</span>
              वर
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {maleData.name && <p><span className="font-semibold">नाम:</span> {maleData.name}</p>}
              <p><span className="font-semibold">जन्म मिति:</span> {maleData.dateOfBirth}</p>
              <p><span className="font-semibold">जन्म समय:</span> {maleData.timeOfBirth}</p>
              <p><span className="font-semibold">जन्म स्थान:</span> {maleData.placeOfBirth.district_np}</p>
              <p><span className="font-semibold">राशि:</span> {translateSanskritSafe(result.male.rashi)}</p>
              <p><span className="font-semibold">नक्षत्र:</span> {translateSanskritSafe(result.male.nakshatra)} ({result.male.nakshatraPada} पाद)</p>
              <p><span className="font-semibold">गण:</span> {translateSanskritSafe(result.male.gana)}</p>
              <p><span className="font-semibold">नाडी:</span> {translateSanskritSafe(result.male.nadi)}</p>
            </div>
            <button
              onClick={() => viewKundali(maleData)}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
            >
              <span>📜</span>
              कुण्डली हेर्नुहोस्
            </button>
          </div>

          {/* Female Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-pink-100 dark:border-pink-900">
            <h3 className="text-lg font-bold text-pink-900 dark:text-pink-200 mb-3 flex items-center gap-2">
              <span className="text-xl">👩</span>
              वधु
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {femaleData.name && <p><span className="font-semibold">नाम:</span> {femaleData.name}</p>}
              <p><span className="font-semibold">जन्म मिति:</span> {femaleData.dateOfBirth}</p>
              <p><span className="font-semibold">जन्म समय:</span> {femaleData.timeOfBirth}</p>
              <p><span className="font-semibold">जन्म स्थान:</span> {femaleData.placeOfBirth.district_np}</p>
              <p><span className="font-semibold">राशि:</span> {translateSanskritSafe(result.female.rashi)}</p>
              <p><span className="font-semibold">नक्षत्र:</span> {translateSanskritSafe(result.female.nakshatra)} ({result.female.nakshatraPada} पाद)</p>
              <p><span className="font-semibold">गण:</span> {translateSanskritSafe(result.female.gana)}</p>
              <p><span className="font-semibold">नाडी:</span> {translateSanskritSafe(result.female.nadi)}</p>
            </div>
            <button
              onClick={() => viewKundali(femaleData)}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-all"
            >
              <span>📜</span>
              कुण्डली हेर्नुहोस्
            </button>
          </div>
        </div>

        {/* Ashtakoota Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            अष्टकूट गुण मिलान
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {Object.entries(ashtaKoota.kootas).map(([key, value]: [string, KootaScore]) => {
              const labels: Record<string, string> = {
                varna: "वर्ण",
                vashya: "वश्य",
                tara: "तारा",
                yoni: "योनी",
                grahaMaitri: "ग्रह मैत्री",
                gana: "गण",
                bhakoot: "भकूट",
                nadi: "नाडी",
              };

              return (
                <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {labels[key] || key}
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(value.obtained, value.max)}`}>
                    {value.obtained}/{value.max}
                  </div>
                  <div className="text-xs mt-1">
                    <span className={`inline-block px-2 py-1 rounded ${
                      value.verdict === "Good" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      value.verdict === "Average" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {value.verdict === "Good" && "राम्रो"}
                      {value.verdict === "Average" && "सामान्य"}
                      {value.verdict === "Not Compatible" && "कमजोर"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold">तपाईंको अंक: {ashtaKoota.totalScore}/36</span>
              {ashtaKoota.totalScore >= 18 ? " • स्वीकार्य" : " • कम"}
              {(dosha.nadiDosha.present || dosha.bhakootDosha.present) && (
                <span className="text-orange-700 dark:text-orange-400"> • {dosha.nadiDosha.present && "नाडी"}{dosha.nadiDosha.present && dosha.bhakootDosha.present && "/"}{dosha.bhakootDosha.present && "भकूट"} दोष</span>
              )}
            </p>
          </div>
        </div>

        {/* Dosha Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            दोष विश्लेषण
          </h2>

          <div className="space-y-4">
            {/* Manglik Dosha */}
            <div className="border-l-4 border-rose-500 pl-3">
              <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-gray-200">मांगलिक दोष <span className="text-xs font-normal">(Manglik Dosha)</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-300">वर:</p>
                  <p>{dosha.manglikDosha.male.isManglik ? `मांगलिक (${dosha.manglikDosha.male.strength})` : "मांगलिक होइन"}</p>
                </div>
                <div>
                  <p className="font-semibold text-pink-900 dark:text-pink-300">वधु:</p>
                  <p>{dosha.manglikDosha.female.isManglik ? `मांगलिक (${dosha.manglikDosha.female.strength})` : "मांगलिक होइन"}</p>
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-xs">
                  <span className={`font-semibold ${dosha.manglikDosha.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {dosha.manglikDosha.compatible ? "मिलेको" : "नमिलेको"}
                  </span>
                  {dosha.manglikDosha.cancellationPresent && " - निवारण भएको"}
                </p>
                {(dosha.manglikDosha.notesNp || dosha.manglikDosha.notes) && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {dosha.manglikDosha.notesNp || dosha.manglikDosha.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Nadi Dosha */}
            <div className="border-l-4 border-purple-500 pl-3">
              <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-gray-200">नाडी दोष <span className="text-xs font-normal">(Nadi Dosha)</span></h3>
              <p className={`text-sm font-semibold ${dosha.nadiDosha.present ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {dosha.nadiDosha.present ? "नाडी दोष उपस्थित" : "नाडी दोष छैन"}
              </p>
              {dosha.nadiDosha.present && (
                <div className="mt-2 text-xs sm:text-sm space-y-1">
                  <p><span className="font-semibold">गम्भीरता:</span> {dosha.nadiDosha.severity === "High" ? "उच्च" : dosha.nadiDosha.severity === "Medium" ? "मध्यम" : "कम"} (Severity: {dosha.nadiDosha.severity})</p>
                  {dosha.nadiDosha.cancellationPossible && <p className="text-green-600 dark:text-green-400">निवारण सम्भव (Remedies possible)</p>}
                  {(dosha.nadiDosha.notesNp || dosha.nadiDosha.notes) && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {dosha.nadiDosha.notesNp || dosha.nadiDosha.notes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bhakoot Dosha */}
            <div className="border-l-4 border-amber-500 pl-3">
              <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-gray-200">भकूट दोष <span className="text-xs font-normal">(Bhakoot Dosha)</span></h3>
              <p className={`text-sm font-semibold ${dosha.bhakootDosha.present ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {dosha.bhakootDosha.present ? "भकूट दोष उपस्थित" : "भकूट दोष छैन"}
              </p>
              {dosha.bhakootDosha.present && (
                <div className="mt-2 text-xs sm:text-sm space-y-1">
                  <p><span className="font-semibold">गम्भीरता:</span> {dosha.bhakootDosha.severity === "High" ? "उच्च" : dosha.bhakootDosha.severity === "Medium" ? "मध्यम" : "कम"} (Severity: {dosha.bhakootDosha.severity})</p>
                  {dosha.bhakootDosha.cancellationPossible && <p className="text-green-600 dark:text-green-400">निवारण सम्भव (Remedies possible)</p>}
                  {(dosha.bhakootDosha.notesNp || dosha.bhakootDosha.notes) && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {dosha.bhakootDosha.notesNp || dosha.bhakootDosha.notes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Overall Dosha Status */}
            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <p className="font-bold text-sm">
                समग्र दोष स्थिति (Overall Dosha Status):
                <span className={`ml-2 ${
                  dosha.overallDoshaStatus === "Clear" ? "text-green-600 dark:text-green-400" :
                  dosha.overallDoshaStatus === "Manageable" ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {dosha.overallDoshaStatus === "Clear" && "दोषरहित (Clear)"}
                  {dosha.overallDoshaStatus === "Manageable" && "व्यवस्थापन योग्य (Manageable)"}
                  {dosha.overallDoshaStatus === "Severe" && "गम्भीर (Severe)"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Compatibility Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Rashi Compatibility */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span>🌙</span>
              राशि मेल
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className={`font-semibold ${rashiCompatibility.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {rashiCompatibility.compatible ? "मिलेको" : "नमिलेको"}
              </p>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">सम्बन्धको प्रकृति:</p>
                <p>{translateSanskritSafe(rashiCompatibility.relationshipNature)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">भावनात्मक बन्धन:</p>
                <p>{translateSanskritSafe(rashiCompatibility.emotionalBond)}</p>
              </div>
            </div>
          </div>

          {/* Nakshatra Compatibility */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span>⭐</span>
              नक्षत्र मेल
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className={`font-semibold ${nakshatraCompatibility.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {nakshatraCompatibility.compatible ? "मिलेको" : "नमिलेको"}
              </p>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">मानसिक तालमेल:</p>
                <p>{translateSanskritSafe(nakshatraCompatibility.mentalHarmony)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">शारीरिक तालमेल:</p>
                <p>{translateSanskritSafe(nakshatraCompatibility.physicalHarmony)}</p>
              </div>
              {nakshatraCompatibility.remarks && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{nakshatraCompatibility.remarks}</p>
              )}
            </div>
          </div>
        </div>

        {/* Strengths and Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow p-4 border border-green-200 dark:border-green-800">
            <h3 className="text-base font-bold text-green-900 dark:text-green-200 mb-3">
              सकारात्मक
            </h3>
            <ul className="space-y-1.5">
              {(overallAssessment.strengthsNp.length > 0 ? overallAssessment.strengthsNp : overallAssessment.strengths).map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300 line-clamp-2">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg shadow p-4 border border-red-200 dark:border-red-800">
            <h3 className="text-base font-bold text-red-900 dark:text-red-200 mb-3">
              सुधार आवश्यक
            </h3>
            {(overallAssessment.concernsNp.length > 0 ? overallAssessment.concernsNp : overallAssessment.concerns).length > 0 ? (
              <ul className="space-y-1.5">
                {(overallAssessment.concernsNp.length > 0 ? overallAssessment.concernsNp : overallAssessment.concerns).map((concern: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-2">{concern}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">कुनै प्रमुख चिन्ता छैन</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg transition-all"
          >
            नयाँ कुण्डली मिलान
          </button>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold shadow-lg transition-all"
          >
            अन्य सेवाहरू
          </Link>
        </div>
      </div>
    </main>
  );
}

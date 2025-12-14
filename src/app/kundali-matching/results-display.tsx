"use client";

import React from "react";
import type { MatchKundaliResult, KootaScore } from "@mhnpd-org/panchang";
import type { DistrictOfNepal } from "@internal/form-components/nepal-districts";

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
  const { ashtaKoota, dosha, overallAssessment, rashiCompatibility, nakshatraCompatibility, marriageIndicators } = result;

  // Determine compatibility color
  const getCompatibilityColor = () => {
    if (overallAssessment.recommendation === "Highly Compatible") {
      return "from-green-500 to-emerald-600";
    } else if (overallAssessment.recommendation === "Acceptable") {
      return "from-yellow-500 to-orange-500";
    } else {
      return "from-red-500 to-rose-600";
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return "text-green-600 dark:text-green-400";
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with Reset Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            कुण्डली मिलान परिणाम
          </h1>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition-all"
          >
            <span>←</span>
            नयाँ मिलान
          </button>
        </div>

        {/* Overall Compatibility Card */}
        <div className={`bg-gradient-to-r ${getCompatibilityColor()} rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 text-white`}>
          <div className="text-center">
            <div className="text-6xl sm:text-7xl font-bold mb-4">
              {ashtaKoota.totalScore}<span className="text-3xl">/36</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {overallAssessment.recommendation === "Highly Compatible" && "उत्तम मेल"}
              {overallAssessment.recommendation === "Acceptable" && "स्वीकार्य मेल"}
              {overallAssessment.recommendation === "Not Recommended" && "मिलेको छैन"}
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              {overallAssessment.summaryNp || overallAssessment.summary}
            </p>
          </div>
        </div>

        {/* Couple Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Male Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-900">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">👨</span>
              वर
            </h3>
            <div className="space-y-2 text-sm">
              {maleData.name && <p><span className="font-semibold">नाम:</span> {maleData.name}</p>}
              <p><span className="font-semibold">जन्म मिति:</span> {maleData.dateOfBirth}</p>
              <p><span className="font-semibold">जन्म समय:</span> {maleData.timeOfBirth}</p>
              <p><span className="font-semibold">जन्म स्थान:</span> {maleData.placeOfBirth.district_np}</p>
              <p><span className="font-semibold">राशि:</span> {result.male.rashi}</p>
              <p><span className="font-semibold">नक्षत्र:</span> {result.male.nakshatra} ({result.male.nakshatraPada} पाद)</p>
              <p><span className="font-semibold">गण:</span> {result.male.gana}</p>
              <p><span className="font-semibold">नाडी:</span> {result.male.nadi}</p>
            </div>
          </div>

          {/* Female Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-pink-100 dark:border-pink-900">
            <h3 className="text-xl font-bold text-pink-900 dark:text-pink-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">👩</span>
              वधु
            </h3>
            <div className="space-y-2 text-sm">
              {femaleData.name && <p><span className="font-semibold">नाम:</span> {femaleData.name}</p>}
              <p><span className="font-semibold">जन्म मिति:</span> {femaleData.dateOfBirth}</p>
              <p><span className="font-semibold">जन्म समय:</span> {femaleData.timeOfBirth}</p>
              <p><span className="font-semibold">जन्म स्थान:</span> {femaleData.placeOfBirth.district_np}</p>
              <p><span className="font-semibold">राशि:</span> {result.female.rashi}</p>
              <p><span className="font-semibold">नक्षत्र:</span> {result.female.nakshatra} ({result.female.nakshatraPada} पाद)</p>
              <p><span className="font-semibold">गण:</span> {result.female.gana}</p>
              <p><span className="font-semibold">नाडी:</span> {result.female.nadi}</p>
            </div>
          </div>
        </div>

        {/* Ashtakoota Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            अष्टकूट गुण मिलान
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {labels[key] || key}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(value.obtained, value.max)}`}>
                    {value.obtained}/{value.max}
                  </div>
                  <div className="text-xs mt-2">
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

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">न्यूनतम आवश्यक:</span> {ashtaKoota.minimumRequired} अंक
              {ashtaKoota.isAcceptableByScore ? " - ✅ उत्तीर्ण" : " - ❌ अनुत्तीर्ण"}
            </p>
          </div>
        </div>

        {/* Dosha Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            दोष विश्लेषण
          </h2>

          <div className="space-y-6">
            {/* Manglik Dosha */}
            <div className="border-l-4 border-rose-500 pl-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">मांगलिक दोष</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-300">वर:</p>
                  <p>{dosha.manglikDosha.male.isManglik ? `मांगलिक (${dosha.manglikDosha.male.strength})` : "मांगलिक होइन"}</p>
                </div>
                <div>
                  <p className="font-semibold text-pink-900 dark:text-pink-300">वधु:</p>
                  <p>{dosha.manglikDosha.female.isManglik ? `मांगलिक (${dosha.manglikDosha.female.strength})` : "मांगलिक होइन"}</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm">
                  <span className={`font-semibold ${dosha.manglikDosha.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {dosha.manglikDosha.compatible ? "✅ मिलेको" : "❌ नमिलेको"}
                  </span>
                  {dosha.manglikDosha.cancellationPresent && " - दोष निवारण भएको"}
                </p>
                {dosha.manglikDosha.notes && <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{dosha.manglikDosha.notes}</p>}
              </div>
            </div>

            {/* Nadi Dosha */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">नाडी दोष</h3>
              <p className={`text-sm font-semibold ${dosha.nadiDosha.present ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {dosha.nadiDosha.present ? "❌ नाडी दोष उपस्थित" : "✅ नाडी दोष छैन"}
              </p>
              {dosha.nadiDosha.present && (
                <div className="mt-2 text-sm space-y-1">
                  <p>गम्भीरता: {dosha.nadiDosha.severity}</p>
                  {dosha.nadiDosha.cancellationPossible && <p className="text-green-600 dark:text-green-400">निवारण सम्भव</p>}
                  {dosha.nadiDosha.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{dosha.nadiDosha.notes}</p>}
                </div>
              )}
            </div>

            {/* Bhakoot Dosha */}
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">भकूट दोष</h3>
              <p className={`text-sm font-semibold ${dosha.bhakootDosha.present ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {dosha.bhakootDosha.present ? "❌ भकूट दोष उपस्थित" : "✅ भकूट दोष छैन"}
              </p>
              {dosha.bhakootDosha.present && (
                <div className="mt-2 text-sm space-y-1">
                  <p>गम्भीरता: {dosha.bhakootDosha.severity}</p>
                  {dosha.bhakootDosha.cancellationPossible && <p className="text-green-600 dark:text-green-400">निवारण सम्भव</p>}
                  {dosha.bhakootDosha.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{dosha.bhakootDosha.notes}</p>}
                </div>
              )}
            </div>

            {/* Overall Dosha Status */}
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <p className="font-bold text-lg">
                समग्र दोष स्थिति:
                <span className={`ml-2 ${
                  dosha.overallDoshaStatus === "Clear" ? "text-green-600 dark:text-green-400" :
                  dosha.overallDoshaStatus === "Manageable" ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {dosha.overallDoshaStatus === "Clear" && "दोषरहित"}
                  {dosha.overallDoshaStatus === "Manageable" && "व्यवस्थापन योग्य"}
                  {dosha.overallDoshaStatus === "Severe" && "गम्भीर"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Compatibility Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rashi Compatibility */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🌙</span>
              राशि मेल
            </h3>
            <div className="space-y-3 text-sm">
              <p className={`font-semibold ${rashiCompatibility.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {rashiCompatibility.compatible ? "✅ मिलेको" : "❌ नमिलेको"}
              </p>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">सम्बन्धको प्रकृति:</p>
                <p>{rashiCompatibility.relationshipNature}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">भावनात्मक बन्धन:</p>
                <p>{rashiCompatibility.emotionalBond}</p>
              </div>
            </div>
          </div>

          {/* Nakshatra Compatibility */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>⭐</span>
              नक्षत्र मेल
            </h3>
            <div className="space-y-3 text-sm">
              <p className={`font-semibold ${nakshatraCompatibility.compatible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {nakshatraCompatibility.compatible ? "✅ मिलेको" : "❌ नमिलेको"}
              </p>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">मानसिक तालमेल:</p>
                <p>{nakshatraCompatibility.mentalHarmony}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">शारीरिक तालमेल:</p>
                <p>{nakshatraCompatibility.physicalHarmony}</p>
              </div>
              {nakshatraCompatibility.remarks && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{nakshatraCompatibility.remarks}</p>
              )}
            </div>
          </div>
        </div>

        {/* Marriage Indicators */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <span className="text-2xl">💑</span>
            विवाह संकेतकहरू
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-3xl mb-2">⏳</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">विवाह स्थिरता</h4>
              <p className="text-sm">{marriageIndicators.longevityOfMarriage}</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="text-3xl mb-2">❤️</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">स्वास्थ्य मेल</h4>
              <p className="text-sm">{marriageIndicators.healthCompatibility}</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-3xl mb-2">👶</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">सन्तान योग</h4>
              <p className="text-sm">{marriageIndicators.childrenProspects}</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">आर्थिक तालमेल</h4>
              <p className="text-sm">{marriageIndicators.financialHarmony}</p>
            </div>
          </div>
        </div>

        {/* Strengths and Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
              <span>✅</span>
              सकारात्मक पक्षहरू
            </h3>
            <ul className="space-y-2">
              {(overallAssessment.strengthsNp.length > 0 ? overallAssessment.strengthsNp : overallAssessment.strengths).map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-4 flex items-center gap-2">
              <span>⚠️</span>
              सुधार आवश्यक पक्षहरू
            </h3>
            {(overallAssessment.concernsNp.length > 0 ? overallAssessment.concernsNp : overallAssessment.concerns).length > 0 ? (
              <ul className="space-y-2">
                {(overallAssessment.concernsNp.length > 0 ? overallAssessment.concernsNp : overallAssessment.concerns).map((concern: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{concern}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">कुनै प्रमुख चिन्ता छैन</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg transition-all"
          >
            <span>←</span>
            नयाँ कुण्डली मिलान
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition-all"
          >
            <span>🖨️</span>
            प्रिन्ट गर्नुहोस्
          </button>
        </div>
      </div>
    </main>
  );
}

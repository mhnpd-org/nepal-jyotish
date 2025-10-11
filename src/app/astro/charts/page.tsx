"use client";
import React from "react";
import { getJanmaDetails } from "@internal/utils/get-form-details";
import { getKundali, JanmaDetails, Kundali } from "@mhnpd/panchang";
import { DChart } from "@mhnpd/panchang/enum";
import NorthDrekkanaChart from "@internal/components/north-drekkana-chart";
import { 
  getVargaExplanation, 
  STANDARD_VARGAS
} from "@internal/lib/varga-explanations";

export default function ChartsPage() {
  const [kundali, setKundali] = React.useState<Kundali | null>(null);
  const [selectedVarga, setSelectedVarga] = React.useState<number>(1); // Default to D1 (Rashi)
  const [availableVargas, setAvailableVargas] = React.useState<number[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const loadKundali = async () => {
      let details: JanmaDetails | undefined;
      try {
        details = getJanmaDetails();
      } catch (e) {
        console.warn("Invalid or missing janma details; redirecting.", e);
      }

      if (!details) {
        if (mounted) window.location.replace("/astro/janma");
        return;
      }

      try {
        const result = await getKundali(details);
        if (mounted) {
          setKundali(result);
          
          // Determine which vargas are available in the kundali
          const availableSet = new Set<number>([1]); // D1 (bhavas) is always available
          
          // Check which vargas are present in the vargas object
          if (result.vargas) {
            Object.keys(result.vargas).forEach(key => {
              const vargaNum = parseInt(key);
              if (!isNaN(vargaNum) && result.vargas[vargaNum as DChart]) {
                availableSet.add(vargaNum);
              }
            });
          }
          
          setAvailableVargas(Array.from(availableSet).sort((a, b) => a - b));
        }
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-lg text-gray-600">कुण्डली लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  // Get the currently selected chart data
  const getChartData = () => {
    if (selectedVarga === 1) {
      return kundali.bhavas; // D1 Rashi chart
    }
    return kundali.vargas[selectedVarga as DChart] || [];
  };

  const chartData = getChartData();
  const explanation = getVargaExplanation(selectedVarga);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-700 mb-2">
            वर्ग कुण्डली विश्लेषण
          </h1>
          <p className="text-lg text-gray-600">
            Divisional Charts Analysis (D1 - D60)
          </p>
        </div>

        {/* Varga Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            वर्ग चार्ट चयन गर्नुहोस् (Select Divisional Chart):
          </label>
          <select
            value={selectedVarga}
            onChange={(e) => setSelectedVarga(parseInt(e.target.value))}
            className="w-full px-4 py-3 text-lg border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          >
            {availableVargas.map((varga) => {
              const exp = getVargaExplanation(varga);
              return (
                <option key={varga} value={varga}>
                  D{varga} - {exp?.name || `Division ${varga}`}
                  {exp?.nameEnglish ? ` (${exp.nameEnglish})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
              {explanation?.name || `D${selectedVarga}`}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {explanation?.nameEnglish}
            </p>

            {chartData.length > 0 ? (
              <div className="flex justify-center">
                <NorthDrekkanaChart
                  houses={chartData}
                  size={400}
                  title={explanation?.name || `D${selectedVarga} Chart`}
                  hideRashi={false}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">यो वर्ग चार्ट उपलब्ध छैन</p>
                <p className="text-sm">This divisional chart is not available in the data</p>
              </div>
            )}
          </div>

          {/* Explanation Panel */}
          {explanation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-red-700 mb-4 border-b-2 border-red-200 pb-2">
                विवरण र महत्त्व
              </h3>

              {/* Importance Rating */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">महत्त्व (Importance):</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < explanation.importance ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Significations */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-red-600 mr-2">●</span>
                  मुख्य विषयहरू (Primary Significations)
                </h4>
                <ul className="space-y-2 ml-6">
                  {explanation.significations.map((sig, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start">
                      <span className="text-red-500 mr-2 mt-1">▸</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas of Life */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-red-600 mr-2">●</span>
                  जीवन क्षेत्रहरू (Areas of Life)
                </h4>
                <ul className="space-y-2 ml-6">
                  {explanation.areasOfLife.map((area, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start">
                      <span className="text-red-500 mr-2 mt-1">▸</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traditional Interpretation */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-red-600 mr-2">●</span>
                  परम्परागत व्याख्या (Traditional Interpretation)
                </h4>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-gray-800 leading-relaxed text-justify">
                    {explanation.interpretation}
                  </p>
                </div>
              </div>

              {/* Additional Note for important charts */}
              {explanation.importance >= 4 && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-yellow-700">विशेष नोट:</span> यो अत्यन्त महत्त्वपूर्ण वर्ग कुण्डली हो र यसको विस्तृत विश्लेषण अनिवार्य मानिन्छ।
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">Note:</span> This is a highly important divisional chart and requires detailed analysis.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4">
            प्रमुख वर्ग कुण्डलीहरू (Important Divisional Charts)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STANDARD_VARGAS.map((varga) => {
              const exp = getVargaExplanation(varga);
              const isAvailable = availableVargas.includes(varga);
              const isSelected = selectedVarga === varga;
              
              return (
                <button
                  key={varga}
                  onClick={() => isAvailable && setSelectedVarga(varga)}
                  disabled={!isAvailable}
                  className={`p-3 rounded-lg text-center transition-all ${
                    isSelected
                      ? "bg-red-600 text-white shadow-lg scale-105"
                      : isAvailable
                      ? "bg-orange-100 text-gray-800 hover:bg-orange-200 hover:shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  title={exp?.nameEnglish}
                >
                  <div className="font-bold text-lg">D{varga}</div>
                  <div className="text-xs mt-1 truncate">
                    {exp?.name.split("(")[0].trim() || `Division ${varga}`}
                  </div>
                  {exp && (
                    <div className="flex justify-center mt-1">
                      {Array.from({ length: exp.importance }, (_, i) => (
                        <span key={i} className={`text-xs ${isSelected ? "text-yellow-300" : "text-yellow-500"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* General Information */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4">
            वर्ग कुण्डली परिचय (About Divisional Charts)
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
            <p className="leading-relaxed">
              <strong>वर्ग कुण्डली (Varga Kundali)</strong> वैदिक ज्योतिषको अत्यन्त महत्त्वपूर्ण भाग हो। मुख्य राशि कुण्डली (D1) बाहेक, विभिन्न वर्ग कुण्डलीहरू जीवनका विशिष्ट क्षेत्रहरूको गहन विश्लेषण प्रदान गर्दछन्।
            </p>
            <p className="leading-relaxed">
              प्रत्येक राशिलाई विभिन्न भागमा विभाजन गरेर बनाइएका यी कुण्डलीहरूले जन्म कुण्डलीको सूक्ष्म विवरण प्रकट गर्दछन्। <strong>D1 देखि D60 सम्म</strong> कुल ६० वर्ग कुण्डलीहरू छन्, तर तीमध्ये केही विशेष महत्त्वपूर्ण मानिन्छन्।
            </p>
            <p className="leading-relaxed">
              <strong>षोडश वर्ग (Shodasavarga - 16 divisions)</strong> र <strong>षड्वर्ग (Shadvarga - 6 divisions)</strong> परम्परागत ज्योतिषमा विशेष प्रचलित छन्। नवमांश (D9) र दशमांश (D10) सबैभन्दा महत्त्वपूर्ण मानिन्छन्।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

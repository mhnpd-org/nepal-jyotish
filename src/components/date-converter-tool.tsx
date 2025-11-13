'use client';

import { useState } from 'react';
import NepaliDate from 'nepali-date-converter';

export default function DateConverterTool() {
  const [conversionType, setConversionType] = useState<'bs-to-ad' | 'ad-to-bs'>('bs-to-ad');
  
  // BS to AD states
  const [bsYear, setBsYear] = useState<string>('');
  const [bsMonth, setBsMonth] = useState<string>('');
  const [bsDay, setBsDay] = useState<string>('');
  
  // AD to BS states
  const [adYear, setAdYear] = useState<string>('');
  const [adMonth, setAdMonth] = useState<string>('');
  const [adDay, setAdDay] = useState<string>('');
  
  // Result state
  const [result, setResult] = useState<{ date: string; dayName: string; error?: string } | null>(null);

  const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
  ];

  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];
  const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleConvert = () => {
    try {
      setResult(null);
      
      if (conversionType === 'bs-to-ad') {
        // Convert BS to AD
        const year = parseInt(bsYear);
        const month = parseInt(bsMonth);
        const day = parseInt(bsDay);
        
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 32) {
          throw new Error('कृपया मान्य मिति प्रविष्ट गर्नुहोस्');
        }
        
        const nepaliDate = new NepaliDate(year, month - 1, day);
        const adDate = nepaliDate.toJsDate();
        
        const dayName = englishDays[adDate.getDay()];
        
        setResult({
          date: `${englishMonths[adDate.getMonth()]} ${adDate.getDate()}, ${adDate.getFullYear()}`,
          dayName: dayName
        });
      } else {
        // Convert AD to BS
        const year = parseInt(adYear);
        const month = parseInt(adMonth);
        const day = parseInt(adDay);
        
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
          throw new Error('Please enter a valid date');
        }
        
        const adDate = new Date(year, month - 1, day);
        const nepaliDate = new NepaliDate(adDate);
        
        const bsYear = nepaliDate.getYear();
        const bsMonth = nepaliDate.getMonth();
        const bsDay = nepaliDate.getDate();
        
        const dayName = nepaliDays[adDate.getDay()];
        
        setResult({
          date: `${nepaliMonths[bsMonth]} ${bsDay}, ${bsYear}`,
          dayName: dayName
        });
      }
    } catch (error) {
      setResult({
        date: '',
        dayName: '',
        error: error instanceof Error ? error.message : 'रूपान्तरण असफल भयो'
      });
    }
  };

  const handleReset = () => {
    setBsYear('');
    setBsMonth('');
    setBsDay('');
    setAdYear('');
    setAdMonth('');
    setAdDay('');
    setResult(null);
  };

  const setToday = () => {
    const today = new Date();
    if (conversionType === 'ad-to-bs') {
      setAdYear(today.getFullYear().toString());
      setAdMonth((today.getMonth() + 1).toString());
      setAdDay(today.getDate().toString());
    } else {
      const nepaliToday = new NepaliDate(today);
      setBsYear(nepaliToday.getYear().toString());
      setBsMonth((nepaliToday.getMonth() + 1).toString());
      setBsDay(nepaliToday.getDate().toString());
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Conversion Type Toggle */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setConversionType('bs-to-ad');
            setResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            conversionType === 'bs-to-ad'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="text-sm sm:text-base">🇳🇵 नेपाली → अंग्रेजी</span>
        </button>
        <button
          onClick={() => {
            setConversionType('ad-to-bs');
            setResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            conversionType === 'ad-to-bs'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="text-sm sm:text-base">🌐 अंग्रेजी → नेपाली</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        {conversionType === 'bs-to-ad' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                नेपाली मिति प्रविष्ट गर्नुहोस् (BS)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="वर्ष (२०८१)"
                    value={bsYear}
                    onChange={(e) => setBsYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1970"
                    max="2100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Year</p>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="महिना (१-१२)"
                    value={bsMonth}
                    onChange={(e) => setBsMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1"
                    max="12"
                  />
                  <p className="text-xs text-gray-500 mt-1">Month</p>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="दिन (१-३२)"
                    value={bsDay}
                    onChange={(e) => setBsDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1"
                    max="32"
                  />
                  <p className="text-xs text-gray-500 mt-1">Day</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter English Date (AD)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Year (2024)"
                    value={adYear}
                    onChange={(e) => setAdYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1913"
                    max="2043"
                  />
                  <p className="text-xs text-gray-500 mt-1">वर्ष</p>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Month (1-12)"
                    value={adMonth}
                    onChange={(e) => setAdMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1"
                    max="12"
                  />
                  <p className="text-xs text-gray-500 mt-1">महिना</p>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Day (1-31)"
                    value={adDay}
                    onChange={(e) => setAdDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    min="1"
                    max="31"
                  />
                  <p className="text-xs text-gray-500 mt-1">दिन</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            रूपान्तरण गर्नुहोस्
          </button>
          <button
            onClick={setToday}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            आजको मिति
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            रिसेट
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          {result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">❌ {result.error}</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-2">
                {conversionType === 'bs-to-ad' ? 'English Date (AD):' : 'नेपाली मिति (BS):'}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-3">{result.date}</p>
              <div className="flex items-center gap-2 text-rose-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{result.dayName}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          जानकारी
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• नेपाली पात्रो (BS) वर्ष सीमा: १९७० देखि २१०० सम्म</li>
          <li>• अंग्रेजी (AD) वर्ष सीमा: १९१३ देखि २०४३ सम्म</li>
        </ul>
      </div>
    </div>
  );
}

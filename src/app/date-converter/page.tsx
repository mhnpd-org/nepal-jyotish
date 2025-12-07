import Link from 'next/link';
import AppHeader from '@internal/layouts/app-header';
import Footer from '@internal/layouts/footer';
import DateConverterTool from '@internal/components/date-converter-tool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepali Date Converter | BS to AD & AD to BS | Nepal Jyotish',
  description: 'Free Nepali Date Converter - Convert between Nepali (Bikram Sambat/BS) and English (AD) dates easily. मिति परिवर्तक: नेपाली र अंग्रेजी मिति बीच सजिलै रूपान्तरण गर्नुहोस्।',
  keywords: [
    'Nepali Date Converter',
    'BS to AD',
    'AD to BS',
    'Bikram Sambat',
    'मिति परिवर्तक',
    'नेपाली पात्रो',
    'Date Conversion',
    'Nepali Calendar',
    'Nepal Date',
    'BS AD Converter'
  ],
  openGraph: {
    title: 'Nepali Date Converter | BS ↔ AD',
    description: 'Convert between Nepali (BS) and English (AD) dates instantly. Free online Nepali date converter tool.',
    url: 'https://nepaljyotish.org/date-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Nepali Date Converter | BS to AD & AD to BS',
    description: 'Convert between Nepali and English dates easily',
  },
  alternates: {
    canonical: '/date-converter',
  },
};

export default function DateConverterPage() {
  return (
    <main className="min-h-screen bg-vedanga-gradient">
      <AppHeader variant="transparent" language="np" currentPage="date-converter" backgroundGradient="bg-vedanga-gradient" />

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Nepali Date Converter
          </h1>
          <p className="text-lg text-white/90 drop-shadow mb-2">
            Convert between Nepali (BS) and English (AD) dates easily
          </p>
          <p className="text-base text-white/80 drop-shadow">
            नेपाली मिति र अंग्रेजी मिति बीच सजिलै रूपान्तरण गर्नुहोस्
          </p>
        </div>

        {/* Converter Tool - Client Component */}
        <DateConverterTool />

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">नेपाली पात्रो बारे</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              नेपाली पात्रो (विक्रम संवत) सौर्य पात्रो हो जुन नेपालमा आधिकारिक रूपमा प्रयोग गरिन्छ। 
              यो पात्रो हिन्दू धर्म र नेपाली संस्कृतिमा गहिरो जरा भएको छ।
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">उपयोगी लिङ्कहरू</h3>
            <div className="space-y-2">
              <Link 
                href="/astro/janma" 
                className="block text-rose-700 hover:text-rose-800 text-sm font-medium transition-colors"
              >
                → जन्म कुण्डली बनाउनुहोस्
              </Link>
              <Link 
                href="/blogs" 
                className="block text-rose-700 hover:text-rose-800 text-sm font-medium transition-colors"
              >
                → ज्योतिष लेखहरू पढ्नुहोस्
              </Link>
              <Link 
                href="/" 
                className="block text-rose-700 hover:text-rose-800 text-sm font-medium transition-colors"
              >
                → गृहपृष्ठमा फर्कनुहोस्
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </main>
  );
}

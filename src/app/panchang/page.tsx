import Link from 'next/link';
import AppHeader from '@internal/layouts/app-header';
import Footer from '@internal/layouts/footer';
import DailyPanchang from '@internal/components/daily-panchang';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'आजको पञ्चाङ्ग | Daily Panchang | Nepal Jyotish',
  description: 'आजको पञ्चाङ्ग - तिथि, नक्षत्र, योग, करण सहित दैनिक पञ्चाङ्ग। Daily Panchang based on Vedic Jyotish and Surya Siddhanta. View today\'s tithi, nakshatra, yoga, and karana.',
  keywords: [
    'आजको पञ्चाङ्ग',
    'Daily Panchang',
    'Nepali Panchang',
    'तिथि',
    'Tithi',
    'नक्षत्र',
    'Nakshatra',
    'योग',
    'Yoga',
    'करण',
    'Karana',
    'Vedic Calendar',
    'Hindu Calendar',
    'Nepal Calendar',
    'Panchanga'
  ],
  openGraph: {
    title: 'आजको पञ्चाङ्ग | Daily Panchang',
    description: 'View today\'s Panchang with tithi, nakshatra, yoga, and karana based on Vedic Jyotish',
    url: 'https://nepaljyotish.org/panchang',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'आजको पञ्चाङ्ग | Daily Panchang',
    description: 'Today\'s Panchang - Tithi, Nakshatra, Yoga, Karana',
  },
  alternates: {
    canonical: '/panchang',
  },
};

export default function PanchangPage() {
  return (
    <main className="min-h-screen bg-vedanga-gradient">
      <AppHeader variant="transparent" language="np" currentPage="panchang" backgroundGradient="bg-vedanga-gradient" />

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            आजको पञ्चाङ्ग
          </h1>
          <p className="text-lg text-white/90 drop-shadow mb-2">
            Daily Panchang - Tithi, Nakshatra, Yoga, Karana
          </p>
          <p className="text-base text-white/80 drop-shadow">
            वैदिक ज्योतिष र सूर्य सिद्धान्तमा आधारित दैनिक पञ्चाङ्ग
          </p>
        </div>

        {/* Panchang Component */}
        <DailyPanchang />

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">पञ्चाङ्ग के हो?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              पञ्चाङ्ग भनेको पाँच अङ्गहरू (तिथि, वार, नक्षत्र, योग र करण) भएको हिन्दू पात्रो हो। 
              यसले शुभ मुहूर्त निर्धारण गर्न र धार्मिक कार्यहरू सम्पादन गर्न मद्दत गर्छ।
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
                href="/date-converter" 
                className="block text-rose-700 hover:text-rose-800 text-sm font-medium transition-colors"
              >
                → मिति परिवर्तक प्रयोग गर्नुहोस्
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

        {/* Panchang Elements Explanation */}
        <div className="mt-8 bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">पञ्चाङ्गका तत्वहरू</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-rose-700 mb-2">तिथि (Tithi)</h4>
              <p className="text-sm text-gray-700">
                चन्द्रमा र सूर्यबीचको कोणीय दूरीमा आधारित २७-३० घण्टा लामो खगोलीय एकाइ।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-rose-700 mb-2">नक्षत्र (Nakshatra)</h4>
              <p className="text-sm text-gray-700">
                २७ नक्षत्रहरू चन्द्रमाको स्थितिको आधारमा निर्धारण गरिन्छ।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-rose-700 mb-2">योग (Yoga)</h4>
              <p className="text-sm text-gray-700">
                सूर्य र चन्द्रमाको संयुक्त गतिबाट निर्धारण हुने २७ योगहरू।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-rose-700 mb-2">करण (Karana)</h4>
              <p className="text-sm text-gray-700">
                तिथिको आधा भाग, ११ प्रकारका करणहरू हुन्छन्।
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </main>
  );
}

import Link from "next/link";
import BlogCard from "@internal/components/blog-card";
import AppsSection from "@internal/components/apps-section";
import DailyPanchangCompact from "@internal/components/daily-panchang-compact";
import MainHeader from "@internal/layouts/main-header";
import Footer from "@internal/layouts/footer";
import { getRecentBlogPosts } from "@internal/lib/blogs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "नेपाली कुण्डली निर्माण | परम्परागत नेपाली जन्मकुण्डली निर्माण - हाम्रो ज्योतिष",
  description: "नेपाल ज्योतिष - निःशुल्क परम्परागत नेपाली जन्मकुण्डली निर्माण र कुण्डली बनाउने उपकरण। Vedic Jyotish based on Surya Siddhanta (सूर्य सिद्धान्त)। Create accurate birth charts (जन्म पत्रिका), view planetary motions (ग्रह गति), calculate Vimshottari, Yogini, Tribhagi Dasha. Hamro Jyotish, Mero Jyotish - Traditional kundali maker for all Nepali.",
  keywords: [
    "Nepali kundali Maker",
    "नेपाली जन्मकुण्डली निर्माण",
    "Traditional Kundali",
    "परम्परागत कुण्डली",
    "Hamro Jyotish",
    "Mero Jyotish",
    "हाम्रो ज्योतिष",
    "मेरो ज्योतिष",
    "Surya Siddhanta",
    "सूर्य सिद्धान्त",
    "Vedic Jyotish",
    "वैदिक ज्योतिष",
    "Free kundali Maker",
    "निःशुल्क चाइना",
    "Nepali Jyotish Online",
    "Traditional Astrology Nepal",
    "जन्म पत्रिका",
    "Janma Patrika",
    "Planetary Motion",
    "ग्रह गति"
  ],
  openGraph: {
    title: "नेपाली कुण्डली निर्माण | Traditional Nepali Kundali",
    description: "Free Traditional Nepali Kundali Maker based on Vedic Jyotish and Surya Siddhanta. Create birth charts, view planetary motions. Hamro Jyotish, Mero Jyotish.",
    url: "https://nepaljyotish.org",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'नेपाली कुण्डली निर्माण | Traditional Nepali Kundali & Kundali',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "नेपाली कुण्डली निर्माण | Traditional Nepali Kundali",
    description: "Free Traditional Nepali Kundali Maker based on Vedic Jyotish and Surya Siddhanta",
  },
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  // Get 8 recent blog posts from MDX files (Nepali only)
  const blogs = getRecentBlogPosts(8, 'np');


  return (
    <main className="min-h-screen bg-vedanga-gradient">
      <MainHeader variant="transparent" />

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative overflow-hidden" aria-labelledby="hero-heading">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Large circle top right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          {/* Medium circle bottom left */}
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl"></div>
          {/* Small accent circle */}
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-rose-400/8 rounded-full blur-xl"></div>
          
          {/* Geometric shapes */}
          <svg className="absolute top-20 right-12 w-24 h-24 text-white/5" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,15 90,85 10,85" />
          </svg>
          <svg className="absolute bottom-32 right-1/3 w-16 h-16 text-amber-200/10" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
          <div className="absolute top-1/2 right-20 w-20 h-20 border-2 border-white/5 rounded-lg rotate-45"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
          {/* Left column: text */}
          <div className="flex-1 max-w-3xl">
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            नेपाली ज्योतिष<br />
            <span className="text-amber-200">परम्परागत कुण्डली निर्माण</span>
          </h1>
          <p className="mt-6 text-xl text-white/95 leading-relaxed max-w-2xl drop-shadow">
            वैदिक ज्योतिष र सूर्य सिद्धान्त (Surya Siddhanta) मा आधारित निःशुल्क परम्परागत नेपाली कुण्डली निर्माण,
            जन्म पत्रिका निर्माण, ग्रह गति अवलोकन, र दशा गणना — सबै एकै ठाउँमा।
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/astro/janma"
              className="px-5 sm:px-6 py-3 bg-white text-rose-700 font-semibold rounded-lg hover:bg-white/95 transition-colors shadow-lg text-sm sm:text-base whitespace-nowrap"
              aria-label="कुण्डली बनाउन एप खोल्नुहोस्"
            >
              कुण्डली बनाउनुहोस्
            </Link>
            <Link
              href="/blogs"
              className="px-5 sm:px-6 py-3 text-white font-medium hover:text-amber-200 transition-colors text-sm sm:text-base whitespace-nowrap border-2 border-white rounded-lg hover:bg-white/10"
              aria-label="ज्योतिष लेखहरू पढ्नुहोस्"
            >
              लेखहरू पढ्नुहोस् →
            </Link>
          </div>
          </div>

          {/* Right column: Compact Daily Panchang */}
          <div className="w-full md:w-auto flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="w-full max-w-[340px] md:min-w-[400px] md:max-w-[440px] lg:min-w-[440px] lg:max-w-[480px]">
              <DailyPanchangCompact />
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <AppsSection />

      {/* Features section */}
      <section className="bg-[rgba(255,255,250,0.92)] backdrop-blur" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 id="features-heading" className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-2">
            मुख्य सुविधाहरू
          </h2>
          <p className="text-3xl font-bold text-gray-900 mb-8">
            परम्परागत कुण्डली र वैदिक ज्योतिष विशेषताहरू
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">परम्परागत चाइना (Janma Patrika)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                सूर्य सिद्धान्त (Surya Siddhanta) आधारित सटीक खगोलीय गणनाबाट पूर्ण जन्म कुण्डली तुरुन्तै तयार गर्नुहोस्। 
                तपाईंको जन्म मिति, समय र स्थानको आधारमा Traditional Nepali kundali Chart।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>राशि चक्र र नवांश कुण्डली (Rashi & Navamsa)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>सभै वर्ग चार्टहरू (D1-D60 Divisional Charts)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>ग्रह योग र दोष विश्लेषण (Yoga & Dosha Analysis)</span>
                </li>
              </ul>
            </article>

            <article className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ग्रह गति र स्थिति (Planetary Motion)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vedic Jyotish अनुसार नौ ग्रहहरूको विस्तृत स्थिति, गति, राशि, नक्षत्र, र तिनीहरूको प्रभाव तपाईंको जीवनमा सरल भाषामा बुझ्नुहोस्।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>ग्रह बल र शुभाशुभ फल (Graha Bala & Effects)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>नक्षत्र र पाद विवरण (Nakshatra Details)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>भाव स्वामी र योगकारक ग्रह (House Lords & Yoga Karaka)</span>
                </li>
              </ul>
            </article>

            <article className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">दशा प्रणाली (Dasha Systems)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Traditional Vedic Dasha systems मार्फत तपाईंको जीवनको विभिन्न कालखण्डहरूको भविष्यवाणी र विश्लेषण गर्नुहोस्।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>विंशोत्तरी दशा (Vimshottari Dasha - 120 वर्ष)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>योगिनी दशा (Yogini Dasha - 36 वर्ष)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>त्रिभागी दशा र अन्तर्दशा (Tribhagi Dasha)</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
              नयाँ लेखहरू
            </h2>
            <p className="text-2xl font-bold text-white drop-shadow">ज्योतिष ज्ञान</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <BlogCard key={b.title} title={b.title} excerpt={b.excerpt} href={b.slug} />
          ))}
        </div>
        
        {/* View all blogs link if we have actual blog posts */}
        {blogs.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-medium rounded-lg hover:bg-white/95 transition-colors shadow-sm"
            >
              <span>सबै लेखहरू हेर्नुहोस्</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer variant="dark" />
    </main>
  );
}

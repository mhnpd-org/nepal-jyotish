import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@internal/layouts/footer";
import Logo from "@internal/layouts/logo";
import ContactForm from "@internal/components/contact-form";

export const metadata: Metadata = {
  title: "सम्पर्क गर्नुहोस् | Contact Us - Nepal Jyotish",
  description: "नेपाल ज्योतिष सेवामा कुनै समस्या भएमा वा गलत जानकारी फेला पर्दा हामीलाई सम्पर्क गर्नुहोस्। Contact Nepal Jyotish for any issues with the kundali software or incorrect data.",
  keywords: [
    "Nepal Jyotish Contact",
    "नेपाल ज्योतिष सम्पर्क",
    "Kundali Support",
    "कुण्डली सहायता",
    "Jyotish Help",
    "ज्योतिष सहायता",
    "Report Issue",
    "समस्या रिपोर्ट"
  ],
  openGraph: {
    title: "सम्पर्क गर्नुहोस् | Contact Us - Nepal Jyotish",
    description: "हामीलाई सम्पर्क गर्नुहोस् यदि तपाईंलाई कुण्डली सफ्टवेयर प्रयोग गर्दा कुनै समस्या आयो वा गलत जानकारी फेला पर्यो।",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-vedanga-gradient">
      {/* Header */}
      <header className="bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" variant="light" />

          <nav className="flex items-center gap-6" aria-label="Navigation">
            <Link 
              href="/blogs" 
              className="text-sm text-white/90 hover:text-white transition-colors"
              aria-label="ज्योतिष लेखहरू पढ्नुहोस्"
            >
              लेखहरू
            </Link>
            <Link 
              href="/astro/janma" 
              className="px-4 py-2 bg-white text-rose-700 text-sm font-medium rounded-lg hover:bg-white/95 transition-colors shadow-sm"
              aria-label="नेपाली जन्मकुण्डली बनाउनुहोस्"
            >
              एप खोल्नुहोस्
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            हामीलाई <span className="text-amber-200">सम्पर्क गर्नुहोस्</span>
          </h1>
          <p className="text-xl text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow">
            यदि तपाईंलाई कुण्डली सफ्टवेयर प्रयोग गर्दा कुनै समस्या आयो वा जानकारीमा कुनै गल्ती फेला पर्यो भने 
            कृपया हामीलाई जानकारी दिनुहोस्। तपाईंको प्रतिक्रियाले हाम्रो सेवालाई सुधार गर्न मद्दत गर्छ।
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">
              समस्या रिपोर्ट गर्नुहोस्
            </h2>
            <p className="text-gray-600 leading-relaxed">
              निम्न फारम भरेर हामीलाई जानकारी दिनुहोस्। हामी छिट्टै तपाईंको समस्यालाई समाधान गर्ने प्रयास गर्नेछौं।
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Common Issues */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L4.216 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              सामान्य समस्याहरू
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1 text-xs">•</span>
                <span>जन्म समय र स्थानमा त्रुटि</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1 text-xs">•</span>
                <span>ग्रह स्थिति गलत देखिएको</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1 text-xs">•</span>
                <span>दशा गणनामा समस्या</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1 text-xs">•</span>
                <span>चार्ट प्रिन्ट वा डाउनलोड नहुने</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1 text-xs">•</span>
                <span>मोबाइलमा डिस्प्ले समस्या</span>
              </li>
            </ul>
          </div>

          {/* What to Include */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              सन्देशमा समावेश गर्नुहोस्
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 text-xs">•</span>
                <span>तपाईंको जन्म मिति र समय</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 text-xs">•</span>
                <span>जन्म स्थान (जिल्ला)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 text-xs">•</span>
                <span>कुन पृष्ठमा समस्या देखा परेको</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 text-xs">•</span>
                <span>के समस्या आएको छ विस्तारमा</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 text-xs">•</span>
                <span>तपाईंले प्रयोग गरेको डिभाइस र ब्राउजर</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Back to App */}
        <div className="mt-12 text-center">
          <Link
            href="/astro/janma"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-semibold rounded-lg hover:bg-white/95 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>कुण्डली एपमा फर्कनुहोस्</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer variant="dark" />
    </main>
  );
}
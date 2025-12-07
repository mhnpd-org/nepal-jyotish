import Link from 'next/link';

interface AppCard {
  title: string;
  titleEnglish?: string;
  description: string;
  icon: string;
  href: string;
  gradient: string;
  features?: string[];
}

const apps: AppCard[] = [
  {
    title: 'जन्म-कुण्डली निर्माण',
    titleEnglish: 'Janma Kundali Maker',
    description: 'सटीक तथा निःशुल्क परम्परागत नेपाली जन्म-कुण्डली निर्माण गर्नुहोस्। सूर्य-सिद्धान्ताधारित वैदिक ज्योतिष।',
    icon: '📜',
    href: '/astro/janma',
    gradient: 'from-rose-500 to-orange-500',
    features: ['राशिचक्र', 'नवांश-कुण्डली', 'दशा-गणना']
  },
  {
    title: 'आजको पञ्चाङ्ग',
    titleEnglish: 'Daily Panchang',
    description: 'आजको तिथि, नक्षत्र, योग–करण अवलोकन गर्नुहोस्। वैदिक ज्योतिषाधारित दैनिक पञ्चाङ्ग।',
    icon: '🌙',
    href: '/panchang',
    gradient: 'from-indigo-500 to-purple-500',
    features: ['तिथि', 'नक्षत्र', 'योग–करण']
  },
  {
    title: 'मिति परिवर्तक',
    titleEnglish: 'Nepali Date Converter',
    description: 'नेपाली र अङ्ग्रेजी मिति बीच सहज रूपान्तरण गर्नुहोस्। BS ↔ AD',
    icon: '📅',
    href: '/date-converter',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['BS → AD', 'AD → BS', 'बार अवलोकन गर्नुहोस्']
  },
  {
    title: 'ज्योतिष लेखहरू',
    titleEnglish: 'Astrology Blogs',
    description: 'नेपाली ज्योतिष, कुण्डली, ग्रह-योग, नक्षत्र तथा दशा सम्बन्धी विस्तृत लेखहरू अध्ययन गर्नुहोस्।',
    icon: '📚',
    href: '/blogs',
    gradient: 'from-purple-500 to-pink-500',
    features: ['नक्षत्र-विश्लेषण', 'ग्रह-योग', 'पूजा-विधि']
  },
  {
    title: 'सम्पर्क गर्नुहोस्',
    titleEnglish: 'Contact Us',
    description: 'समस्या वा सुझाव पठाउनुहोस्। तपाईंको प्रतिक्रिया स्वागतयोग्य छ।',
    icon: '✉️',
    href: '/contact',
    gradient: 'from-green-500 to-teal-500',
    features: ['समस्या पठाउनुहोस्', 'सुझाव', 'सहयोग']
  }
];


export default function AppsSection() {
  return (
    <section className="bg-white/95 backdrop-blur py-20" aria-labelledby="apps-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="apps-heading" className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-2">
            हाम्रा सेवाहरू
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            निशुल्क सेवा
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            परम्परागत नेपाली ज्योतिष र आधुनिक प्रविधिको संगम
          </p>
        </div>

        {/* 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-rose-200 overflow-hidden flex flex-col h-full"
            >
              {/* Decorative gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-amber-50/0 group-hover:from-rose-50/30 group-hover:to-amber-50/10 transition-all duration-300 rounded-xl"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon and Title in same row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${app.gradient} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
                    <span className="text-2xl">
                      {app.icon}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                      {app.title}
                    </h3>
                    {app.titleEnglish && (
                      <p className="text-xs text-gray-500 font-medium">{app.titleEnglish}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-grow">
                  {app.description}
                </p>

                {/* Features - Compact */}
                {app.features && (
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        <span className={`inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-br ${app.gradient} text-white text-xs`}>
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Action Button - Compact */}
                <button className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-semibold rounded-lg group-hover:from-rose-700 group-hover:to-orange-700 transition-all duration-300 shadow-md group-hover:shadow-lg self-start">
                  <span>खोल्नुहोस्</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-rose-100/20 to-amber-100/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
            </Link>
          ))}

          {/* Coming Soon Card */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 shadow-sm border border-dashed border-gray-300 overflow-hidden flex flex-col h-full items-center justify-center">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/20 rounded-xl"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg flex items-center justify-center shadow-md mx-auto">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-700 mb-2">
                आउँदै छ
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                नयाँ सेवाहरू चाँडै आउँदैछन्
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>शीघ्र आउँदै छ</span>
              </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-100/10 to-orange-100/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

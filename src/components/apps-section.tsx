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
    title: 'जन्म कुण्डली निर्माण',
    titleEnglish: 'Janma Kundali Maker',
    description: 'सटीक र निःशुल्क परम्परागत नेपाली जन्म कुण्डली बनाउनुहोस्। सूर्य सिद्धान्त आधारित वैदिक ज्योतिष।',
    icon: '📜',
    href: '/astro/janma',
    gradient: 'from-rose-500 to-orange-500',
    features: ['राशि चक्र', 'नवांश कुण्डली', 'दशा गणना']
  },
  {
    title: 'मिति परिवर्तक',
    titleEnglish: 'Nepali Date Converter',
    description: 'नेपाली र अंग्रेजी मिति बीच सजिलै रूपान्तरण गर्नुहोस्। BS ↔ AD',
    icon: '📅',
    href: '/date-converter',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['BS → AD', 'AD → BS', 'बार पत्ता लगाउनुहोस्']
  },
  {
    title: 'ज्योतिष लेखहरू',
    titleEnglish: 'Astrology Blogs',
    description: 'नेपाली ज्योतिष, कुण्डली, ग्रह, नक्षत्र र दशा बारे विस्तृत लेखहरू पढ्नुहोस्।',
    icon: '📚',
    href: '/blogs',
    gradient: 'from-purple-500 to-pink-500',
    features: ['नक्षत्र विश्लेषण', 'ग्रह योग', 'पूजा विधि']
  },
  {
    title: 'सम्पर्क गर्नुहोस्',
    titleEnglish: 'Contact Us',
    description: 'समस्या रिपोर्ट गर्नुहोस् वा सुझाव दिनुहोस्। हामी तपाईंको प्रतिक्रियाको लागि खुला छौं।',
    icon: '✉️',
    href: '/contact',
    gradient: 'from-green-500 to-teal-500',
    features: ['समस्या रिपोर्ट', 'सुझाव', 'सहयोग']
  }
];

export default function AppsSection() {
  return (
    <section className="bg-white/95 backdrop-blur py-20" aria-labelledby="apps-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 id="apps-heading" className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-2">
            हाम्रा सेवाहरू
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            निःशुल्क ज्योतिष उपकरणहरू
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            परम्परागत नेपाली ज्योतिष र आधुनिक प्रविधिको संगम
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-rose-200/50 overflow-hidden block"
            >
              {/* Decorative gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-amber-50/0 group-hover:from-rose-50/50 group-hover:to-amber-50/30 transition-all duration-300 rounded-xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon with gradient background and accent line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform">
                      {app.icon}
                    </span>
                  </div>
                  {/* Accent line */}
                  <div className="flex-1 h-1 bg-gradient-to-r from-rose-600/30 to-orange-500/10 rounded-full group-hover:from-rose-600/50 group-hover:to-orange-500/30 transition-all duration-300"></div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-rose-700 transition-colors">
                  {app.title}
                </h3>
                {app.titleEnglish && (
                  <p className="text-xs text-gray-500 mb-3 font-medium">{app.titleEnglish}</p>
                )}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {app.description}
                </p>

                {/* Features */}
                {app.features && (
                  <ul className="space-y-1.5 mb-4">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-rose-600">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Arrow Icon */}
                <div className="flex items-center text-sm font-medium text-rose-600 group-hover:text-rose-700 pt-2">
                  <span>खोल्नुहोस्</span>
                  <svg 
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-rose-100/20 to-amber-100/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-full">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-amber-800">
              थप सेवाहरू चाँडै आउँदैछन् (More apps coming soon!)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

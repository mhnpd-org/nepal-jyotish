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
    title: 'कुण्डली मिलान',
    titleEnglish: 'Kundali Matching',
    description: 'विवाहका लागि परम्परागत विधिमा कुण्डली मिलान गर्नुहोस्। गुण मिलान र अष्टकूट विश्लेषण।',
    icon: '💑',
    href: '/kundali-matching',
    gradient: 'from-pink-500 to-rose-500',
    features: ['गुण मिलान', 'अष्टकूट', 'दोष विश्लेषण']
  },
  {
    title: 'पुस्तकहरू',
    titleEnglish: 'Books',
    description: 'ज्योतिष र आध्यात्मिक ज्ञानका पवित्र ग्रन्थहरूको संग्रह अध्ययन गर्नुहोस्।',
    icon: '📖',
    href: '/books',
    gradient: 'from-amber-500 to-orange-500',
    features: ['तन्त्र', 'ध्यान-विधि', 'आध्यात्मिक-ज्ञान']
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
    title: 'अनलाईन सेवा',
    titleEnglish: 'Online Services',
    description: 'मुहूर्त, ग्रह शान्ति, वास्तु, पूजा र अन्य ज्योतिषीय सेवाहरू प्राप्त गर्नुहोस्।',
    icon: '✨',
    href: '/services',
    gradient: 'from-rose-500 to-orange-500',
    features: ['मुहूर्त निर्धारण', 'ग्रह शान्ति', 'वास्तु परामर्श']
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
        <div className="text-center mb-12">
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

        {/* Compact Grid Layout - Similar to Services Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${app.gradient} text-white text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {app.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-600 transition-all duration-300">
                  {app.title}
                </h3>

                {/* English Title */}
                {app.titleEnglish && (
                  <p className="text-xs text-gray-500 font-medium">
                    {app.titleEnglish}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

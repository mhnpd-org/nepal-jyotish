import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
}

const services: Service[] = [
  {
    id: "muhurta",
    title: "मुहूर्त निर्धारण",
    subtitle: "Shubha Muhurta",
    icon: "🌟",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "graha-shanti",
    title: "अरिष्ट ग्रह तथा योग शान्ती",
    subtitle: "Graha Shanti",
    icon: "🪔",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "birth-chart",
    title: "चिना एवं जन्मकुण्डली निर्माण",
    subtitle: "Birth Chart",
    icon: "📜",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "vastu",
    title: "सम्पूर्ण वास्तु परामर्श",
    subtitle: "Vastu Service",
    icon: "🏠",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "online-puja",
    title: "अनलाईन पुजा",
    subtitle: "Online Puja Service",
    icon: "🙏",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "gemstones",
    title: "रत्न पत्थर वारे उचित परामर्श",
    subtitle: "Gemstones Service",
    icon: "💎",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "rashifal",
    title: "राशिफल दैनिक, साप्ताहिक, मासिक र वार्षिक",
    subtitle: "Rashifal",
    icon: "⭐",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "speech",
    title: "पुराण, उत्प्रेरक एवं आध्यात्मिक प्रवचन",
    subtitle: "Motivational Speech",
    icon: "🎙️",
    gradient: "from-teal-500 to-green-500",
  },
  {
    id: "solution",
    title: "ज्योतिषिय एवं वास्तुशास्त्र अनुसार समस्या समाधान",
    subtitle: "Astrology & Vastu Solution",
    icon: "✨",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function ServicesShowcase() {
  return (
    <section className="bg-white/95 backdrop-blur py-16" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="services-heading" className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-2">
            अनलाईन ज्योतिष सेवा
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            हाम्रा विशेष सेवाहरू
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            परम्परागत ज्योतिष, वास्तुशास्त्र र कर्मकाण्डमा आधारित व्यावसायिक सेवाहरू
          </p>
        </div>

        {/* Services Grid - Compact boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/service-request?service=${service.id}`}
              className="group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} text-white text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-600 transition-all duration-300">
                  {service.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-gray-500 font-medium">
                  {service.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
          >
            <span>सबै सेवाहरू हेर्नुहोस्</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

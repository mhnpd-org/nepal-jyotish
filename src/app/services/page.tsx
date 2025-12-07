import MainHeader from "@internal/layouts/main-header";
import Footer from "@internal/layouts/footer";
import type { Metadata }from "next";

export const metadata: Metadata = {
  title: "हाम्रा सेवाहरू | अनलाईन ज्योतिष सेवा - नेपाल ज्योतिष",
  description: "मुहूर्त निर्धारण, ग्रह शान्ति, जन्मकुण्डली निर्माण, वास्तु परामर्श, अनलाईन पूजा, रत्न पत्थर परामर्श र अन्य ज्योतिषीय सेवाहरू।",
  keywords: [
    "ज्योतिष सेवा",
    "मुहूर्त निर्धारण",
    "ग्रह शान्ति",
    "जन्मकुण्डली",
    "वास्तु परामर्श",
    "अनलाईन पूजा",
    "रत्न पत्थर",
    "राशिफल"
  ],
};

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
}

const services: Service[] = [
  {
    id: "muhurta",
    title: "मुहूर्त निर्धारण",
    subtitle: "Shubha Muhurta",
    description: "विवाह, गृह प्रवेश, व्यापार आरम्भ आदि शुभ कार्यहरूको लागि उत्तम मुहूर्त निर्धारण गर्नुहोस्।",
    icon: "🌟",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "graha-shanti",
    title: "अरिष्ट ग्रह तथा योग शान्ती",
    subtitle: "Graha Shanti",
    description: "ग्रहको दुष्प्रभाव र अरिष्ट योगको शान्ति गर्न विशेष पूजा-पाठ र उपायहरू।",
    icon: "🪔",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "birth-chart",
    title: "चिना एवं जन्मकुण्डली निर्माण",
    subtitle: "Birth Chart",
    description: "परम्परागत विधिअनुसार सटीक चिना तथा विस्तृत जन्मकुण्डली निर्माण र विश्लेषण।",
    icon: "📜",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "vastu",
    title: "सम्पूर्ण वास्तु परामर्श",
    subtitle: "Vastu Service",
    description: "घर, कार्यालय र व्यापारिक स्थलको वास्तुशास्त्र अनुसार परामर्श र समाधान।",
    icon: "🏠",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "online-puja",
    title: "अनलाईन पुजा",
    subtitle: "Online Puja Service",
    description: "तपाईंको आवश्यकता अनुसार विशेष पूजा-पाठ र हवन सेवा अनलाईन माध्यमबाट।",
    icon: "🙏",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "gemstones",
    title: "रत्न पत्थर वारे उचित परामर्श",
    subtitle: "Gemstones Service",
    description: "कुण्डली विश्लेषण गरी तपाईंको लागि उपयुक्त रत्न र धारण विधिको परामर्श।",
    icon: "💎",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "rashifal",
    title: "राशिफल दैनिक, साप्ताहिक, मासिक र वार्षिक",
    subtitle: "Rashifal",
    description: "तपाईंको राशि अनुसार दैनिक, साप्ताहिक, मासिक र वार्षिक भविष्यफल।",
    icon: "⭐",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "speech",
    title: "पुराण, उत्प्रेरक एवं आध्यात्मिक प्रवचन",
    subtitle: "Motivational Speech",
    description: "आध्यात्मिक ज्ञान, पुराण कथा र उत्प्रेरक प्रवचन कार्यक्रमहरू।",
    icon: "🎙️",
    gradient: "from-teal-500 to-green-500",
  },
  {
    id: "solution",
    title: "ज्योतिषिय एवं वास्तुशास्त्र अनुसार समस्या समाधान",
    subtitle: "Astrology & Vastu Solution",
    description: "जीवनका विभिन्न समस्याहरूको ज्योतिष र वास्तुशास्त्र आधारित समाधान।",
    icon: "✨",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <MainHeader variant="solid" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            हाम्रा सेवाहरू
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            परम्परागत ज्योतिष र वास्तुशास्त्रका विभिन्न सेवाहरू प्राप्त गर्नुहोस्
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" id="services">
          {services.map((service) => (
            <a
              key={service.id}
              href={`/service-request?service=${service.id}`}
              className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} text-white text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-600 transition-all duration-300">
                  {service.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm font-medium text-gray-500 mb-3">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* CTA Button */}
                <div className="flex items-center text-rose-600 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                  <span>थप पढ्नुहोस्</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            सेवा अनुरोध गर्नुहोस्
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            माथिको कुनै पनि सेवाको लागि अनुरोध पठाउन तलको बटनमा क्लिक गर्नुहोस्
          </p>
          <a
            href="/service-request"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>सेवा अनुरोध फारम भर्नुहोस्</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

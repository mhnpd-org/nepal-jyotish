/**
 * SEO Configuration for Nepal Jyotish
 * Central configuration for all SEO-related metadata, keywords, and structured data
 */

export const SITE_CONFIG = {
  name: "Nepal Jyotish",
  nameNepali: "नेपाल ज्योतिष",
  url: "https://nepaljyotish.org",
  description: "Traditional Nepali China Maker and Kundali based on Vedic Jyotish and Surya Siddhanta",
  descriptionNepali: "परम्परागत नेपाली चाइना मेकर र कुण्डली निर्माण - वैदिक ज्योतिष र सूर्य सिद्धान्तमा आधारित",
  locale: "ne_NP",
  alternateNames: [
    "Hamro Jyotish",
    "Mero Jyotish",
    "हाम्रो ज्योतिष",
    "मेरो ज्योतिष",
    "Nepali China Maker",
    "नेपाली चाइना मेकर"
  ]
};

// Primary target keywords
export const PRIMARY_KEYWORDS = [
  // English
  "Nepali Jyotish",
  "Nepal Jyotish",
  "China",
  "Traditional",
  "Kundali",
  "Nepali China Maker",
  "Vedic Jyotish",
  "Surya Siddhanta",
  "Suraya Siddanta",
  "Hamro Jyotish",
  "Mero Jyotish",
  
  // Nepali
  "नेपाली ज्योतिष",
  "नेपाल ज्योतिष",
  "चाइना",
  "परम्परागत",
  "कुण्डली",
  "नेपाली चाइना मेकर",
  "वैदिक ज्योतिष",
  "सूर्य सिद्धान्त",
  "हाम्रो ज्योतिष",
  "मेरो ज्योतिष"
];

// Secondary keywords
export const SECONDARY_KEYWORDS = [
  // Birth Chart Keywords
  "Birth Chart",
  "Janma Patrika",
  "Horoscope",
  "जन्म पत्रिका",
  "जन्मकुण्डली",
  "राशिफल",
  
  // Astrology Systems
  "Hindu Astrology",
  "Jyotish Shastra",
  "Traditional Astrology",
  "ज्योतिष शास्त्र",
  "परम्परागत ज्योतिष",
  
  // Chart Types
  "China Chart",
  "Traditional China",
  "Free Kundali",
  "Online Kundali Maker",
  
  // Dasha Systems
  "Vimshottari Dasha",
  "Yogini Dasha",
  "Tribhagi Dasha",
  "Mahadasha",
  "Antardasha",
  "विंशोत्तरी दशा",
  "योगिनी दशा",
  "त्रिभागी दशा",
  "महादशा",
  "अन्तर्दशा",
  
  // Planetary Keywords
  "Planetary Position",
  "Graha Position",
  "Planetary Motion",
  "ग्रह स्थिति",
  "ग्रह गति",
  
  // Chart Keywords
  "Rashi Chart",
  "Navamsa",
  "Divisional Charts",
  "Varga Charts",
  "राशि चक्र",
  "नवांश",
  "वर्ग चार्ट",
  
  // Nakshatra
  "Nakshatra",
  "Birth Star",
  "Lunar Mansion",
  "नक्षत्र",
  "जन्म नक्षत्र",
  
  // Yoga & Dosha
  "Raj Yoga",
  "Yoga Analysis",
  "Dosha Analysis",
  "राज योग",
  "योग विश्लेषण",
  
  // Location-based
  "Nepal Kundali",
  "Nepali Panchang",
  "नेपाल कुण्डली",
  "नेपाली पञ्चाङ्ग"
];

// All keywords combined
export const ALL_KEYWORDS = [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS];

// Page-specific metadata templates
export const PAGE_METADATA = {
  home: {
    titleTemplate: "नेपाली चाइना मेकर | Traditional Nepali China & Kundali Maker - Hamro Jyotish",
    description: "नेपाल ज्योतिष - निःशुल्क परम्परागत नेपाली चाइना मेकर र कुण्डली निर्माण। Vedic Jyotish based on Surya Siddhanta (सूर्य सिद्धान्त)। Create accurate birth charts (जन्म पत्रिका), view planetary motions (ग्रह गति), calculate Vimshottari, Yogini, Tribhagi Dasha. Hamro Jyotish, Mero Jyotish - Traditional China maker for all Nepali.",
    keywords: PRIMARY_KEYWORDS
  },
  
  janma: {
    titleTemplate: "जन्म पत्रिका | Janma Patrika - Traditional Nepali China Maker",
    description: "Create traditional Nepali China (जन्म पत्रिका) based on Vedic Jyotish and Surya Siddhanta. Free online Kundali maker with accurate planetary positions, Rashi chart, Navamsa, and all divisional charts (D1-D60). Hamro Jyotish birth chart generator.",
    keywords: [
      "Janma Patrika",
      "जन्म पत्रिका",
      "Birth Chart",
      "Nepali China Maker",
      "Traditional China",
      "Free Kundali",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  traditional: {
    titleTemplate: "परम्परागत चाइना | Traditional China Chart - Nepal Jyotish",
    description: "Traditional Nepali China chart (परम्परागत चाइना) based on ancient Vedic Jyotish principles and Surya Siddhanta calculations. View birth chart in traditional format with Ghara (houses) and Graha (planets) positions.",
    keywords: [
      "Traditional China",
      "परम्परागत चाइना",
      "China Chart",
      "Traditional Kundali",
      "Ghara",
      "घर",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  charts: {
    titleTemplate: "वर्ग चार्ट | Varga Charts (D1-D60) - Nepal Jyotish",
    description: "Complete Varga Charts (वर्ग चार्ट) analysis - All 16 divisional charts from D1 to D60 based on Vedic Jyotish. Navamsa (D9), Dashamsa (D10), Shodashamsa (D16) and more for detailed life predictions.",
    keywords: [
      "Varga Charts",
      "वर्ग चार्ट",
      "Divisional Charts",
      "Navamsa",
      "नवांश",
      "D9 Chart",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  planetPosition: {
    titleTemplate: "ग्रह स्थिति | Planetary Position - Nepal Jyotish",
    description: "Detailed planetary positions (ग्रह स्थिति) and planetary motion based on Surya Siddhanta. View all 9 Grahas in Rashi, Nakshatra, house positions, retrograde status, and their effects in your birth chart.",
    keywords: [
      "Planetary Position",
      "ग्रह स्थिति",
      "Graha Position",
      "Planetary Motion",
      "ग्रह गति",
      "Nakshatra",
      "नक्षत्र",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  vimshottariDasha: {
    titleTemplate: "विंशोत्तरी दशा | Vimshottari Dasha - Nepal Jyotish",
    description: "Vimshottari Dasha (विंशोत्तरी दशा) calculation - 120-year cycle based on Vedic Jyotish. Complete Mahadasha, Antardasha, Pratyantardasha periods with dates for life event predictions.",
    keywords: [
      "Vimshottari Dasha",
      "विंशोत्तरी दशा",
      "Mahadasha",
      "महादशा",
      "Antardasha",
      "अन्तर्दशा",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  yoginiDasha: {
    titleTemplate: "योगिनी दशा | Yogini Dasha - Nepal Jyotish",
    description: "Yogini Dasha (योगिनी दशा) system - 36-year cycle based on Nakshatra. Eight Yogini goddesses (Mangala, Pingala, Dhanya, etc.) Mahadasha and Antardasha calculations for predictions.",
    keywords: [
      "Yogini Dasha",
      "योगिनी दशा",
      "Yogini System",
      "36 Year Dasha",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  tribhagiDasha: {
    titleTemplate: "त्रिभागी दशा | Tribhagi Dasha - Nepal Jyotish",
    description: "Tribhagi Dasha (त्रिभागी दशा) calculation - Three-part division system based on Vedic Jyotish principles. Alternative Dasha system for life event predictions.",
    keywords: [
      "Tribhagi Dasha",
      "त्रिभागी दशा",
      "Tribhagi System",
      ...PRIMARY_KEYWORDS
    ]
  },
  
  blogs: {
    titleTemplate: "ज्योतिष लेखहरू | Jyotish Articles - Nepal Jyotish",
    description: "Learn about Nepali Jyotish through detailed articles in Nepali language. Topics include Nakshatra, Rashi, Dasha systems, traditional China reading, and Vedic astrology principles based on Surya Siddhanta.",
    keywords: [
      "Jyotish Articles",
      "ज्योतिष लेखहरू",
      "Astrology Education",
      "Learn Jyotish",
      ...PRIMARY_KEYWORDS
    ]
  }
};

// Structured Data (JSON-LD) helpers
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_CONFIG.name,
  "alternateName": SITE_CONFIG.nameNepali,
  "url": SITE_CONFIG.url,
  "logo": `${SITE_CONFIG.url}/favicon-192.png`,
  "description": SITE_CONFIG.description,
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["Nepali", "English"]
  }
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_CONFIG.name,
  "alternateName": SITE_CONFIG.alternateNames,
  "url": SITE_CONFIG.url,
  "description": SITE_CONFIG.description,
  "inLanguage": ["ne", "en"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_CONFIG.url}/blogs?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

export const getSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": `${SITE_CONFIG.name} - Nepali China Maker`,
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "NPR"
  },
  "description": "Free Traditional Nepali China Maker and Kundali Generator based on Vedic Jyotish and Surya Siddhanta",
  "featureList": [
    "Traditional Nepali China (Birth Chart)",
    "Kundali Generation",
    "Planetary Position Calculation",
    "Planetary Motion Tracking",
    "Vimshottari Dasha",
    "Yogini Dasha",
    "Tribhagi Dasha",
    "Varga Charts (D1-D60)",
    "Nakshatra Analysis",
    "Yoga and Dosha Analysis"
  ],
  "screenshot": `${SITE_CONFIG.url}/og-image.png`
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const getArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "url": article.url,
  "datePublished": article.datePublished || new Date().toISOString(),
  "dateModified": article.dateModified || new Date().toISOString(),
  "author": {
    "@type": "Organization",
    "name": SITE_CONFIG.name
  },
  "publisher": {
    "@type": "Organization",
    "name": SITE_CONFIG.name,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_CONFIG.url}/favicon-192.png`
    }
  },
  "image": article.image || `${SITE_CONFIG.url}/og-image.png`,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

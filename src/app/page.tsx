import Link from "next/link";
import BlogCard from "@internal/components/blog-card";
import Logo from "@internal/layouts/logo";
import Footer from "@internal/layouts/footer";
import { getRecentBlogPosts } from "@internal/lib/blogs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Nepal Jyotish",
  description: "Nepal Jyotish - परम्परागत नेपाली ज्योतिष प्रणाली। Generate accurate birth charts (जन्म पत्रिका), analyze planetary positions (ग्रह स्थिति), and calculate dasha periods (दशा गणना) using traditional Nepali Vedic astrology methods.",
  openGraph: {
    title: "Nepal Jyotish - Traditional Nepali Astrology",
    description: "Free online Nepali astrology tools for birth charts, planetary positions, and dasha calculations.",
    url: "https://nepaljyotish.org",
  },
};

export default function LandingPage() {
  // Get 8 recent blog posts from MDX files
  const blogs = getRecentBlogPosts(8);


  return (
    <main className="min-h-screen bg-vedanga-gradient">
      {/* Minimal header */}
      <header className="bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" variant="light" />

          <nav className="flex items-center gap-6">
            <Link 
              href="/blogs" 
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              लेखहरू
            </Link>
            <Link 
              href="/astro/janma" 
              className="px-4 py-2 bg-white text-rose-700 text-sm font-medium rounded-lg hover:bg-white/95 transition-colors shadow-sm"
            >
              एप खोल्नुहोस्
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative overflow-hidden">
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

        <div className="max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            नेपाली ज्योतिष<br />
            <span className="text-amber-200">सरल र स्पष्ट</span>
          </h1>
          <p className="mt-6 text-xl text-white/95 leading-relaxed max-w-2xl drop-shadow">
            परम्परागत ज्योतिष प्रणाली आधुनिक तरिकाले। जन्मपत्रिका निर्माण, ग्रह स्थिति विश्लेषण, र दशा गणना — सबै एकै ठाउँमा।
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/astro/janma"
              className="px-6 py-3 bg-white text-rose-700 font-semibold rounded-lg hover:bg-white/95 transition-colors shadow-lg"
            >
              सुरु गर्नुहोस्
            </Link>
            <Link
              href="/blogs"
              className="px-6 py-3 text-white font-medium hover:text-amber-200 transition-colors"
            >
              लेखहरू पढ्नुहोस् →
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-[rgba(255,255,250,0.92)] backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-8">
            मुख्य सुविधाहरू
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">जन्म पत्रिका</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                तपाईंको जन्म मिति, समय र स्थानको आधारमा सटीक खगोलीय गणनाबाट पूर्ण जन्मकुण्डली तुरुन्तै तयार गर्नुहोस्।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>राशि चक्र र नवांश कुण्डली</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>सभै वर्ग चार्टहरू (D1-D60)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>ग्रह योग र दोष विश्लेषण</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ग्रह स्थिति</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                नौ ग्रहहरूको विस्तृत स्थिति, राशि, नक्षत्र, र तिनीहरूको प्रभाव तपाईंको जीवनमा सरल भाषामा बुझ्नुहोस्।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>ग्रह बल र शुभाशुभ फल</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>नक्षत्र र पाद विवरण</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>भाव स्वामी र योगकारक ग्रह</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">दशा प्रणाली</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                विभिन्न दशा प्रणालीहरू मार्फत तपाईंको जीवनको विभिन्न कालखण्डहरूको भविष्यवाणी र विश्लेषण गर्नुहोस्।
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>विंशोत्तरी दशा (120 वर्ष)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>योगिनी दशा (36 वर्ष)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>त्रिभागी दशा र अन्तर्दशा</span>
                </li>
              </ul>
            </div>
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

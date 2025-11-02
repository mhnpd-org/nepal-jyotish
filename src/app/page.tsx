import Link from "next/link";
import BlogCard from "@internal/components/blog-card";
import Logo from "@internal/layouts/logo";

export const revalidate = 0; // render at build-time (0 = no revalidation) - ensures static render

export default function LandingPage() {
  const blogs = [
    {
      title: "नेपाली ज्योतिष परिचय",
      excerpt: "नेपाली परम्परागत ज्योतिषका आधारभूत अवधारणाहरूको छोटो मार्गदर्शिका।",
      href: "/blog/intro-jyotish",
    },
    {
      title: "जन्म पत्रिका बुझ्ने तरिका",
      excerpt: "जन्मकुण्डली (जनма पत्रिका) कसरी पढ्ने र व्याख्या गर्ने — उदाहरणसहित।",
      href: "/blog/janma-patrika",
    },
    {
      title: "ग्रहकाल (दशा) प्रणाली",
      excerpt: "भविष्यवाणीमा प्रयोग हुने विभिन्न दशा प्रणालीहरूको अवलोकन।",
      href: "/blog/dasha-overview",
    },
  ];

  return (
    <main className="min-h-screen bg-vedanga-gradient">
      {/* Minimal header */}
      <header className="bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" variant="light" />

          <nav className="flex items-center gap-6">
            <Link 
              href="/blog" 
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
              href="/blog"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">जन्म पत्रिका</h3>
              <p className="text-gray-700 leading-relaxed">
                सटीक खगोलीय गणनाबाट तपाईंको पूर्ण जन्मकुण्डली तुरुन्तै तयार गर्नुहोस्।
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ग्रह स्थिति</h3>
              <p className="text-gray-700 leading-relaxed">
                विस्तृत ग्रह स्थिति र तिनीहरूको प्रभाव सरल भाषामा बुझ्नुहोस्।
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">दशा प्रणाली</h3>
              <p className="text-gray-700 leading-relaxed">
                विंशोत्तरी, योगिनी र त्रिभागी दशा प्रणाली सबै एकै ठाउँमा।
              </p>
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
            <BlogCard key={b.title} title={b.title} excerpt={b.excerpt} href={b.href} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-transparent to-amber-900/20 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="sm" variant="light" href="/" className="mb-3" />
              <p className="text-sm text-white/90 max-w-sm">
                परम्परागत नेपाली ज्योतिष प्रणाली र आधुनिक प्रविधिको संगम। सरल, सटीक र विश्वसनीय।
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-white mb-3">लिङ्कहरू</h5>
              <ul className="space-y-2 text-sm text-white/85">
                <li><Link href="/astro/janma" className="hover:text-amber-200 transition-colors">एप खोल्नुहोस्</Link></li>
                <li><Link href="/astro/overview" className="hover:text-amber-200 transition-colors">अवलोकन</Link></li>
                <li><Link href="/blog" className="hover:text-amber-200 transition-colors">ब्लग</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-white mb-3">कानूनी</h5>
              <ul className="space-y-2 text-sm text-white/85">
                <li><Link href="/privacy" className="hover:text-amber-200 transition-colors">गोपनीयता नीति</Link></li>
                <li><Link href="/terms" className="hover:text-amber-200 transition-colors">सेवा नियम</Link></li>
                <li><Link href="/contact" className="hover:text-amber-200 transition-colors">सम्पर्क</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/75 text-center">
              © {new Date().getFullYear()} वेदाङ्ग ज्योतिष। सर्वाधिकार सुरक्षित।
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

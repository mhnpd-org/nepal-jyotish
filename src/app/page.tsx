import Image from "next/image";
import Link from "next/link";
import BlogCard from "@internal/components/blog-card";

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
    <main className="min-h-screen bg-vedanga-gradient text-gray-900">
      {/* Top header matching app style */}
          <header className="h-16 flex items-center gap-4 px-4 sm:px-5 md:px-8 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent w-full">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Vedanga Logo" width={36} height={36} className="rounded-sm" />
          <h1 className="text-white font-semibold text-lg tracking-wide select-none">
            वेदाङ्ग <span className="text-amber-200 font-light">ज्योतिष</span>
          </h1>
        </div>

        <nav className="ml-auto flex items-center gap-4">
          <Link href="/astro/janma" className="inline-block bg-white text-amber-600 px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-gray-100">
            Open App
          </Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-12">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8 md:p-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-rose-900">
                  ज्योतिष एप खोल्नुहोस्
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-xl">
                  सजिलो र प्रयोगमैत्री नेपाली ज्योतिष प्रणाली — आफ्नो जन्मपत्रिका बनाउनुहोस्, ग्रहको स्थिति हेर्नुहोस्, र दाशा प्रणालीहरू सरल र स्पष्ट तरिकाले बुझ्नुहोस्।
                </p>

                <div className="mt-6">
                  <Link
                    href="/astro/janma"
                    className="inline-block bg-rose-700 text-white px-5 py-3 rounded-md font-semibold shadow hover:bg-rose-600"
                  >
                    एप सुरु गर्नुहोस्
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center p-4">
                {/* simple illustrative SVG */}
                <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="0" y="0" width="320" height="220" rx="12" fill="#FFF5F5" />
                  <g transform="translate(24,24)">
                    <circle cx="64" cy="48" r="36" fill="#FDE68A" />
                    <circle cx="160" cy="64" r="28" fill="#FB923C" />
                    <rect x="32" y="116" width="192" height="56" rx="8" fill="#FECACA" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4">भर्खरका नयाँ लेखहरू</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogs.map((b) => (
              <BlogCard key={b.title} title={b.title} excerpt={b.excerpt} href={b.href} />
            ))}
          </div>
        </section>

          <footer className="border-t pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} नेपाली ज्योतिष — माया साथ बनेको</p>
        </footer>
      </div>
    </main>
  );
}

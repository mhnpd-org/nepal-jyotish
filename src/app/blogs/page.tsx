import Link from "next/link";
import Logo from "@internal/layouts/logo";
import Footer from "@internal/layouts/footer";
import { getAllBlogPosts } from "@internal/lib/blogs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "लेखहरू - Nepal Jyotish",
  description: "नेपाली ज्योतिष सम्बन्धी लेख र जानकारीहरू। जन्म पत्रिका, ग्रह स्थिति, दशा प्रणाली र अन्य ज्योतिषीय विषयहरूमा गहन ज्ञान।",
};

export default function BlogsPage() {
  const blogs = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-700 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" variant="light" />
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm text-white/90 hover:text-white transition-colors"
              >
                मुख्य पृष्ठ
              </Link>
              <Link 
                href="/blogs" 
                className="text-sm text-white font-semibold transition-colors"
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
          
          <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">लेखहरू</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              नेपाली ज्योतिष सम्बन्धी ज्ञान र जानकारीहरू
            </p>
          </div>
        </div>
      </header>

      {/* Blog List */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">कुनै लेख भेटिएन</h2>
            <p className="text-gray-600">छिट्टै नयाँ लेखहरू थपिनेछ।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-rose-100 text-rose-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <time dateTime={blog.date}>
                      {new Date(blog.date).toLocaleDateString('ne-NP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="text-rose-600 group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer variant="light" />
    </main>
  );
}

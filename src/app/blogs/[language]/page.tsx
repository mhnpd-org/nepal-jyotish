import Link from "next/link";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { getAllBlogPosts, hasTranslation } from "@internal/lib/blogs";
import { notFound } from "next/navigation";

interface BlogsListPageProps {
  params: Promise<{
    language: string;
  }>;
}

// Generate static params for both languages
export async function generateStaticParams() {
  return [
    { language: 'np' },
    { language: 'en' },
  ];
}

export default async function BlogsListPage({ params }: BlogsListPageProps) {
  const { language } = await params;
  
  // Validate language
  if (language !== 'np' && language !== 'en') {
    notFound();
  }

  const blogs = getAllBlogPosts(language);
  const isNepali = language === 'np';
  const otherLang = isNepali ? 'en' : 'np';

  const text = {
    home: isNepali ? 'मुख्य पृष्ठ' : 'Home',
    articles: isNepali ? 'लेखहरू' : 'Articles',
    openApp: isNepali ? 'एप खोल्नुहोस्' : 'Open App',
    title: isNepali ? 'लेखहरू' : 'Articles',
    subtitle: isNepali ? 'नेपाली ज्योतिष सम्बन्धी ज्ञान र जानकारीहरू' : 'Knowledge and Information about Nepali Jyotish',
    switchLang: isNepali ? 'Read in English' : 'नेपालीमा पढ्नुहोस्',
    noArticles: isNepali ? 'कुनै लेख भेटिएन' : 'No articles found',
    comingSoon: isNepali ? 'छिट्टै नयाँ लेखहरू थपिनेछ।' : 'New articles coming soon.',
    inEnglish: 'In English',
    inNepali: 'In Nepali',
  };

  return (
    <>
      <AppHeader variant="solid" language={language as 'np' | 'en'} currentPage="blogs" />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
        {/* Blog Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{text.subtitle}</p>
          </div>
        </section>

        {/* Blog List */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{text.noArticles}</h2>
            <p className="text-gray-600">{text.comingSoon}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const translationExists = hasTranslation(blog.slug, language);
              return (
              <div
                key={blog.slug}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {translationExists && (
                  <Link
                    href={`/blogs/${otherLang}/${blog.slug}`}
                    className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline whitespace-nowrap bg-white/90 backdrop-blur rounded-full border border-rose-100"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{isNepali ? text.inEnglish : text.inNepali}</span>
                  </Link>
                )}

                <Link
                  href={`/blogs/${language}/${blog.slug}`}
                  className="block h-full"
                >
                  <div className="p-6 h-full flex flex-col">
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
                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <time dateTime={blog.date}>
                        {new Date(blog.date).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
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
              </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer variant="light" />
    </main>
    </>
  );
}

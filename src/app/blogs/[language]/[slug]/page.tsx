import Link from "next/link";
import Logo from "@internal/layouts/logo";
import Footer from "@internal/layouts/footer";
import { getBlogPost, getAllBlogSlugs, hasTranslation } from "@internal/lib/blogs";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Metadata } from "next";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

interface BlogPageProps {
  params: Promise<{
    language: string;
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((item) => ({
    language: item.language,
    slug: item.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { language, slug } = await params;
  const post = getBlogPost(slug, language as 'np' | 'en');

  if (!post) {
    return {
      title: "लेख भेटिएन - Nepal Jyotish",
    };
  }

  return {
    title: `${post.title} - Nepal Jyotish`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

// MDX Components for custom styling with professional typography
type MDXComponentProps = React.HTMLAttributes<HTMLElement>;

const components = {
  h1: (props: MDXComponentProps) => (
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-12 first:mt-0 leading-snug border-b-2 border-rose-100 pb-3" {...props} />
  ),
  h2: (props: MDXComponentProps) => (
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-12 leading-snug border-b-2 border-rose-100 pb-3" {...props} />
  ),
  h3: (props: MDXComponentProps) => (
    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 mt-10 leading-snug" {...props} />
  ),
  h4: (props: MDXComponentProps) => (
    <h4 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 mt-8 leading-normal" {...props} />
  ),
  p: (props: MDXComponentProps) => (
    <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed" style={{ lineHeight: '1.8' }} {...props} />
  ),
  ul: (props: MDXComponentProps) => (
    <ul className="my-6 ml-6 space-y-3 text-gray-700" {...props} />
  ),
  ol: (props: MDXComponentProps) => (
    <ol className="my-6 ml-6 space-y-3 text-gray-700" {...props} />
  ),
  li: (props: MDXComponentProps) => (
    <li className="text-lg md:text-xl leading-relaxed pl-2" style={{ lineHeight: '1.8' }} {...props} />
  ),
  blockquote: (props: MDXComponentProps) => (
    <blockquote 
      className="border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-transparent pl-6 pr-4 py-4 my-8 italic text-gray-800 rounded-r-lg shadow-sm" 
      {...props} 
    />
  ),
  code: (props: MDXComponentProps) => (
    <code className="bg-rose-50 text-rose-800 px-2 py-1 rounded text-base font-mono border border-rose-100" {...props} />
  ),
  pre: (props: MDXComponentProps) => (
    <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-8 shadow-lg border border-gray-700" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-rose-600 hover:text-rose-700 underline decoration-2 underline-offset-2 transition-colors font-medium" {...props} />
  ),
  hr: (props: MDXComponentProps) => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: (props: MDXComponentProps) => <thead className="bg-gradient-to-r from-rose-50 to-amber-50" {...props} />,
  tbody: (props: MDXComponentProps) => <tbody className="bg-white divide-y divide-gray-100" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="px-6 py-4 text-base text-gray-700 leading-relaxed" {...props} />
  ),
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { language, slug } = await params;
  const post = getBlogPost(slug, language as 'np' | 'en');

  if (!post) {
    notFound();
  }

  // Check if translation exists
  const translationExists = hasTranslation(slug, language as 'np' | 'en');

  // Determine text based on language
  const isNepali = language === 'np';
  const text = {
    home: isNepali ? 'मुख्य पृष्ठ' : 'Home',
    blogs: isNepali ? 'लेखहरू' : 'Blogs',
    openApp: isNepali ? 'एप खोल्नुहोस्' : 'Open App',
    allBlogs: isNepali ? 'सबै लेखहरू' : 'All Blogs',
    readTime: isNepali ? 'मिनेट पठन' : 'min read',
    viewAllBlogs: isNepali ? 'सबै लेखहरू हेर्नुहोस्' : 'View All Blogs',
    likedArticle: isNepali ? 'लेख मन पर्यो?' : 'Liked this article?',
    useService: isNepali ? 'ज्योतिष सेवा प्रयोग गर्नुहोस्' : 'Use Jyotish Service',
    readInOtherLang: isNepali ? 'Read in English' : 'नेपालीमा पढ्नुहोस्',
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header - Minimalist and clean */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="dark" />
            
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link 
                href="/" 
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {text.home}
              </Link>
              <Link 
                href="/blogs" 
                className="text-xs sm:text-sm text-gray-900 font-semibold whitespace-nowrap"
              >
                {text.blogs}
              </Link>
              <Link 
                href="/astro/janma" 
                className="px-3 sm:px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap"
              >
                {text.openApp}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Header - Hero style */}
      <div className="bg-gradient-to-b from-rose-50 via-white to-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
          {/* Breadcrumb */}
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-600 mb-8 transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">{text.allBlogs}</span>
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-rose-100 text-rose-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Language Toggle - Only show if translation exists */}
          {translationExists && (
            <Link
              href={`/blogs/${isNepali ? 'en' : 'np'}/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border-2 border-rose-600 text-rose-600 font-medium rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{text.readInOtherLang}</span>
            </Link>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-6 border-t border-gray-200">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-semibold">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium text-gray-700">{post.author}</span>
              </div>
            )}
            <span className="text-gray-300">•</span>
            <time dateTime={post.date} className="font-medium">
              {new Date(post.date).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-gray-300">•</span>
            <span>{Math.ceil(post.content.split(' ').length / 200)} {text.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content - Professional article layout */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Main content with enhanced typography */}
        <div className="prose-article">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </div>

        {/* Article footer with sharing/navigation */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors group text-sm sm:text-base whitespace-nowrap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{text.viewAllBlogs}</span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-rose-50 to-orange-50 p-4 sm:px-6 sm:py-4 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-700 font-medium">{text.likedArticle}</span>
              <Link
                href="/astro/janma"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <span>{text.useService}</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <Footer variant="light" />
    </main>
  );
}

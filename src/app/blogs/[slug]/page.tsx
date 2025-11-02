import Link from "next/link";
import Logo from "@internal/layouts/logo";
import Footer from "@internal/layouts/footer";
import { getBlogPost, getAllBlogSlugs } from "@internal/lib/blogs";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Metadata } from "next";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

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

// MDX Components for custom styling
type MDXComponentProps = React.HTMLAttributes<HTMLElement>;

const components = {
  h1: (props: MDXComponentProps) => <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />,
  h2: (props: MDXComponentProps) => <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8" {...props} />,
  h3: (props: MDXComponentProps) => <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6" {...props} />,
  h4: (props: MDXComponentProps) => <h4 className="text-xl font-bold text-gray-900 mb-2 mt-4" {...props} />,
  p: (props: MDXComponentProps) => <p className="text-lg text-gray-700 mb-4 leading-relaxed" {...props} />,
  ul: (props: MDXComponentProps) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
  ol: (props: MDXComponentProps) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
  li: (props: MDXComponentProps) => <li className="text-lg leading-relaxed" {...props} />,
  blockquote: (props: MDXComponentProps) => (
    <blockquote className="border-l-4 border-rose-500 pl-4 py-2 my-4 italic bg-gray-50 rounded-r" {...props} />
  ),
  code: (props: MDXComponentProps) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
  pre: (props: MDXComponentProps) => <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-rose-600 hover:text-rose-700 underline" {...props} />,
  hr: (props: MDXComponentProps) => <hr className="my-8 border-gray-300" {...props} />,
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: (props: MDXComponentProps) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: MDXComponentProps) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />,
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

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
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>सबै लेखहरू</span>
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-white/90">
              {post.author && (
                <>
                  <span>{post.author}</span>
                  <span>•</span>
                </>
              )}
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('ne-NP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200 italic">
              {post.excerpt}
            </p>
          )}

          {/* MDX Content */}
          <div className="prose prose-lg max-w-none">
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
        </div>

        {/* Back to blogs */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>सबै लेखहरू हेर्नुहोस्</span>
          </Link>
        </div>
      </article>

      {/* Footer */}
      <Footer variant="light" />
    </main>
  );
}

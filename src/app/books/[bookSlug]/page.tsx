import Link from 'next/link';
import Footer from '@internal/layouts/footer';
import AppHeader from '@internal/layouts/app-header';
import TableOfContentsSidebar from '@internal/components/table-of-contents-sidebar';
import {
  getBook,
  getAllBookSlugs,
  getBookContent,
} from '@internal/lib/books';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Metadata } from 'next';

// Import highlight.js styles
import 'highlight.js/styles/github-dark.css';

interface BookPageProps {
  params: Promise<{
    bookSlug: string;
  }>;
}

export async function generateStaticParams() {
  const bookSlugs = getAllBookSlugs();
  return bookSlugs.map((slug) => ({
    bookSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { bookSlug } = await params;
  const book = getBook(bookSlug);

  if (!book) {
    return {
      title: 'Book not found - Nepal Jyotish',
    };
  }

  return {
    title: `${book.title} - Nepal Jyotish`,
    description: book.description,
  };
}

type MDXComponentProps = React.HTMLAttributes<HTMLElement>;

let headingCounter = 0;

const components = {
  h1: (props: MDXComponentProps) => (
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-0 leading-snug" {...props} />
  ),
  h2: (props: MDXComponentProps) => {
    const id = `heading-${headingCounter++}`;
    return (
      <h2 
        id={id}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-12 leading-snug border-b-2 border-rose-100 pb-3 scroll-mt-24" 
        {...props} 
      />
    );
  },
  h3: (props: MDXComponentProps) => {
    const id = `heading-${headingCounter++}`;
    return (
      <h3 
        id={id}
        className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 mt-10 leading-snug scroll-mt-24" 
        {...props} 
      />
    );
  },
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

export default async function BookPage({
  params,
}: BookPageProps) {
  const { bookSlug } = await params;

  const book = getBook(bookSlug);
  if (!book) {
    notFound();
  }

  const bookContent = getBookContent(bookSlug);
  if (!bookContent) {
    notFound();
  }

  return (
    <>
      <AppHeader variant="solid" language="np" currentPage="book-detail" />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
        {/* Hero Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Books
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600">{book.author}</p>
            </div>
          </div>
        </div>

        {/* Content Layout with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 prose prose-lg max-w-none pb-20 lg:pb-8">
                <MDXRemote
                  source={bookContent.content}
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

            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1">
              <TableOfContentsSidebar items={bookContent.toc} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { getAllBooks } from "@internal/lib/books";
import Image from "next/image";

export default async function BooksPage() {
  const books = getAllBooks();

  const text = {
    home: 'Home',
    title: 'Books',
    subtitle: 'Explore our collection of books on Nepali Jyotish',
    noBooks: 'No books found',
    comingSoon: 'Books coming soon.',
  };

  return (
    <>
      <AppHeader variant="solid" language="np" currentPage="books" />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
        {/* Books Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{text.subtitle}</p>
          </div>
        </section>

        {/* Books Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          {books.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.996 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{text.noBooks}</h2>
              <p className="text-gray-600">{text.comingSoon}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Book Cover */}
                    {book.coverImage && (
                      <div className="relative h-64 bg-gradient-to-br from-rose-100 to-amber-100 overflow-hidden">
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!book.coverImage && (
                      <div className="relative h-64 bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                        <svg className="w-24 h-24 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.996 10-10.747S17.5 6.253 12 6.253z" />
                        </svg>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {book.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      
                      <p className="text-gray-700 text-sm mb-4 flex-grow line-clamp-3">
                        {book.description}
                      </p>

                      {/* Chapter Count */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-rose-600 text-sm font-medium group-hover:gap-2 transition-all">
                          Read
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

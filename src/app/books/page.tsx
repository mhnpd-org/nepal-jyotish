import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { getAllBooks } from "@internal/lib/books";
import BookCard3D from "@internal/components/book-card-3d";
import Bookshelf from "@internal/components/bookshelf";

export default async function BooksPage() {
  const books = getAllBooks();

  const text = {
    title: 'Our Sacred Library',
    subtitle: 'Explore our carefully curated collection of Jyotish knowledge and spiritual wisdom',
    noBooks: 'No books available yet',
    comingSoon: 'Our collection of sacred texts is coming soon.',
    browseBooks: 'Browse our collection',
  };

  return (
    <>
      <AppHeader variant="solid" language="np" currentPage="books" />
      <main className="min-h-screen">
        {/* Simple Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{text.subtitle}</p>
          </div>
        </section>

        {/* Books Section */}
        <section className="relative bg-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {books.length === 0 ? (
              <div className="text-center py-32">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.996 10-10.747S17.5 6.253 12 6.253z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{text.noBooks}</h2>
                <p className="text-gray-600 mb-8">{text.comingSoon}</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {text.browseBooks}
                </button>
              </div>
            ) : (
              <>
                {/* Books Bookshelf */}
                <Bookshelf>
                  {books.map((book) => (
                    <div
                      key={book.slug}
                      className="w-44 h-64 pt-1"
                    >
                      <BookCard3D book={book} />
                    </div>
                  ))}
                </Bookshelf>
              </>
            )}
          </div>

          {/* Decorative footer element */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookMetadata } from '@internal/lib/books';

interface BookCard3DProps {
  book: BookMetadata;
}

export default function BookCard3D({ book }: BookCard3DProps) {
  return (
    <Link href={`/books/${book.slug}`} className="block h-full group">
      <div className="relative h-full">
        {/* Main book container */}
        <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm shadow-lg overflow-hidden">
          {/* Cover Image or Placeholder */}
          {book.coverImage ? (
            <div className="relative w-full h-full">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-contain"
                sizes="200px"
                priority={false}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 flex flex-col items-center justify-center">
              <svg
                className="w-16 h-16 text-orange-300 mb-4"
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
              <h3 className="text-center text-sm font-bold text-orange-800 line-clamp-4 leading-snug mb-2">
                {book.title}
              </h3>
              <p className="text-center text-xs text-orange-600">
                {book.author}
              </p>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-gray-300">{book.author}</p>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}
                </span>
                <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  Read →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book spine (left side) */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-amber-900 to-amber-800 rounded-l-sm z-10"
          style={{ transform: 'translateX(-1.5px)' }}
        />

        {/* Book shadow */}
        <div className="absolute -bottom-1 left-1 right-1 h-2 bg-black/15 blur-sm rounded-full" />
      </div>
    </Link>
  );
}

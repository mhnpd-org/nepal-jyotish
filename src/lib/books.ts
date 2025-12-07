import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  slug: string;
}

export interface BookChapter {
  id: string;
  title: string;
  slug: string;
  order: number;
  subChapters?: BookSubChapter[];
}

export interface BookSubChapter {
  id: string;
  title: string;
  slug: string;
  order: number;
}

export interface BookMetadata {
  slug: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  publishDate: string;
  chapters: BookChapter[];
}

export interface Book extends BookMetadata {
  content?: string;
}

export interface BookContent {
  slug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  subChapterSlug?: string;
  subChapterTitle?: string;
  content: string;
  nextLink?: { slug: string; title: string };
  prevLink?: { slug: string; title: string };
}

const booksDirectory = path.join(process.cwd(), 'src/books');

/**
 * Extract headings from markdown content to build table of contents
 */
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];

  return matches.map((match, index) => {
    const level = match[1].length; // ## = 2, ### = 3
    const title = match[2];
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return {
      id: `heading-${index}`,
      title,
      level,
      slug,
    };
  });
}

/**
 * Get all books metadata
 */
export function getAllBooks(): BookMetadata[] {
  if (!fs.existsSync(booksDirectory)) {
    return [];
  }

  const bookDirs = fs.readdirSync(booksDirectory).filter((item) => {
    const fullPath = path.join(booksDirectory, item);
    return fs.statSync(fullPath).isDirectory();
  });

  const books = bookDirs.map((bookDir) => {
    // Try to read meta.json first (for backwards compatibility)
    const metaPath = path.join(booksDirectory, bookDir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(metaContent) as BookMetadata;
    }

    // Fallback: Generate metadata from consolidated index.mdx
    const indexPath = path.join(booksDirectory, bookDir, 'index.mdx');
    if (fs.existsSync(indexPath)) {
      const fileContents = fs.readFileSync(indexPath, 'utf8');
      const matterResult = matter(fileContents);
      const frontmatter = matterResult.data as any;

      return {
        slug: bookDir,
        title: frontmatter.title || bookDir.replace(/-/g, ' '),
        author: frontmatter.author || 'Nepal Jyotish Team',
        description: frontmatter.description || 'A book on Nepali Jyotish',
        coverImage: frontmatter.coverImage,
        publishDate: frontmatter.publishDate || new Date().toISOString().split('T')[0],
        chapters: [], // Empty chapters for consolidated structure
      } as BookMetadata;
    }

    return null;
  }).filter((book): book is BookMetadata => book !== null);

  return books.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

/**
 * Get a specific book metadata by slug
 */
export function getBook(slug: string): BookMetadata | null {
  try {
    // Try to read meta.json first (for backwards compatibility)
    const metaPath = path.join(booksDirectory, slug, 'meta.json');
    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(metaContent) as BookMetadata;
    }

    // Fallback: Generate metadata from consolidated index.mdx
    const indexPath = path.join(booksDirectory, slug, 'index.mdx');
    if (fs.existsSync(indexPath)) {
      const fileContents = fs.readFileSync(indexPath, 'utf8');
      const matterResult = matter(fileContents);
      const frontmatter = matterResult.data as any;

      return {
        slug,
        title: frontmatter.title || slug.replace(/-/g, ' '),
        author: frontmatter.author || 'Nepal Jyotish Team',
        description: frontmatter.description || 'A book on Nepali Jyotish',
        coverImage: frontmatter.coverImage,
        publishDate: frontmatter.publishDate || new Date().toISOString().split('T')[0],
        chapters: [], // Empty chapters for consolidated structure
      } as BookMetadata;
    }

    return null;
  } catch (error) {
    console.error(`Error reading book ${slug}:`, error);
    return null;
  }
}

/**
 * Get all book slugs for static generation
 */
export function getAllBookSlugs(): string[] {
  if (!fs.existsSync(booksDirectory)) {
    return [];
  }

  return fs.readdirSync(booksDirectory).filter((item) => {
    const fullPath = path.join(booksDirectory, item);
    return fs.statSync(fullPath).isDirectory();
  });
}

/**
 * Get all chapters and subchapters for a book
 */
export function getBookStructure(bookSlug: string): BookChapter[] | null {
  const book = getBook(bookSlug);
  if (!book) return null;
  return book.chapters;
}

/**
 * Get chapter content by book slug and chapter slug
 */
export function getChapterContent(
  bookSlug: string,
  chapterSlug: string,
  subChapterSlug?: string
): BookContent | null {
  try {
    const book = getBook(bookSlug);
    if (!book) return null;

    const chapter = book.chapters.find((c) => c.slug === chapterSlug);
    if (!chapter) return null;

    let contentPath: string;
    let subChapter: BookSubChapter | undefined;

    if (subChapterSlug) {
      subChapter = chapter.subChapters?.find((sc) => sc.slug === subChapterSlug);
      if (!subChapter) return null;
      contentPath = path.join(
        booksDirectory,
        bookSlug,
        chapterSlug,
        `${subChapterSlug}.mdx`
      );
    } else {
      contentPath = path.join(
        booksDirectory,
        bookSlug,
        chapterSlug,
        'index.mdx'
      );
    }

    if (!fs.existsSync(contentPath)) return null;

    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug: bookSlug,
      bookTitle: book.title,
      chapterSlug,
      chapterTitle: chapter.title,
      subChapterSlug: subChapter?.slug,
      subChapterTitle: subChapter?.title,
      content: matterResult.content,
    };
  } catch (error) {
    console.error(`Error reading chapter content:`, error);
    return null;
  }
}

/**
 * Get full book content from a single index.mdx file
 */
export function getBookContent(bookSlug: string): {
  content: string;
  toc: TableOfContentsItem[];
} | null {
  try {
    const contentPath = path.join(booksDirectory, bookSlug, 'index.mdx');
    if (!fs.existsSync(contentPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const matterResult = matter(fileContents);
    const toc = extractTableOfContents(matterResult.content);

    return {
      content: matterResult.content,
      toc,
    };
  } catch (error) {
    console.error(`Error reading book content for ${bookSlug}:`, error);
    return null;
  }
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  tags?: string[];
  content: string;
  language?: string;
}

export interface BlogMetadata {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  tags?: string[];
  language?: string;
}

const blogsDirectory = path.join(process.cwd(), 'src/blogs');

/**
 * Get all blog posts metadata sorted by date (newest first)
 * @param language - Optional language filter ('np' or 'en'). If not provided, returns all languages.
 */
export function getAllBlogPosts(language?: 'np' | 'en'): BlogMetadata[] {
  const languages = language ? [language] : ['np', 'en'];
  const allPostsData: BlogMetadata[] = [];

  for (const lang of languages) {
    const langDirectory = path.join(blogsDirectory, lang);
    
    // Check if language directory exists
    if (!fs.existsSync(langDirectory)) {
      continue;
    }

    const fileNames = fs.readdirSync(langDirectory);
    const postsInLanguage = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        // Remove ".mdx" from file name to get slug
        const slug = fileName.replace(/\.mdx$/, '');

        // Read markdown file as string
        const fullPath = path.join(langDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the slug
        return {
          slug,
          title: matterResult.data.title || slug,
          excerpt: matterResult.data.excerpt || '',
          date: matterResult.data.date || '',
          author: matterResult.data.author,
          tags: matterResult.data.tags || [],
          language: lang,
        };
      });
    
    allPostsData.push(...postsInLanguage);
  }

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get a specific blog post by slug
 * @param slug - The blog post slug
 * @param language - Optional language ('np' or 'en'). If not provided, searches in 'np' first, then 'en'.
 */
export function getBlogPost(slug: string, language?: 'np' | 'en'): BlogPost | null {
  const languages = language ? [language] : ['np', 'en'];
  
  for (const lang of languages) {
    try {
      const langDirectory = path.join(blogsDirectory, lang);
      const fullPath = path.join(langDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug and content
      return {
        slug,
        title: matterResult.data.title || slug,
        excerpt: matterResult.data.excerpt || '',
        date: matterResult.data.date || '',
        author: matterResult.data.author,
        tags: matterResult.data.tags || [],
        content: matterResult.content,
        language: lang,
      };
    } catch {
      // Continue to next language if file not found
      continue;
    }
  }
  
  console.error(`Error: Blog post ${slug} not found in any language`);
  return null;
}

/**
 * Get all blog post slugs for static generation
 * @param language - Optional language filter ('np' or 'en'). If not provided, returns all languages.
 */
export function getAllBlogSlugs(language?: 'np' | 'en'): Array<{ slug: string; language: string }> {
  const languages = language ? [language] : ['np', 'en'];
  const allSlugs: Array<{ slug: string; language: string }> = [];

  for (const lang of languages) {
    const langDirectory = path.join(blogsDirectory, lang);
    
    // Check if language directory exists
    if (!fs.existsSync(langDirectory)) {
      continue;
    }

    const fileNames = fs.readdirSync(langDirectory);
    const slugsInLanguage = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => ({
        slug: fileName.replace(/\.mdx$/, ''),
        language: lang,
      }));
    
    allSlugs.push(...slugsInLanguage);
  }

  return allSlugs;
}

/**
 * Get recent blog posts (limit to specified number)
 * @param limit - Maximum number of posts to return
 * @param language - Optional language filter ('np' or 'en'). If not provided, returns all languages.
 */
export function getRecentBlogPosts(limit: number = 8, language?: 'np' | 'en'): BlogMetadata[] {
  const allPosts = getAllBlogPosts(language);
  return allPosts.slice(0, limit).map(post => ({
    slug: `/blogs/${post.language}/${post.slug}`,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    language: post.language,
  }));
}

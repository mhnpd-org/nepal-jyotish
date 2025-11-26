/* eslint-disable */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepaljyptish.org';
const outDir = path.join(process.cwd(), 'out');
const blogsDir = path.join(process.cwd(), 'src', 'blogs');

function ensureOut() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
}

function getBlogFiles() {
  if (!fs.existsSync(blogsDir)) return [];
  const languages = ['en', 'np'];
  const allBlogs = [];
  
  languages.forEach(lang => {
    const langDir = path.join(blogsDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.mdx'));
      files.forEach(file => {
        allBlogs.push({ lang, file });
      });
    }
  });
  
  return allBlogs;
}

function buildUrlEntries() {
  const files = getBlogFiles();
  return files.map(({ lang, file }) => {
    const slug = file.replace(/\.mdx$/, '');
    const content = fs.readFileSync(path.join(blogsDir, lang, file), 'utf8');
    const data = matter(content).data || {};
    const lastmod = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
    return {
      loc: `${SITE_URL}/blogs/${lang}/${slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    };
  });
}

function writeSitemap(entries) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const footer = `</urlset>`;
  const body = entries
    .map(
      (e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join('\n');
  const xml = header + body + '\n' + footer;
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
  console.log('Written sitemap.xml');
}

function writeRobots() {
  const content = `# Nepal Jyotish - Traditional Nepali kundali Maker & Kundali
# Robots.txt for https://nepaljyotish.org

User-agent: *
Allow: /
Allow: /blogs/
Allow: /astro/
Disallow: /api/
Disallow: /_next/
Disallow: /out/

# Crawl-delay for polite crawling (optional)
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Additional search engine specific rules
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`;
  fs.writeFileSync(path.join(outDir, 'robots.txt'), content, 'utf8');
  console.log('Written robots.txt');
}

function main() {
  ensureOut();
  const entries = buildUrlEntries();

  // Add static routes with proper priorities
  const staticRoutes = [
    { loc: `${SITE_URL}/`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 },
    { loc: `${SITE_URL}/blogs/np`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/blogs/en`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/date-converter`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.9 },
    { loc: `${SITE_URL}/panchang`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.9 },
    { loc: `${SITE_URL}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/astro`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/astro/janma`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.95 },
    { loc: `${SITE_URL}/astro/traditional`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/astro/charts`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/astro/planet-position`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/astro/vimshottari-dasha`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/astro/yogini-dasha`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/astro/tribhagi-dasha`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/astro/overview`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
    { loc: `${SITE_URL}/astro/home`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
  ];

  const all = [...staticRoutes, ...entries];
  writeSitemap(all);
  writeRobots();
}

if (require.main === module) main();

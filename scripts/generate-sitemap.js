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
  return fs.readdirSync(blogsDir).filter((f) => f.endsWith('.mdx'));
}

function buildUrlEntries() {
  const files = getBlogFiles();
  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
    const data = matter(content).data || {};
    const lastmod = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
    return {
      loc: `${SITE_URL}/blogs/${slug}`,
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
  const content = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(outDir, 'robots.txt'), content, 'utf8');
  console.log('Written robots.txt');
}

function main() {
  ensureOut();
  const entries = buildUrlEntries();

  // Add some static routes
  const staticRoutes = [
    { loc: `${SITE_URL}/`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1 },
    { loc: `${SITE_URL}/blogs`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
  ];

  const all = [...staticRoutes, ...entries];
  writeSitemap(all);
  writeRobots();
}

if (require.main === module) main();

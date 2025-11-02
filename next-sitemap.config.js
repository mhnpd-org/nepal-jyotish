/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepaljyptish.org';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: 'out',
  exclude: ['/astro/traditional', '/astro/tribhagi-dasha', '/astro/vimshottari-dasha', '/astro/yogini-dasha'], // adjust if needed
  transform: async (config, url) => {
    // Custom priority adjustments
    let priority = 0.7;
    if (url === `${siteUrl}/`) priority = 1.0;
    else if (url.startsWith(`${siteUrl}/blogs`)) priority = 0.8;
    else if (url.startsWith(`${siteUrl}/astro/janma`)) priority = 0.6;

    return {
      loc: url,
      changefreq: 'monthly',
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
};

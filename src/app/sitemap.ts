import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/date-converter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/astro/janma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}

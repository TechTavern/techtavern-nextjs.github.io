import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

import { getAllPosts, getTotalPages } from '@/lib/posts';
import { getBaseUrl } from '@/lib/site.server';

function formatYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const allPosts = await getAllPosts();

  const newestPostLastMod = allPosts.reduce<string | null>((acc, post) => {
    return acc === null || post.lastModified > acc ? post.lastModified : acc;
  }, null);

  const rootLastMod = newestPostLastMod ?? formatYmd(new Date());

  const baseRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: rootLastMod, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/articles/`, lastModified: rootLastMod, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const totalPages = await getTotalPages();

  // Pages 2..N only — page 1 is canonically /articles/ (already listed above).
  const paginatedRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => ({
      url: `${base}/articles/page/${index + 2}/`,
      lastModified: rootLastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );

  const postRoutes = allPosts.map((post) => ({
    url: `${base}${post.url}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...baseRoutes, ...paginatedRoutes, ...postRoutes];
}

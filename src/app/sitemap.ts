import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

import { getAllPosts } from '@/lib/posts';
import { getArticleIndexPages } from '@/lib/article-index';
import { getAllProfiles } from '@/lib/profiles';
import { siteAddress } from '@/lib/site.server';

function formatYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPosts();

  const newestPostLastMod = allPosts.reduce<string | null>((acc, post) => {
    return acc === null || post.lastModified > acc ? post.lastModified : acc;
  }, null);

  const rootLastMod = newestPostLastMod ?? formatYmd(new Date());

  const baseRoutes: MetadataRoute.Sitemap = [
    { url: siteAddress.absoluteUrl('/'), lastModified: rootLastMod, changeFrequency: 'weekly', priority: 1 },
    { url: siteAddress.absoluteUrl('/articles/'), lastModified: rootLastMod, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Page 1 is /articles/ (listed above with a higher priority); list pages 2..N.
  const indexPages = await getArticleIndexPages();
  const paginatedRoutes: MetadataRoute.Sitemap = indexPages.slice(1).map(({ path }) => ({
    url: siteAddress.absoluteUrl(path),
    lastModified: rootLastMod,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const postRoutes = allPosts.map((post) => ({
    url: siteAddress.absoluteUrl(post.url),
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const profiles = await getAllProfiles();
  const profileRoutes: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: siteAddress.absoluteUrl(profile.url),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...baseRoutes, ...profileRoutes, ...paginatedRoutes, ...postRoutes];
}

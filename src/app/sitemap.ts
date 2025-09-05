import type { MetadataRoute } from 'next'

// Ensure static generation for static export
export const dynamic = 'force-static';
import { getAllPosts } from '@/lib/posts'
import { getBaseUrl } from '@/lib/site.server'

function formatYmd(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()
  const all = await getAllPosts()

  // Determine site-level lastModified as the newest post's lastModified
  const newestPostLastMod = all.reduce<string | null>((acc, p) => {
    return acc === null || p.lastModified > acc ? p.lastModified : acc
  }, null)
  const rootLastMod = newestPostLastMod ?? formatYmd(new Date())

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: rootLastMod, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/articles/`, lastModified: rootLastMod, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const posts = all.map((p) => ({
    url: `${base}${p.url}`,
    lastModified: p.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...posts]
}

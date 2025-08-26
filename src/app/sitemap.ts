import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getBaseUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()
  const now = new Date().toISOString()

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/articles/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const all = await getAllPosts()
  const posts = all
    .map((p) => ({
      url: `${base}${p.url}`,
      lastModified: p.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...routes, ...posts]
}

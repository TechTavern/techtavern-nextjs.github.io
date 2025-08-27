import { getAllPosts } from '@/lib/posts'
import { getBaseUrl, siteMeta } from '@/lib/site'

// Ensure static generation for static export
export const dynamic = 'force-static';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const base = getBaseUrl()
  const posts = await getAllPosts()
  const items = posts
    .map((p) => {
      const title = escapeXml(p.title)
      const link = `${base}${p.url}`
      const description = escapeXml(p.excerpt || '')
      const pubDate = new Date(p.date).toUTCString()
      const guid = link
      return `\n    <item>\n      <title>${title}</title>\n      <link>${link}</link>\n      <guid isPermaLink=\"true\">${guid}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${description}</description>\n    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(siteMeta.title)}</title>\n    <link>${base}</link>\n    <description>${escapeXml(siteMeta.description)}</description>\n    <language>en-us</language>${items}\n  </channel>\n</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    },
  })
}

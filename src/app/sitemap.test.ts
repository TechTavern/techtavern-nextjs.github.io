/* @jest-environment node */
import type { PostMeta } from '@/lib/posts';

// Mock base URL
jest.mock('@/lib/site.server', () => ({
  getBaseUrl: jest.fn(() => 'https://example.com'),
}));

// Provide a mocked post list
const mockPosts: PostMeta[] = [
  {
    title: 'Older Post',
    date: '2025-07-04',
    lastModified: '2025-07-10',
    slug: 'older',
    excerpt: 'older',
    tags: [],
    featuredImage: undefined,
    ogTitle: undefined,
    ogDescription: undefined,
    ogImage: undefined,
    canonicalUrl: undefined,
    draft: false,
    readingTimeMinutes: 2,
    year: '2025',
    month: '07',
    day: '04',
    url: '/articles/2025/07/04/older/',
    filePath: '/tmp/older.mdx',
  },
  {
    title: 'Newer Post',
    date: '2025-08-13',
    lastModified: '2025-08-13',
    slug: 'newer',
    excerpt: 'newer',
    tags: [],
    featuredImage: undefined,
    ogTitle: undefined,
    ogDescription: undefined,
    ogImage: undefined,
    canonicalUrl: undefined,
    draft: false,
    readingTimeMinutes: 3,
    year: '2025',
    month: '08',
    day: '13',
    url: '/articles/2025/08/13/newer/',
    filePath: '/tmp/newer.mdx',
  },
];

jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(async () => mockPosts),
}));

describe('sitemap lastModified logic', () => {
  it('uses newest post lastModified for root routes and preserves yyyy-mm-dd formatting', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const routes = await sitemap();

    const root = routes.find((r) => r.url === 'https://example.com/');
    const articles = routes.find((r) => r.url === 'https://example.com/articles/');
    expect(root).toBeTruthy();
    expect(articles).toBeTruthy();

    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    expect(dateRe.test(String(root?.lastModified))).toBe(true);
    expect(dateRe.test(String(articles?.lastModified))).toBe(true);
    expect(root?.lastModified).toBe('2025-08-13');
    expect(articles?.lastModified).toBe('2025-08-13');

    // Posts carry their own lastModified
    for (const p of mockPosts) {
      const entry = routes.find((r) => r.url === `https://example.com${p.url}`);
      expect(entry).toBeTruthy();
      expect(entry?.lastModified).toBe(p.lastModified);
      expect(dateRe.test(String(entry?.lastModified))).toBe(true);
    }
  });
});

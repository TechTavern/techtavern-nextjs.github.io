/* @jest-environment node */

import { createPosts } from '@/tests/test-utils';
import { getAllPosts, getTotalPages } from '@/lib/posts';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: jest.fn(),
}));

jest.mock('@/lib/posts', () => {
  const actual = jest.requireActual('@/lib/posts');
  return {
    ...actual,
    getAllPosts: jest.fn(),
    getTotalPages: jest.fn(),
  };
});

const getAllPostsMock = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const getTotalPagesMock = getTotalPages as jest.MockedFunction<typeof getTotalPages>;
const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('sitemap route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBaseUrlMock.mockReturnValue('https://example.com');
    getTotalPagesMock.mockResolvedValue(1);
  });

  it('uses latest post modification timestamp for root entries and preserves per-post values', async () => {
    const posts = createPosts([
      {
        slug: 'older',
        title: 'Older Post',
        date: '2025-07-04',
        lastModified: '2025-07-10',
        excerpt: 'Older',
        tags: [],
      },
      {
        slug: 'newer',
        title: 'Newer Post',
        date: '2025-08-13',
        lastModified: '2025-08-15',
        excerpt: 'Newer',
        tags: [],
      },
    ]);

    getAllPostsMock.mockResolvedValue(posts);

    const { default: sitemap } = await import('@/app/sitemap');

    const routes = await sitemap();

    const root = routes.find((r) => r.url === 'https://example.com/');
    const articles = routes.find((r) => r.url === 'https://example.com/articles/');
    expect(root?.lastModified).toBe('2025-08-15');
    expect(articles?.lastModified).toBe('2025-08-15');

    for (const post of posts) {
      const entry = routes.find((r) => r.url === `https://example.com${post.url}`);
      expect(entry?.lastModified).toBe(post.lastModified);
    }
  });

  it('bubbles up loader errors for visibility in CI', async () => {
    const error = new Error('failed to load posts');
    getAllPostsMock.mockRejectedValue(error);

    const { default: sitemap } = await import('@/app/sitemap');
    await expect(sitemap()).rejects.toThrow('failed to load posts');
  });

  it('lists paginated routes from page 2 onward, never page 1', async () => {
    const posts = createPosts(
      Array.from({ length: 16 }, (_, i) => ({
        slug: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        date: '2025-08-01',
        lastModified: '2025-08-01',
        excerpt: `Excerpt ${i + 1}`,
        tags: [],
      })),
    );

    getAllPostsMock.mockResolvedValue(posts);
    getTotalPagesMock.mockResolvedValue(2);

    const { default: sitemap } = await import('@/app/sitemap');
    const routes = await sitemap();
    const urls = routes.map((r) => r.url);

    expect(urls).toContain('https://example.com/articles/page/2/');
    expect(urls.some((u) => u.includes('/articles/page/1/'))).toBe(false);
  });
});

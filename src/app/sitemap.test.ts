/* @jest-environment node */

import { createPosts } from '@/tests/test-utils';
import { getAllPosts } from '@/lib/posts';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: jest.fn(),
}));

jest.mock('@/lib/posts', () => {
  const actual = jest.requireActual('@/lib/posts');
  return {
    ...actual,
    getAllPosts: jest.fn(),
  };
});

const getAllPostsMock = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('sitemap route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBaseUrlMock.mockReturnValue('https://example.com');
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
});

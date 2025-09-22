/* @jest-environment node */

import { createPosts } from '@/tests/test-utils';
import { getAllPosts } from '@/lib/posts';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('@/lib/site', () => ({
  siteMeta: {
    title: 'Tech & Tavern',
    description: 'Insights <for> builders & leaders',
  },
}));

jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(),
}));

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: jest.fn(),
}));

const getAllPostsMock = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('rss route GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBaseUrlMock.mockReturnValue('https://example.com');
  });

  it('returns RSS XML with escaped content and caching headers', async () => {
    const posts = createPosts([
      {
        title: 'Hello & Welcome',
        slug: 'hello-world',
        date: '2025-02-20',
        lastModified: '2025-02-21',
        excerpt: 'Learn <fast> & grow',
      },
    ]);
    getAllPostsMock.mockResolvedValue(posts);

    const { GET } = await import('@/app/rss.xml/route');
    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=600, stale-while-revalidate=3600',
    );

    const body = await response.text();
    expect(body).toContain('<title>Tech &amp; Tavern</title>');
    expect(body).toContain('<description>Insights &lt;for&gt; builders &amp; leaders</description>');
    expect(body).toContain('<title>Hello &amp; Welcome</title>');
    expect(body).toContain('<description>Learn &lt;fast&gt; &amp; grow</description>');
    expect(body).toContain('<link>https://example.com/articles/2025/02/20/hello-world/</link>');
    expect(body).toContain('<pubDate>Thu, 20 Feb 2025');
  });

  it('propagates post loader failures to surface build issues', async () => {
    getAllPostsMock.mockRejectedValue(new Error('rss load failed'));

    const { GET } = await import('@/app/rss.xml/route');
    await expect(GET()).rejects.toThrow('rss load failed');
  });
});

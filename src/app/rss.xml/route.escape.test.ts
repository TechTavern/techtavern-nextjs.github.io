/* @jest-environment node */

jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn().mockResolvedValue([
    {
      title: 'Q&A Article',
      excerpt: 'An excerpt',
      date: '2024-06-10',
      url: '/articles/2024/06/10/q&a-testing/',
    },
  ]),
}));

jest.mock('@/lib/site', () => ({
  siteMeta: {
    title: 'Tech Tavern',
    description: 'A blog',
  },
}));

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: () => 'https://example.com',
}));

import { GET } from './route';

describe('RSS XML escaping', () => {
  it('escapes XML special characters in link and guid', async () => {
    const res = await GET();
    const xml = await res.text();
    expect(xml).toContain(
      '<link>https://example.com/articles/2024/06/10/q&amp;a-testing/</link>'
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">https://example.com/articles/2024/06/10/q&amp;a-testing/</guid>'
    );
    expect(xml).not.toContain('q&a-testing/</link>');
  });
});

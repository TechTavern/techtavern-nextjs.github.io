/* @jest-environment node */

describe('getAllPosts data loading edge cases', () => {
  it('filters out draft posts and normalises metadata', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('fast-glob', () => jest.fn().mockResolvedValue([
        '/virtual/articles/2025-05-01-first-post.mdx',
        '/virtual/articles/2025-05-02-draft.mdx',
      ]));

      const readFileMock = jest
        .fn()
        .mockResolvedValueOnce(`---\ntitle: First Post\ndate: '2025-05-01'\nslug: first-post\nexcerpt: Intro\ntags:\n  - Testing\n---\nThis is a short article body used to compute reading time.`)
        .mockResolvedValueOnce(`---\ntitle: Draft Post\ndate: '2025-05-02'\nslug: draft-post\ndraft: true\n---\nHidden draft content.`);

      jest.doMock('node:fs/promises', () => ({ readFile: readFileMock }));
      jest.doMock('@/lib/site', () => ({
        DEFAULT_FEATURED_IMAGE: '/images/default.png',
        paginationSettings: {
          defaultItemsPerPage: 5,
          maxVisiblePageLinks: 3,
        },
        siteMeta: { title: 'Tech Tavern', description: 'Testing description' },
      }));
      jest.doMock('@/lib/site.server', () => ({ withBasePath: (value: string | undefined) => value }));

      const { getAllPosts } = await import('./posts');
      const posts = await getAllPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe('first-post');
      expect(posts[0].tags).toEqual(['Testing']);
      expect(posts[0].readingTimeMinutes).toBeGreaterThanOrEqual(1);
    });
  });

  it('throws descriptive errors when frontmatter validation fails', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('fast-glob', () => jest.fn().mockResolvedValue(['/virtual/articles/invalid.mdx']));
      jest.doMock('node:fs/promises', () => ({ readFile: jest.fn().mockResolvedValue(`---\ntitle: \ndate: not-a-date\nslug: invalid\n---\nBody`) }));
      jest.doMock('@/lib/site', () => ({
        DEFAULT_FEATURED_IMAGE: '/images/default.png',
        paginationSettings: {
          defaultItemsPerPage: 5,
          maxVisiblePageLinks: 3,
        },
        siteMeta: { title: 'Tech Tavern', description: 'Testing description' },
      }));
      jest.doMock('@/lib/site.server', () => ({ withBasePath: (value: string | undefined) => value }));

      const { getAllPosts } = await import('./posts');
      await expect(getAllPosts()).rejects.toThrow(/Invalid frontmatter/);
    });
  });
});

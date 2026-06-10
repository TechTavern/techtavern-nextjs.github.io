describe('getAllPosts caching', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = OLD_NODE_ENV;
    jest.resetModules();
    jest.dontMock('node:fs/promises');
    jest.dontMock('fast-glob');
  });

  it('returns the same promise across calls in production', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    jest.resetModules();
    const { getAllPosts } = await import('./posts');
    expect(getAllPosts()).toBe(getAllPosts());
  });

  it('re-reads content in non-production environments', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    jest.resetModules();
    const { getAllPosts } = await import('./posts');
    expect(getAllPosts()).not.toBe(getAllPosts());
  });

  it('serves getPostSource from the production source cache without re-reading', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    jest.resetModules();

    const mockReadFile = jest.fn().mockResolvedValue(
      ['---', 'title: Cached Post', "date: '2024-01-02'", 'slug: cached-post', '---', '', 'Body text'].join('\n'),
    );
    jest.doMock('node:fs/promises', () => ({
      __esModule: true,
      default: { readFile: mockReadFile },
    }));
    jest.doMock('fast-glob', () => ({
      __esModule: true,
      default: jest.fn().mockResolvedValue(['/virtual/2024-01-02-cached-post.mdx']),
    }));

    const { getAllPosts, getPostSource } = await import('./posts');
    await getAllPosts();
    expect(mockReadFile).toHaveBeenCalledTimes(1);

    const source = await getPostSource('/virtual/2024-01-02-cached-post.mdx');
    expect(source).toContain('Body text');
    expect(mockReadFile).toHaveBeenCalledTimes(1); // cache hit — no second disk read
  });
});

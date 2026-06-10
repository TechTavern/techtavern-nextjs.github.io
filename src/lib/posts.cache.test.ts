describe('getAllPosts caching', () => {
  const OLD_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = OLD_NODE_ENV;
    jest.resetModules();
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
});

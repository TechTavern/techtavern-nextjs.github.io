/* @jest-environment node */
import {
  generatePaginationParams,
  getAllPosts,
  getPaginatedPosts,
} from './posts';

describe('getAllPosts (integration with content)', () => {
  it('reads MDX frontmatter, computes URL and reading time', async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);

    for (const p of posts) {
      // Required fields
      expect(typeof p.title).toBe('string');
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.slug.length).toBeGreaterThan(0);
      expect(/\d{4}-\d{2}-\d{2}/.test(p.date)).toBe(true);
      expect(/\d{4}-\d{2}-\d{2}/.test(p.lastModified)).toBe(true);

      // Derived fields
      const expectedUrl = `/articles/${p.year}/${p.month}/${p.day}/${p.slug}/`;
      expect(p.url).toBe(expectedUrl);
      expect(p.filePath.endsWith('.mdx')).toBe(true);

      // Consistent date parts
      const [y, m, d] = p.date.split('-');
      expect(p.year).toBe(y);
      expect(p.month).toBe(m);
      expect(p.day).toBe(d);

      // Reading time is at least 1 minute
      expect(typeof p.readingTimeMinutes).toBe('number');
      expect(p.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('pagination helpers (failing tests before implementation)', () => {
  it('returns paginated posts for requested page', async () => {
    const data = await getPaginatedPosts(1, 5);

    expect(data.currentPage).toBe(1);
    expect(data.itemsPerPage).toBe(5);
    expect(data.pageItems.length).toBeLessThanOrEqual(5);
    expect(data.totalPages).toBeGreaterThan(0);
  });

  it('throws when requesting a page out of range', async () => {
    await expect(getPaginatedPosts(999, 5)).rejects.toThrow('Requested page is out of range');
  });

  it('generates static params for all pages', async () => {
    const params = await generatePaginationParams(10);

    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty('pageNumber');
    expect(params.some((p) => p.pageNumber === '1')).toBe(false);
  });
});

describe('posts pagination utility helpers', () => {
  it('returns empty array when the dataset fits on a single page', async () => {
    const params = await generatePaginationParams(10_000);
    // Page 1 is served canonically at /articles/ — never generated here.
    expect(params).toEqual([]);
  });
});

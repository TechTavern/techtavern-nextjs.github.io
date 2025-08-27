/* @jest-environment node */
import { getAllPosts } from './posts';

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

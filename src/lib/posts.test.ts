/* @jest-environment node */
import { getAllPosts } from './posts';

describe('getAllPosts (integration with content)', () => {
  it('reads MDX frontmatter, computes URL and reading time', async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);

    // Verify a known sample post if present
    const hello = posts.find(p => p.slug === 'hello-world');
    expect(hello).toBeTruthy();
    if (hello) {
      expect(hello.url).toBe('/articles/2025/08/24/hello-world/');
      expect(hello.year).toBe('2025');
      expect(hello.month).toBe('08');
      expect(hello.day).toBe('24');
      // Ensure reading time is at least 1 minute
      expect(hello.readingTimeMinutes && hello.readingTimeMinutes >= 1).toBe(true);
    }
  });
});


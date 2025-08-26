import { FrontmatterSchema } from './posts';

describe('FrontmatterSchema', () => {
  it('accepts valid frontmatter', () => {
    const valid = {
      title: 'Hello',
      date: '2025-08-24',
      slug: 'hello',
      excerpt: 'hi',
      tags: ['meta'],
      canonicalUrl: 'https://example.com/hello',
    };
    expect(FrontmatterSchema.parse(valid)).toBeTruthy();
  });

  it('rejects missing required fields', () => {
    const invalid = {
      date: '2025-08-24',
      // slug missing
    } as any;
    const res = FrontmatterSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      const messages = res.error.issues.map(i => i.message).join(' ');
      expect(messages).toMatch(/title is required/);
      expect(messages).toMatch(/slug is required/);
    }
  });

  it('rejects invalid date format', () => {
    const invalid = {
      title: 'Hello',
      date: '08/24/2025',
      slug: 'hello',
    };
    const res = FrontmatterSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});


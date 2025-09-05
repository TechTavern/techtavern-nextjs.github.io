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

  it('accepts optional lastModified in yyyy-mm-dd', () => {
    const valid = {
      title: 'Hello',
      date: '2025-08-24',
      lastModified: '2025-09-05',
      slug: 'hello',
    };
    const res = FrontmatterSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const invalid = {
      date: '2025-08-24',
      // slug missing
    };
    const res = FrontmatterSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      const paths = res.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('title');
      expect(paths).toContain('slug');
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

  it('rejects invalid lastModified format', () => {
    const invalid = {
      title: 'Hello',
      date: '2025-08-24',
      lastModified: '09/05/2025',
      slug: 'hello',
    };
    const res = FrontmatterSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

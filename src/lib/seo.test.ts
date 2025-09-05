/* @jest-environment node */
import { buildOrganizationJsonLd, buildArticleJsonLd, toAbsoluteUrl } from './seo';
import type { PostMeta } from './posts';

describe('seo JSON-LD builders', () => {
  const baseUrl = 'https://example.com';

  it('builds Organization JSON-LD with absolute logo', () => {
    const json = buildOrganizationJsonLd({
      name: 'Tech Tavern, LLC',
      baseUrl,
      logoPath: '/android-chrome-512x512.png',
      email: 'info@tech-tavern.com',
    });

    expect(json['@type']).toBe('Organization');
    expect(json.name).toBe('Tech Tavern, LLC');
    expect(json.url).toBe(baseUrl);
    expect(json.logo).toBe(`${baseUrl}/android-chrome-512x512.png`);
    expect(json.contactPoint?.[0].email).toBe('info@tech-tavern.com');
  });

  function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
    const p: PostMeta = {
      title: 'Hello World',
      date: '2025-08-24',
      lastModified: '2025-08-24',
      slug: 'hello-world',
      excerpt: 'A short summary',
      tags: ['AI', 'Best Practices'],
      featuredImage: '/images/tech-tavern-default-featured.webp',
      ogTitle: undefined,
      ogDescription: undefined,
      ogImage: undefined,
      canonicalUrl: undefined,
      draft: false,
      readingTimeMinutes: 3,
      year: '2025',
      month: '08',
      day: '24',
      url: '/articles/2025/08/24/hello-world/',
      filePath: '/abs/path/to/file.mdx',
      ...overrides,
    };
    return p;
  }

  it('builds Article JSON-LD using overrides (ogTitle/ogDescription/ogImage/canonical)', () => {
    const post = makePost({
      ogTitle: 'OG Title',
      ogDescription: 'OG Desc',
      ogImage: '/images/og.png',
      canonicalUrl: 'https://canonical.example/articles/hello-world',
    });

    const json = buildArticleJsonLd({
      post,
      baseUrl,
      orgName: 'Tech Tavern, LLC',
      orgLogoPath: '/android-chrome-512x512.png',
    });

    expect(json['@type']).toBe('Article');
    expect(json.headline).toBe('OG Title');
    expect(json.description).toBe('OG Desc');
    expect(json.image).toBe(`${baseUrl}/images/og.png`);
    expect(json.url).toBe('https://canonical.example/articles/hello-world');
    expect(json.publisher?.name).toBe('Tech Tavern, LLC');
    expect(json.publisher?.logo?.url).toBe(`${baseUrl}/android-chrome-512x512.png`);
  });

  it('builds Article JSON-LD with sensible defaults when og fields missing', () => {
    const post = makePost();
    const json = buildArticleJsonLd({
      post,
      baseUrl,
      orgName: 'Tech Tavern, LLC',
      orgLogoPath: '/android-chrome-512x512.png',
    });
    expect(json.headline).toBe(post.title);
    expect(json.description).toBe(post.excerpt);
    expect(json.image).toBe(`${baseUrl}${post.featuredImage}`);
    expect(json.url).toBe(`${baseUrl}${post.url}`);
  });

  it('toAbsoluteUrl handles absolute inputs and invalid URLs safely', () => {
    expect(toAbsoluteUrl('https://foo.bar/img.png', baseUrl)).toBe('https://foo.bar/img.png');
    expect(toAbsoluteUrl('/img.png', baseUrl)).toBe(`${baseUrl}/img.png`);
    // Pass a clearly invalid URL-like string; function should fall back
    expect(toAbsoluteUrl('not a url', baseUrl)).toBe('not a url');
  });
});

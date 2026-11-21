/* @jest-environment node */
import { buildOrganizationJsonLd, buildArticleJsonLd } from './seo';
import { createSiteAddress } from '@/lib/site.server';
import { createPostMeta } from '@/tests/test-utils';

describe('seo JSON-LD builders', () => {
  // Real site address with a non-empty basePath
  const address = createSiteAddress({ siteUrl: 'https://example.com', basePath: '/base' });
  const baseUrl = 'https://example.com/base';

  it('builds Organization JSON-LD with absolute logo', () => {
    const json = buildOrganizationJsonLd({
      name: 'Tech Tavern, LLC',
      address,
      logoPath: '/favicons/android-icon-192x192.png',
      email: 'info@tech-tavern.com',
    });

    expect(json['@type']).toBe('Organization');
    expect(json.name).toBe('Tech Tavern, LLC');
    expect(json.url).toBe(baseUrl);
    expect(json.logo).toBe(`${baseUrl}/favicons/android-icon-192x192.png`);
    expect(json.contactPoint?.[0].email).toBe('info@tech-tavern.com');
  });

  it('builds Article JSON-LD using overrides (ogTitle/ogDescription/ogImage/canonical)', () => {
    const post = createPostMeta({
      ogTitle: 'OG Title',
      ogDescription: 'OG Desc',
      ogImage: '/images/og.png',
      canonicalUrl: 'https://canonical.example/articles/hello-world',
    });

    const json = buildArticleJsonLd({
      post,
      address,
      orgName: 'Tech Tavern, LLC',
      orgLogoPath: '/favicons/android-icon-192x192.png',
    });

    expect(json['@type']).toBe('Article');
    expect(json.headline).toBe('OG Title');
    expect(json.description).toBe('OG Desc');
    expect(json.image).toBe(`${baseUrl}/images/og.png`);
    expect(json.url).toBe('https://canonical.example/articles/hello-world');
    expect(json.publisher?.name).toBe('Tech Tavern, LLC');
    expect(json.publisher?.logo?.url).toBe(`${baseUrl}/favicons/android-icon-192x192.png`);
  });

  it('builds Article JSON-LD with sensible defaults when og fields missing', () => {
    const post = createPostMeta();
    const json = buildArticleJsonLd({
      post,
      address,
      orgName: 'Tech Tavern, LLC',
      orgLogoPath: '/favicons/android-icon-192x192.png',
    });
    expect(json.headline).toBe(post.title);
    expect(json.description).toBe(post.excerpt);
    expect(json.image).toBe(`${baseUrl}${post.featuredImage}`);
    expect(json.url).toBe(`${baseUrl}${post.url}`);
  });
});

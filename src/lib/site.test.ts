/* @jest-environment node */
import { createSiteAddress, defaultFeaturedImageUrl } from './site.server';
import { DEFAULT_FEATURED_IMAGE } from './site';

describe('createSiteAddress', () => {
  const withBase = createSiteAddress({ siteUrl: 'https://example.com/', basePath: '/myapp/' });
  const rootOnly = createSiteAddress({ siteUrl: 'https://example.com', basePath: '' });

  it('combines SITE_URL and basePath into baseUrl', () => {
    expect(withBase.baseUrl).toBe('https://example.com/myapp');
  });

  it('defaults to localhost when SITE_URL is missing', () => {
    expect(createSiteAddress({ basePath: '' }).baseUrl).toBe('http://localhost:3000');
  });

  it('does not apply the basePath twice when SITE_URL already includes it', () => {
    const staging = createSiteAddress({ siteUrl: 'https://example.com/myapp', basePath: '/myapp' });
    expect(staging.baseUrl).toBe('https://example.com/myapp');
    expect(staging.absoluteUrl('/articles/')).toBe('https://example.com/myapp/articles/');
  });

  it('builds hrefs with the basePath exactly once', () => {
    expect(withBase.href('/images/a.webp')).toBe('/myapp/images/a.webp');
    expect(withBase.href('images/a.webp')).toBe('/myapp/images/a.webp');
    expect(rootOnly.href('/images/a.webp')).toBe('/images/a.webp');
  });

  it('builds absolute URLs with the basePath exactly once', () => {
    expect(withBase.absoluteUrl('/images/a.webp')).toBe('https://example.com/myapp/images/a.webp');
    expect(withBase.absoluteUrl('/')).toBe('https://example.com/myapp/');
    expect(rootOnly.absoluteUrl('/articles/x/')).toBe('https://example.com/articles/x/');
  });

  it('applies the trailing-slash convention to page paths but not files', () => {
    expect(withBase.absoluteUrl('/consulting/jane')).toBe('https://example.com/myapp/consulting/jane/');
    expect(withBase.href('/articles?x=1#top')).toBe('/myapp/articles/?x=1#top');
    expect(withBase.href('/sitemap.xml')).toBe('/myapp/sitemap.xml');
  });

  it('passes absolute http(s) URLs through unchanged', () => {
    expect(withBase.href('https://cdn.example/a.png')).toBe('https://cdn.example/a.png');
    expect(withBase.absoluteUrl('http://cdn.example/a.png')).toBe('http://cdn.example/a.png');
  });

  it('builds the default Featured Image URL for an address', () => {
    expect(defaultFeaturedImageUrl(withBase)).toBe(`https://example.com/myapp${DEFAULT_FEATURED_IMAGE}`);
  });
});

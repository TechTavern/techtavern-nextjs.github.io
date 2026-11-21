/* @jest-environment node */
import { articlePresentation } from './article-presentation';
import { createSiteAddress } from '@/lib/site.server';
import { DEFAULT_FEATURED_IMAGE } from '@/lib/site';
import { createPostMeta } from '@/tests/test-utils';

describe('articlePresentation', () => {
  const address = createSiteAddress({ siteUrl: 'https://example.com', basePath: '/base' });
  const root = 'https://example.com/base';

  it('uses the Article overrides when present', () => {
    const post = createPostMeta({
      title: 'Plain Title',
      excerpt: 'Plain excerpt',
      ogTitle: 'OG Title',
      ogDescription: 'OG Desc',
      ogImage: '/images/og.png',
      featuredImage: '/images/featured.png',
      canonicalUrl: 'https://elsewhere.example/original/',
      url: '/articles/2025/01/02/hello/',
    });

    expect(articlePresentation(post, address)).toEqual({
      permalink: `${root}/articles/2025/01/02/hello/`,
      canonicalUrl: 'https://elsewhere.example/original/',
      socialPreview: {
        title: 'OG Title',
        description: 'OG Desc',
        image: `${root}/images/og.png`,
      },
    });
  });

  it('falls back to title, Excerpt, Featured Image and Permalink', () => {
    const post = createPostMeta({
      title: 'Plain Title',
      excerpt: 'Plain excerpt',
      featuredImage: '/images/featured.png',
      url: '/articles/2025/01/02/hello/',
    });
    const result = articlePresentation(post, address);

    expect(result.canonicalUrl).toBe(result.permalink);
    expect(result.socialPreview).toEqual({
      title: 'Plain Title',
      description: 'Plain excerpt',
      image: `${root}/images/featured.png`,
    });
  });

  it('uses the house description and default Featured Image as last resorts', () => {
    const post = createPostMeta({
      title: 'Bare',
      excerpt: undefined,
      featuredImage: undefined,
      ogImage: undefined,
    });
    const { socialPreview } = articlePresentation(post, address);

    expect(socialPreview.description).toBe("Read Bare on Tech Tavern's blog");
    expect(socialPreview.image).toBe(`${root}${DEFAULT_FEATURED_IMAGE}`);
  });

  it('keeps absolute image URLs as-is', () => {
    const post = createPostMeta({ ogImage: 'https://cdn.example/og.png' });
    expect(articlePresentation(post, address).socialPreview.image).toBe('https://cdn.example/og.png');
  });
});

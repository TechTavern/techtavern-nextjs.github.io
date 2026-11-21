import type { PostMeta } from '@/lib/posts';
import type { SiteAddress } from '@/lib/site.server';
import { DEFAULT_FEATURED_IMAGE } from '@/lib/site';

export type SocialPreview = {
  title: string;
  description: string;
  /** Absolute URL of the Social Preview image. */
  image: string;
};

export type ArticlePresentation = {
  /** Absolute Permalink of the Article on this site. */
  permalink: string;
  /** Canonical URL: frontmatter override, otherwise the Permalink. */
  canonicalUrl: string;
  socialPreview: SocialPreview;
};

type PresentablePost = Pick<
  PostMeta,
  'title' | 'excerpt' | 'url' | 'featuredImage' | 'ogTitle' | 'ogDescription' | 'ogImage' | 'canonicalUrl'
>;

/**
 * The single Social Preview fallback chain for an Article, shared by page
 * metadata, Article JSON-LD and anything else that presents an Article off-site.
 */
export function articlePresentation(post: PresentablePost, address: SiteAddress): ArticlePresentation {
  const permalink = address.absoluteUrl(post.url);
  return {
    permalink,
    canonicalUrl: post.canonicalUrl || permalink,
    socialPreview: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt || `Read ${post.title} on Tech Tavern's blog`,
      image: address.absoluteUrl(post.ogImage || post.featuredImage || DEFAULT_FEATURED_IMAGE),
    },
  };
}

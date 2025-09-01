import { withBasePath } from '@/lib/site';
import type { PostMeta } from '@/lib/posts';

export type OrganizationJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    email?: string;
    contactType?: string;
  }>;
};

export type ArticleJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  datePublished: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  description?: string;
  image?: string | string[];
  mainEntityOfPage?: string;
  url?: string;
};

export function toAbsoluteUrl(input: string | undefined, baseUrl: string): string | undefined {
  if (!input) return undefined;
  const s = String(input);
  // If already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(s)) return s;
  // Only resolve root-relative paths against base
  if (s.startsWith('/')) {
    const withBase = withBasePath(s) || s;
    try {
      return new URL(withBase, baseUrl).toString();
    } catch {
      return withBase;
    }
  }
  // Otherwise, leave as provided (avoid coercing arbitrary strings)
  return s;
}

export function buildOrganizationJsonLd(params: {
  name: string;
  baseUrl: string;
  logoPath?: string;
  email?: string;
}): OrganizationJsonLd {
  const { name, baseUrl, logoPath, email } = params;
  const logo = logoPath ? toAbsoluteUrl(logoPath, baseUrl) : undefined;
  const json: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: baseUrl,
  };
  if (logo) json.logo = logo;
  if (email) {
    json.contactPoint = [
      {
        '@type': 'ContactPoint',
        email,
        contactType: 'customer support',
      },
    ];
  }
  return json;
}

export function buildArticleJsonLd(params: {
  post: PostMeta;
  baseUrl: string;
  orgName: string;
  orgLogoPath?: string;
}): ArticleJsonLd {
  const { post, baseUrl, orgName, orgLogoPath } = params;
  const headline = post.ogTitle || post.title;
  const description = post.ogDescription || post.excerpt;
  const image = toAbsoluteUrl(post.ogImage || post.featuredImage, baseUrl);
  const canonical = post.canonicalUrl || toAbsoluteUrl(post.url, baseUrl);
  const publisherLogo = orgLogoPath ? toAbsoluteUrl(orgLogoPath, baseUrl) : undefined;

  const json: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished: post.date,
    author: { '@type': 'Organization', name: orgName },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      ...(publisherLogo
        ? { logo: { '@type': 'ImageObject', url: publisherLogo } }
        : {}),
    },
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(canonical ? { mainEntityOfPage: canonical, url: canonical } : {}),
  };

  return json;
}

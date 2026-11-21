import type { SiteAddress } from '@/lib/site.server';
import { articlePresentation } from '@/lib/article-presentation';
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

export function buildOrganizationJsonLd(params: {
  name: string;
  address: SiteAddress;
  logoPath?: string;
  email?: string;
}): OrganizationJsonLd {
  const { name, address, logoPath, email } = params;
  const logo = logoPath ? address.absoluteUrl(logoPath) : undefined;
  const json: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: address.baseUrl,
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
  address: SiteAddress;
  orgName: string;
  orgLogoPath?: string;
}): ArticleJsonLd {
  const { post, address, orgName, orgLogoPath } = params;
  const { canonicalUrl, socialPreview } = articlePresentation(post, address);
  const publisherLogo = orgLogoPath ? address.absoluteUrl(orgLogoPath) : undefined;

  const json: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: socialPreview.title,
    datePublished: post.date,
    author: { '@type': 'Organization', name: orgName },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      ...(publisherLogo
        ? { logo: { '@type': 'ImageObject', url: publisherLogo } }
        : {}),
    },
    description: socialPreview.description,
    image: socialPreview.image,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };

  return json;
}

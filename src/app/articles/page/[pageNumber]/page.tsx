import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getArticleIndexPage,
  getPagedRouteParams,
  parsePagedRouteParam,
} from '@/lib/article-index';
import { DEFAULT_FEATURED_IMAGE, siteMeta } from '@/lib/site';
import { getBaseUrl, withBasePath } from '@/lib/site.server';
import { ARTICLES_PAGE, ArticlesPageSections } from '@/app/articles/ArticlesPageSections';

function formatMetadataUrl(page: number): string {
  return new URL(withBasePath(`/articles/page/${page}/`)!, getBaseUrl()).toString();
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ pageNumber: string }>> {
  return getPagedRouteParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}): Promise<Metadata> {
  const { pageNumber } = await params;
  const page = await parsePagedRouteParam(pageNumber);
  if (page === null) {
    return {};
  }

  const pageTitle = `${ARTICLES_PAGE.title} – Page ${page}`;
  const pageUrl = formatMetadataUrl(page);

  return {
    title: pageTitle,
    description: siteMeta.description,
    openGraph: {
      title: pageTitle,
      description: siteMeta.description,
      type: 'website',
      siteName: siteMeta.title,
      url: pageUrl,
      images: [
        {
          url: new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString(),
          alt: siteMeta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: siteMeta.description,
      images: [new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString()],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function PaginatedArticlesPage({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}) {
  const { pageNumber } = await params;
  const page = await parsePagedRouteParam(pageNumber);
  if (page === null) {
    notFound();
  }
  const pagination = await getArticleIndexPage(page);

  return <ArticlesPageSections posts={pagination.pageItems} pagination={pagination} />;
}

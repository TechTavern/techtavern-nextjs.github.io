import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PaginationData } from '@/lib/pagination.types';
import type { PostMeta } from '@/lib/posts';
import { generatePaginationParams, getPaginatedPosts, getTotalPages } from '@/lib/posts';
import { DEFAULT_FEATURED_IMAGE, siteMeta } from '@/lib/site';
import { getBaseUrl, withBasePath } from '@/lib/site.server';
import { InvalidPageError } from '@/lib/pagination';
import { ARTICLES_PAGE, ArticlesPageSections } from '@/app/articles/ArticlesPageSections';

function formatMetadataUrl(page: number): string {
  return new URL(withBasePath(`/articles/page/${page}/`)!, getBaseUrl()).toString();
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ pageNumber: string }>> {
  return generatePaginationParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}): Promise<Metadata> {
  const { pageNumber } = await params;

  if (!/^[0-9]+$/.test(pageNumber)) {
    return {};
  }

  const page = Number.parseInt(pageNumber, 10);

  if (page < 1) {
    return {};
  }

  if (page === 1) {
    const canonical = new URL(withBasePath('/articles/')!, getBaseUrl()).toString();
    return {
      title: ARTICLES_PAGE.title,
      description: siteMeta.description,
      alternates: {
        canonical,
      },
    };
  }

  const totalPages = await getTotalPages();
  if (page > totalPages) {
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

async function resolvePagination(pageParam: string): Promise<PaginationData<PostMeta>> {
  if (!/^[0-9]+$/.test(pageParam)) {
    notFound();
  }

  const page = Number.parseInt(pageParam, 10);

  if (page < 1) {
    notFound();
  }

  try {
    return await getPaginatedPosts(page);
  } catch (error) {
    if (error instanceof InvalidPageError) {
      notFound();
    }
    throw error;
  }
}

export default async function PaginatedArticlesPage({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}) {
  const { pageNumber } = await params;
  const pagination = await resolvePagination(pageNumber);

  return <ArticlesPageSections posts={pagination.pageItems} pagination={pagination} />;
}

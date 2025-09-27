import { getPaginatedPosts } from "@/lib/posts";
import { DEFAULT_FEATURED_IMAGE, siteMeta } from "@/lib/site";
import { getBaseUrl, withBasePath } from "@/lib/site.server";
import { ARTICLES_PAGE, ArticlesPageSections } from "@/app/articles/ArticlesPageSections";

export const metadata = { 
  title: ARTICLES_PAGE.title,
  description: siteMeta.description,
  openGraph: {
    title: ARTICLES_PAGE.title,
    description: siteMeta.description,
    type: 'website',
    siteName: siteMeta.title,
    url: new URL(withBasePath('/articles/')!, getBaseUrl()).toString(),
    images: [{ url: new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString(), alt: siteMeta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ARTICLES_PAGE.title,
    description: siteMeta.description,
    images: [new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString()],
  },
  alternates: {
    canonical: new URL(withBasePath('/articles/')!, getBaseUrl()).toString(),
  }
};

export default async function ArticlesIndexPage() {
  const pagination = await getPaginatedPosts(1);
  return <ArticlesPageSections posts={pagination.pageItems} pagination={pagination} />;
}

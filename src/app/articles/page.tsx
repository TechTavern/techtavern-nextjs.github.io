import { getPaginatedPosts } from "@/lib/posts";
import { siteMeta } from "@/lib/site";
import { defaultFeaturedImageUrl, siteAddress } from "@/lib/site.server";
import { ARTICLES_PAGE, ArticlesPageSections } from "@/app/articles/ArticlesPageSections";

export const metadata = { 
  title: ARTICLES_PAGE.title,
  description: siteMeta.description,
  openGraph: {
    title: ARTICLES_PAGE.title,
    description: siteMeta.description,
    type: 'website',
    siteName: siteMeta.title,
    url: siteAddress.absoluteUrl('/articles/'),
    images: [{ url: defaultFeaturedImageUrl(), alt: siteMeta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ARTICLES_PAGE.title,
    description: siteMeta.description,
    images: [defaultFeaturedImageUrl()],
  },
  alternates: {
    canonical: siteAddress.absoluteUrl('/articles/'),
  }
};

export default async function ArticlesIndexPage() {
  const pagination = await getPaginatedPosts(1);
  return <ArticlesPageSections posts={pagination.pageItems} pagination={pagination} />;
}

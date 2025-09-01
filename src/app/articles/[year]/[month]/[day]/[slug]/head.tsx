import { getPostByParams } from '@/lib/posts';
import { siteOrg } from '@/lib/site';
import { getBaseUrl } from '@/lib/site.server';
import { buildArticleJsonLd } from '@/lib/seo';

type HeadProps = { params: Promise<{ year: string; month: string; day: string; slug: string }> };

export default async function Head({ params }: HeadProps) {
  const { year, month, day, slug } = await params;
  const post = await getPostByParams(year, month, day, slug);
  if (!post) return null;

  const baseUrl = getBaseUrl();
  const jsonLd = buildArticleJsonLd({
    post,
    baseUrl,
    orgName: siteOrg.name,
    orgLogoPath: siteOrg.logoPath,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

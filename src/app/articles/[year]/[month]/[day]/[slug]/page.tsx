import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostByParams } from "@/lib/posts";
import { getMDXComponents } from "@/mdx-components";
import { compileMDX } from "next-mdx-remote/rsc";
import { getBaseUrl, siteMeta, withBasePath } from "@/lib/site";
import type { Metadata } from "next";

// Build all routes at export time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({
    year: p.year,
    month: p.month,
    day: p.day,
    slug: p.slug,
  }));
}

type Props = { params: Promise<{ year: string; month: string; day: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = await getPostByParams(year, month, day, slug);
  if (!post) return {};
  const title = post.ogTitle || post.title;
  const description = post.ogDescription || post.excerpt || `Read ${post.title} on Tech Tavern's blog`;
  const base = getBaseUrl();
  const toAbs = (u: string) => {
    const pathWithBase = withBasePath(u) || u;
    try { return new URL(pathWithBase, base).toString(); } catch { return pathWithBase; }
  };
  const chooseImage = post.ogImage || post.featuredImage;
  const imageUrl = chooseImage ? (chooseImage.startsWith('http') ? chooseImage : toAbs(chooseImage)) : undefined;
  const images = imageUrl ? [{ url: imageUrl, alt: title }] : undefined;
  const absoluteUrl = toAbs(post.url);
  const canonical = post.canonicalUrl ? post.canonicalUrl : absoluteUrl;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: siteMeta.title,
      publishedTime: post.date,
      images,
      url: absoluteUrl,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: { canonical },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function ArticlePage({ params }: Props) {
  const { year, month, day, slug } = await params;
  const post = await getPostByParams(year, month, day, slug);
  if (!post) notFound();

  const fs = await import('node:fs/promises');
  const source = await fs.readFile(post.filePath, 'utf8');
  const [{ default: remarkGfm }, { default: rehypeSlug }, { default: rehypeAutolinkHeadings }] = await Promise.all([
    import('remark-gfm'),
    import('rehype-slug'),
    import('rehype-autolink-headings'),
  ]);
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
    components: getMDXComponents({}),
  });

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="bg-secondary/5 py-4 border-b border-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link 
              href="/articles"
              className="text-accent hover:text-accent-dark transition-colors duration-300"
            >
              Articles
            </Link>
            <span className="text-dark/40">/</span>
            <span className="text-dark/70">{post.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {post.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-secondary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="mb-6">
              <Link
                href="/articles"
                className="inline-flex items-center text-accent hover:text-accent-dark transition-colors duration-300 mb-4"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Articles
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-dark mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="text-accent font-medium">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.readingTimeMinutes ? (
                  <span className="text-dark/60 ml-2">· {post.readingTimeMinutes} min read</span>
                ) : null}
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-dark/70 leading-relaxed border-l-4 border-primary/30 pl-4">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:text-dark
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-dark/80 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-accent prose-a:underline hover:prose-a:text-accent-dark prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-2
              [&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline
              [&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit [&_h5_a]:text-inherit [&_h6_a]:text-inherit
              prose-strong:text-dark prose-strong:font-semibold
              prose-code:text-accent prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-dark prose-pre:text-light prose-pre:rounded-lg prose-pre:p-4
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
              prose-ul:text-dark/80 prose-ol:text-dark/80
              prose-li:mb-1
              prose-img:rounded-lg prose-img:shadow-lg
            ">
              {content}
            </div>
          </article>
        </div>
      </main>

      {/* Article Footer */}
      <footer className="bg-secondary/5 py-12 border-t border-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-dark mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-dark/70 mb-6 max-w-2xl mx-auto">
                Let&rsquo;s discuss how Tech Tavern&rsquo;s expertise can help you achieve your technology goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/#Contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl"
                >
                  Get In Touch
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-light transition-all duration-300 rounded-lg"
                >
                  More Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

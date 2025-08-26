import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostByParams } from "@/lib/posts";
import { getMDXComponent } from "@/lib/mdx-imports";

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

export async function generateMetadata({ params }: Props) {
  const { year, month, day, slug } = await params;
  const post = await getPostByParams(year, month, day, slug);
  if (!post) return {};
  return { 
    title: post.title, 
    description: post.excerpt || `Read ${post.title} on Tech Tavern's blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Tech Tavern's blog`,
      type: 'article',
      publishedTime: post.date,
    },
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

  // Get the MDX component from our static import map
  const fileName = post.filePath.split("/").pop()!;
  const MDXContent = getMDXComponent(fileName);
  
  if (!MDXContent) {
    console.error(`MDX component not found for: ${fileName}`);
    notFound();
  }

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
              <time 
                dateTime={post.date}
                className="text-accent font-medium"
              >
                {formatDate(post.date)}
              </time>
              
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
              prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark prose-a:font-medium
              prose-strong:text-dark prose-strong:font-semibold
              prose-code:text-accent prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-dark prose-pre:text-light prose-pre:rounded-lg prose-pre:p-4
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
              prose-ul:text-dark/80 prose-ol:text-dark/80
              prose-li:mb-1
              prose-img:rounded-lg prose-img:shadow-lg
            ">
              <MDXContent />
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
                Let's discuss how Tech Tavern's expertise can help you achieve your technology goals.
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

import { notFound } from "next/navigation";
import path from "node:path";
import { getAllPosts, getPostByParams } from "@/lib/posts";

// Build all routes at export time
export function generateStaticParams() {
  return getAllPosts().map((p) => ({
    year: p.year, month: p.month, day: p.day, slug: p.slug,
  }));
}

type Props = { params: { year: string; month: string; day: string; slug: string } };

export async function generateMetadata({ params }: Props) {
  const post = getPostByParams(params.year, params.month, params.day, params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostByParams(params.year, params.month, params.day, params.slug);
  if (!post) notFound();

  // Import the MDX file as a component using Next’s MDX pipeline
  const rel = path.relative(process.cwd(), post.filePath);
  const module = await import(path.join(process.cwd(), rel));
  const MDXContent = module.default;

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="mb-2">{post.title}</h1>
        <p className="text-sm text-gray-600">{post.date}</p>
        <MDXContent />
      </article>
    </main>
  );
}

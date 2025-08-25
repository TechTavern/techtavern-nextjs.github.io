import { notFound } from "next/navigation";
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
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
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
    <main className="container mx-auto max-w-3xl p-6">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="mb-2">{post.title}</h1>
        <p className="text-sm text-gray-600">{post.date}</p>
        <MDXContent />
      </article>
    </main>
  );
}

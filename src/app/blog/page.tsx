import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Blog" };

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  return (
    <main className="container mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.url} className="border-b pb-4">
            <h2 className="text-xl font-semibold">
              <Link href={p.url} className="underline">{p.title}</Link>
            </h2>
            <p className="text-sm text-gray-600">{p.date}</p>
            {p.excerpt && <p className="mt-2">{p.excerpt}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

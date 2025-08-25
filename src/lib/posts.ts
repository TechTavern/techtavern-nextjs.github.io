import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import fg from "fast-glob";

export type PostMeta = {
  title: string;
  date: string;   // yyyy-mm-dd
  slug: string;
  excerpt?: string;
  tags?: string[];
  year: string;
  month: string;
  day: string;
  url: string;
  filePath: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function splitDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return { year: y, month: m.padStart(2, "0"), day: d.padStart(2, "0") };
}

export function getAllPosts(): PostMeta[] {
  const files = fg.sync("**/*.mdx", { cwd: POSTS_DIR, absolute: true });

  const items = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    if (!data?.date || !data?.slug || !data?.title) {
      throw new Error(`Missing frontmatter in ${filePath}`);
    }

    const { year, month, day } = splitDate(String(data.date));

    return {
      title: String(data.title),
      date: String(data.date),
      slug: String(data.slug),
      excerpt: data.excerpt ? String(data.excerpt) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      year,
      month,
      day,
      url: `/blog/${year}/${month}/${day}/${data.slug}/`,
      filePath,
    };
  });

  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export function getPostByParams(y: string, m: string, d: string, slug: string) {
  return getAllPosts().find((p) => p.year === y && p.month === m && p.day === d && p.slug === slug) || null;
}

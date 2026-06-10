import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import fg from "fast-glob";
import { z } from "zod";
import { DEFAULT_FEATURED_IMAGE, paginationSettings } from "@/lib/site";
import { withBasePath } from "@/lib/site.server";
import { getPaginationData, InvalidPageError } from "@/lib/pagination";
import type { PaginationData } from "@/lib/pagination.types";

export type PostMeta = {
  title: string;
  date: string;   // yyyy-mm-dd
  lastModified: string; // yyyy-mm-dd (falls back to date)
  slug: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  draft?: boolean;
  readingTimeMinutes?: number;
  year: string;
  month: string;
  day: string;
  url: string;
  filePath: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "articles");

// Build-time caches. Next.js invokes getAllPosts from generateStaticParams,
// generateMetadata, every page component, the sitemap, and the RSS route —
// without this cache the content directory is fully re-read and re-parsed
// dozens of times per build. Production-only so `next dev` always sees fresh
// content and Jest keeps per-test isolation.
const isProd = process.env.NODE_ENV === "production";
let postsCache: Promise<PostMeta[]> | null = null;
const sourceCache = new Map<string, string>();

function splitDate(iso: string) {
  const [y, m, d] = String(iso).split("-");
  return { year: y, month: String(m).padStart(2, "0"), day: String(d).padStart(2, "0") };
}

function countWords(s: string): number {
  return (s || "").trim().split(/\s+/).filter(Boolean).length;
}

function computeReadingTime(text: string): number {
  const words = countWords(text);
  return Math.max(1, Math.round(words / 200));
}

export const FrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be yyyy-mm-dd"),
  lastModified: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "lastModified must be yyyy-mm-dd")
    .optional(),
  slug: z.string().min(1, "slug is required"),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z
    .string()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), {
      message: 'canonicalUrl must be an http(s) URL',
    })
    .optional(),
  draft: z.boolean().optional(),
});

async function loadAllPosts(): Promise<PostMeta[]> {
  const files = await fg("**/*.mdx", { cwd: POSTS_DIR, absolute: true });
  const items = await Promise.all(
    files.map(async (filePath) => {
      const raw = await fs.readFile(filePath, "utf8");
      if (isProd) {
        sourceCache.set(filePath, raw);
      }
      const { data, content } = matter(raw);
      const parsed = FrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((issue) => {
            const pathLabel = issue.path.join('.');
            let message = issue.message;
            if (
              issue.code === 'invalid_type' &&
              issue.expected === 'string' &&
              issue.message.includes('received undefined')
            ) {
              message = 'Required';
            }
            return `${pathLabel}: ${message}`;
          })
          .join('; ');
        throw new Error(`Invalid frontmatter in ${filePath}: ${issues}`);
      }
      const fm = parsed.data;
      const { year, month, day } = splitDate(String(data.date));
      const readingTimeMinutes = computeReadingTime(content);
      const featured = withBasePath(fm.featuredImage) || withBasePath(DEFAULT_FEATURED_IMAGE);
      const ogImg = withBasePath(fm.ogImage) || featured;
      const lastModified = fm.lastModified ?? fm.date;
      return {
        title: fm.title,
        date: fm.date,
        lastModified,
        slug: fm.slug,
        excerpt: fm.excerpt,
        tags: fm.tags ?? [],
        featuredImage: featured,
        ogTitle: fm.ogTitle,
        ogDescription: fm.ogDescription,
        ogImage: ogImg,
        canonicalUrl: fm.canonicalUrl,
        draft: Boolean(fm.draft),
        readingTimeMinutes,
        year,
        month,
        day,
        url: `/articles/${year}/${month}/${day}/${fm.slug}/`,
        filePath,
      };
    })
  );
  return items
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPosts(): Promise<PostMeta[]> {
  if (!isProd) {
    return loadAllPosts();
  }
  if (!postsCache) {
    postsCache = loadAllPosts().catch((error: unknown) => {
      // Don't memoize failures — let the next caller retry and surface
      // a single clean error instead of one per concurrent awaiter.
      postsCache = null;
      throw error;
    });
  }
  return postsCache;
}

/**
 * Raw MDX source for a post. During a production build the source was already
 * read (and cached) by getAllPosts, so this avoids a second disk read per page.
 */
export async function getPostSource(filePath: string): Promise<string> {
  const cached = sourceCache.get(filePath);
  if (cached !== undefined) {
    return cached;
  }
  return fs.readFile(filePath, "utf8");
}

export async function getPostByParams(y: string, m: string, d: string, slug: string) {
  const posts = await getAllPosts();
  return posts.find((p) => p.year === y && p.month === m && p.day === d && p.slug === slug) || null;
}

export async function getTotalPages(
  itemsPerPage: number = paginationSettings.defaultItemsPerPage,
): Promise<number> {
  const posts = await getAllPosts();
  const total = posts.length;
  if (total === 0) {
    return 1;
  }
  return Math.ceil(total / itemsPerPage);
}

export async function getPaginatedPosts(
  page: number = 1,
  itemsPerPage: number = paginationSettings.defaultItemsPerPage,
): Promise<PaginationData<PostMeta>> {
  const posts = await getAllPosts();

  try {
    const data = getPaginationData(posts, page, itemsPerPage);
    return {
      ...data,
      pageItems: data.pageItems as PostMeta[],
    };
  } catch (error) {
    if (error instanceof InvalidPageError) {
      throw new InvalidPageError('Requested page is out of range');
    }
    throw error;
  }
}

export async function generatePaginationParams(
  itemsPerPage: number = paginationSettings.defaultItemsPerPage,
): Promise<Array<{ pageNumber: string }>> {
  const totalPages = await getTotalPages(itemsPerPage);
  // Page 1 is served canonically at /articles/ — generate only pages 2..N.
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    pageNumber: String(index + 2),
  }));
}

import { getAllPosts, type PostMeta } from '@/lib/posts';
import { countPages, getPaginationData } from '@/lib/pagination';
import type { PaginationData } from '@/lib/pagination.types';

/**
 * Article Index: the newest-first, paged listing of all published Articles.
 *
 * This module owns the index's addressing rule — page 1 lives at /articles/,
 * pages 2..N at /articles/page/n/ — so routes, static params and the sitemap
 * never repeat it. `@/lib/pagination` is its pure internal core.
 */

export interface ArticleIndexPage {
  pageNumber: number;
  path: string;
}

/** Site-relative path (no basePath) of an Article Index page. */
export function articleIndexPath(pageNumber: number): string {
  return pageNumber <= 1 ? '/articles/' : `/articles/page/${pageNumber}/`;
}

async function countIndexPages(): Promise<number> {
  const posts = await getAllPosts();
  return countPages(posts.length);
}

/** Every Article Index page, 1..N, each listed exactly once. */
export async function getArticleIndexPages(): Promise<ArticleIndexPage[]> {
  const totalPages = await countIndexPages();
  return Array.from({ length: totalPages }, (_, index) => ({
    pageNumber: index + 1,
    path: articleIndexPath(index + 1),
  }));
}

/** Static params for /articles/page/[pageNumber]/: pages 2..N only. */
export async function getPagedRouteParams(): Promise<Array<{ pageNumber: string }>> {
  const pages = await getArticleIndexPages();
  return pages.slice(1).map(({ pageNumber }) => ({ pageNumber: String(pageNumber) }));
}

/**
 * Parse a /articles/page/[pageNumber]/ param. Returns the page number when it is
 * a canonical paged route (2..N), otherwise null — including page 1, which is
 * served at /articles/.
 */
export async function parsePagedRouteParam(param: string): Promise<number | null> {
  if (!/^[1-9][0-9]*$/.test(param)) {
    return null;
  }
  const pageNumber = Number(param);
  if (pageNumber < 2) {
    return null;
  }
  return pageNumber <= (await countIndexPages()) ? pageNumber : null;
}

/** Articles and pagination state for one Article Index page; throws InvalidPageError if out of range. */
export async function getArticleIndexPage(pageNumber: number): Promise<PaginationData<PostMeta>> {
  const posts = await getAllPosts();
  return getPaginationData(posts, pageNumber);
}

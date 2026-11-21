# Article Index

## 2026-11-21
- Before `a78c6e5`, the rule "page 1 is `/articles/`, pages 2..N are `/articles/page/n/`" was repeated in `posts.ts`, `sitemap.ts` and the `[pageNumber]` route; that spread produced the earlier duplicate `/articles/page/1/` bug (`eca4de1`).
- As of `b6e9f16`: `src/lib/article-index.ts` exposes `articleIndexPath(n)`, `getArticleIndexPages()`, `getPagedRouteParams()`, `parsePagedRouteParam(s)`, `getArticleIndexPage(n)`. `src/lib/pagination.ts` stays the pure core (gained `countPages`). Route, sitemap and `PaginationLinks.tsx` consume it.
- Behaviour change on 2026-11-21: page params with leading zeros (e.g. `02`) are now not found.
- Old plans in `docs/superpowers/plans/` still mention the removed `posts.ts` pagination helpers.

Related: [site-addresses](site-addresses.md)

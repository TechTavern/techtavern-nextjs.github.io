# Article Social Preview

## 2026-11-21
- Before `07def32`, the Social Preview / Canonical URL fallback chain was written twice (Article page `generateMetadata` and `seo.ts` `buildArticleJsonLd`) and had drifted: JSON-LD lacked the "Read X on Tech Tavern's blog" description fallback.
- As of `b6e9f16`: `articlePresentation(post, address)` in `src/lib/article-presentation.ts` returns Permalink, Canonical URL and Social Preview; metadata and JSON-LD consume it. The Feed was not switched (its description is just the Excerpt).
- As of `b6e9f16`, `og:url` is the Permalink, not the Canonical URL (unchanged from before; not yet decided whether that is intended).

Related: [site-addresses](site-addresses.md)

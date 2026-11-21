# Site addresses (basePath, trailing slash)

## 2026-11-21
- Before `0a5dc99`, callers built absolute URLs with two idioms (`new URL(withBasePath(p), getBaseUrl())` and `` `${getBaseUrl()}${path}` ``), and `posts.ts` stored image paths already basePath-prefixed. Results: doubled basePath in Social Preview images, Consultant Profile Canonical URLs without a trailing slash, and on staging (where `SITE_URL` already contains the basePath, `deploy.yml:214`) doubled basePath in sitemap, Feed and robots.
- As of `streamweaver/techtavern-nextjs.github.io@b6e9f16` (develop): `createSiteAddress({ siteUrl, basePath })` in `src/lib/site.server.ts` returns `{ baseUrl, href(path), absoluteUrl(path) }`; `siteAddress` is the env-built instance. Stored paths (`PostMeta.url`, images, `ProfileMeta.url`) are basePath-free route paths; page paths end in `/`. `createSiteAddress` strips a basePath duplicated in `SITE_URL`.
- An ESLint rule (`eslint.config.mjs`, commit `ddc1eaa`) forbids hand-rolled site URLs in pages and components.
- `src/app/basepath.integration.test.ts` exercises the real helpers with a non-empty basePath; earlier tests mocked them away, which is how the bugs survived.
- `site.server.ts` is server-only, so client components cannot use it — see [basepath-pitfalls](basepath-pitfalls.md).

Related: [article-social-preview](article-social-preview.md), [2026-11-21-architecture-review](2026-11-21-architecture-review.md)

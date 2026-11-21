# basePath pitfalls

Deploys use three `NEXT_PUBLIC_BASE_PATH` variants (`deploy.yml:205-213`); production is empty, so basePath bugs hide until the `/techtavern-nextjs.github.io` variant.

## 2026-11-21
- Next's own docs (`node_modules/next/dist/docs/`, basePath guide, "Images") say `next/image` `src` needs basePath added manually; raw `<link>` tags never get it. `next/link` hrefs do get it.
- Commits `69ff8ce` and `b6e9f16` routed favicons, preloads, section images, Consultant Profile images and MDX images through `siteAddress.href`.
- (Superseded by the second 2026-11-21 entry below.) Still unprefixed as of `b6e9f16`: the `Navigation.tsx` logo (client component, cannot import server-only `siteAddress`) and CSS `url()`s (fonts, hero backgrounds, `check.svg`). A fix was dispatched on branch `fix/basepath-client-and-css-assets` the same day.
- Verification recipe: `NEXT_PUBLIC_BASE_PATH=/techtavern-nextjs.github.io SITE_URL=https://example.github.io npm run build`, then grep `out/` for unprefixed root-absolute asset URLs and for a doubled basePath.

## 2026-11-21 (later)
- The assets fix landed: `a100f06` passes server-resolved logo srcs from `Header` into the client `Navigation`; `2c3832a` lets the bundler resolve CSS `url()` assets under basePath. Both merged to develop at `b6c15e9`.
- `c9c6d50`: the home `Navigation` rendered `/#Services`-style section links as raw `<a>`, which skip basePath. Next's `next/link` applies basePath to hash links too, so all items now use `Link`. It renders `/#Services` as `<basePath>#Services` (no slash before `#`), the same as the Footer already did.
- A `no-restricted-syntax` rule in `eslint.config.mjs` now forbids raw `<a href="/...">` (string or leading template literal) in `src/app` and `src/components`.
- Jest note: `next/link` reads `process.env.__NEXT_ROUTER_BASEPATH` at module load and `__NEXT_TRAILING_SLASH` per call; `src/app/basepath.integration.test.ts` sets both to render real `Link` hrefs.
- After the fix, the basePath build has no unprefixed `<a href="/...">`. The only remaining `href="/"` is Next's own `<link rel="preconnect" href="/">`, which is not ours.

Related: [site-addresses](site-addresses.md)

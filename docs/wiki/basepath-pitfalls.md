# basePath pitfalls

Deploys use three `NEXT_PUBLIC_BASE_PATH` variants (`deploy.yml:205-213`); production is empty, so basePath bugs hide until the `/techtavern-nextjs.github.io` variant.

## 2026-11-21
- Next's own docs (`node_modules/next/dist/docs/`, basePath guide, "Images") say `next/image` `src` needs basePath added manually; raw `<link>` tags never get it. `next/link` hrefs do get it.
- Commits `69ff8ce` and `b6e9f16` routed favicons, preloads, section images, Consultant Profile images and MDX images through `siteAddress.href`.
- Still unprefixed as of `b6e9f16`: the `Navigation.tsx` logo (client component, cannot import server-only `siteAddress`) and CSS `url()`s (fonts, hero backgrounds, `check.svg`). A fix was dispatched on branch `fix/basepath-client-and-css-assets` the same day.
- Verification recipe: `NEXT_PUBLIC_BASE_PATH=/techtavern-nextjs.github.io SITE_URL=https://example.github.io npm run build`, then grep `out/` for unprefixed root-absolute asset URLs and for a doubled basePath.

Related: [site-addresses](site-addresses.md)

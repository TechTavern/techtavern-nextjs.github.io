# Architecture review, 2026-11-21

Run via `/improve-codebase-architecture` on develop @ `0a5dc99`. Candidates (strength):
1. Site-address module (Strong) — shipped, see [site-addresses](site-addresses.md).
2. Article Social Preview module (Strong) — shipped, see [article-social-preview](article-social-preview.md).
3. Article Index module (Worth exploring) — shipped, see [article-index](article-index.md).
4. Booking Provider table behind one Booking module, with CSP hosts derived from it (Worth exploring) — not started. Adding a provider touched ~5 files as of `0a5dc99`; the consulting page's fallback `<Link>` was unreachable.
5. Shared content-collection loader for Articles and Consultant Profiles (Speculative) — not started; only worth it if a third collection appears.

Outcome: branches `refactor/site-urls-social-preview` and `refactor/article-index-module` were merged via `refactor/architecture-deepening` and fast-forwarded into develop at `b6e9f16` on 2026-11-21 (not pushed at time of writing). Three basePath bugs were fixed plus unprefixed public assets; see [basepath-pitfalls](basepath-pitfalls.md). Commit `b6e9f16` also re-indented `src/mdx-components.tsx` (378-line diff, 12 lines with `-w`).

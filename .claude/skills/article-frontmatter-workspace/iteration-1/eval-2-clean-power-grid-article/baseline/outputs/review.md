# Frontmatter Review: `2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx`

**File:** `/home/streamweaver/codingprojects/techtavern-nextjs.github.io/content/articles/2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx`

**Schema reference:** `src/lib/posts.ts` (`FrontmatterSchema`)

**Reviewer note:** Per instructions, no edits were made to the article. Findings below are recommendations only.

---

## Verdict

The frontmatter will **pass** Zod validation as-is — every required field is present and well-formed. However, there is one **blocking SEO bug** (canonical URL points to a misspelled path that the site will never actually serve) and a related filename typo that should be fixed before commit. A couple of smaller polish items are noted at the end.

---

## Issue 1 — BLOCKING: `canonicalUrl` references a misspelled slug

```yaml
canonicalUrl: "https://techtavern.com/articles/2026/05/02/the-power-grid-was-already-broken-ai-just-made-it-visibile/"
```

The path segment ends in `visibile` (extra `i`), but the actual `slug` field is the correctly spelled `the-power-grid-was-already-broken-ai-just-made-it-visible`. Per `src/lib/posts.ts:115`, the route is generated from the `slug` field:

```ts
url: `/articles/${year}/${month}/${day}/${fm.slug}/`,
```

So the site will publish the article at `.../visible/` while the canonical tag declares the URL is `.../visibile/`. Search engines following the canonical will get a 404. This silently undoes the SEO benefit of having a canonical at all, and it survives Zod validation because `z.string().url()` only checks URL shape, not slug consistency.

**Suggested fix:** change `visibile` → `visible` in `canonicalUrl` so it matches the generated route.

## Issue 2 — Filename contains the same typo

```
2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx
                                                                ^^^^^^^^
```

The filename slug (`visibile`) does not match the frontmatter `slug` (`visible`). Functionally this is harmless — the build reads the frontmatter slug, not the filename — but:

- It breaks the project convention documented in `CLAUDE.md` ("YYYY-MM-DD-slug.mdx") of filename slug matching frontmatter slug.
- It's confusing in `git log`, in editor tabs, and in any tooling that greps by filename.
- The companion article committed on `develop` (`2026-05-18-the-u-s-water-system-was-already-broken.mdx`) follows the matching convention, so this one is the outlier.

**Suggested fix:** rename the file to `2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visible.mdx` (use `git mv` to preserve history).

## Issue 3 — Title capitalization is inconsistent

```yaml
title:   "The Power Grid was already broken. AI just made it visible."
ogTitle: "The Power Grid was already broken. AI just made it visible."
```

"Power Grid" is title-cased while "was already broken" and "just made it visible" are sentence-cased. It reads as a typo even though it isn't. Either commit to sentence case ("The power grid was already broken…") or to title case ("The Power Grid Was Already Broken…"). The other recent articles in `content/articles/` mostly use sentence case in the body slug, so sentence case would be more consistent with house style.

This is stylistic, not a schema problem.

---

## Schema conformance checklist

Verified against `FrontmatterSchema` in `src/lib/posts.ts`:

| Field | Required? | Present | Valid | Notes |
|---|---|---|---|---|
| `title` | yes | yes | yes | See Issue 3 (style only) |
| `date` | yes | yes | yes | `2026-05-02` matches `^\d{4}-\d{2}-\d{2}$` |
| `slug` | yes | yes | yes | Correct spelling (`visible`) |
| `excerpt` | no | yes | yes | 369 chars — long but no schema cap |
| `tags` | no | yes (6) | yes | Reasonable set; all kebab-case |
| `featuredImage` | no | yes | yes | `/images/the-power-grid-was-already-broken.webp` exists in `public/images/` |
| `ogTitle` | no | yes | yes | Duplicates `title` (fine) |
| `ogDescription` | no | yes | yes | Distinct from `excerpt`, good |
| `ogImage` | no | yes | yes | Same as `featuredImage` — fine, but redundant since `posts.ts:96` falls back to `featuredImage` when `ogImage` is missing |
| `canonicalUrl` | no | yes | **passes Zod but semantically wrong** | See Issue 1 |
| `draft` | no | `false` | yes | Explicit false — fine |
| `lastModified` | no | absent | n/a | Falls back to `date` per `posts.ts:97` — fine |

No unknown fields are present that would surprise the parser (Zod does not strip unknowns here, but nothing extra is declared).

---

## Smaller observations (non-blocking)

- **`ogImage` is redundant** with `featuredImage`. `posts.ts:96` already falls back. Keeping it is fine, but if you want a leaner frontmatter you can drop it.
- **`excerpt` length**: at ~370 characters this is fine for the post page but will get truncated in most social-card previews (which clip around 155–200 chars). Consider tightening the first sentence into a true under-200-char hook and letting the longer copy live in `ogDescription` (which is already a tighter ~290 chars).
- **No `lastModified`**: not required, but the article references "the larger article on AI's real cost will follow" and a companion water piece — if you edit this piece after publishing those, set `lastModified` so the schema-driven sitemap/RSS picks up the change.

---

## Recommended pre-commit action

1. Fix `canonicalUrl` (`visibile` → `visible`). **This is the only real bug.**
2. Rename the file to drop the extra `i` (`git mv` to keep history).
3. Optionally: normalize the title capitalization.

Everything else passes.

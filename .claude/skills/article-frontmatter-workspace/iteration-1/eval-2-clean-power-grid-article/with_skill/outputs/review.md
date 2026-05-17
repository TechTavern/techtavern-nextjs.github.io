## Frontmatter review: 2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx

**Headline:** The frontmatter content (excerpt, ogDescription, tags, ogTitle, ogImage, featuredImage) is in good shape and matches the corpus style guide closely — the excerpt is even used as the worked example in `references/style.md`. The one real problem is a typo (`visibile`) that has propagated into the **filename** and the **`canonicalUrl`**, but is correctly spelled in the `slug` field. That mismatch needs fixing before commit.

### Schema validation

- `title`: pass — non-empty string.
- `date`: pass — `2026-05-02` matches `^\d{4}-\d{2}-\d{2}$`.
- `slug`: pass — non-empty string (`the-power-grid-was-already-broken-ai-just-made-it-visible`).
- `canonicalUrl`: pass on Zod (valid URL), **fails Tech Tavern convention** (see below).
- `draft`: pass — boolean `false`.
- All other fields well-formed.

Zod will not reject this file. The build will succeed. The problem is downstream of the schema.

### Convention checks

- **canonicalUrl: MISMATCH.**
  - Current: `https://techtavern.com/articles/2026/05/02/the-power-grid-was-already-broken-ai-just-made-it-visibile/`
  - Expected (per `slug`): `https://techtavern.com/articles/2026/05/02/the-power-grid-was-already-broken-ai-just-made-it-visible/`
  - The canonicalUrl contains `visibile` (typo); the `slug` field contains the correctly-spelled `visible`. This means the article advertises a canonical URL pointing at a path that the routing layer will never generate from this slug — bad for SEO and almost certainly a copy-paste from the filename.
- **Filename vs frontmatter slug: MISMATCH.**
  - Filename: `2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx` (typo: `visibile`)
  - Frontmatter slug: `the-power-grid-was-already-broken-ai-just-made-it-visible` (correct)
  - The dynamic route at `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx` uses the frontmatter slug for URL generation, so the published URL will be the correct `…-visible/`. But the on-disk filename advertises the typo, which is friction for grep, git history, and any future link-by-filename tooling.
- **ogTitle:** present, mirrors `title`. OK.
- **featuredImage:** custom (`/images/the-power-grid-was-already-broken.webp`) — not the default placeholder. OK.
- **ogImage:** present and matches `featuredImage`. OK.

### Stub detection

- **excerpt:** OK. ~340 chars — longer than the 140–200 target in `references/style.md`, but the content is high-quality and this exact string is used as the canonical worked example *in the style guide itself* (`references/style.md`, lines 47–48 and 101–105). Treating it as the corpus's chosen-by-example excerpt. No rewrite proposed.
- **ogDescription:** OK. ~280 chars — over Google's ~160-char SERP truncation point, so the back half (`…and why permitting (not engineering) is the real bottleneck.`) will likely be cut. Front half is well-tuned: keywords `U.S. grid`, `AI`, `data centers`, `reconductoring`, `SMRs`, `interconnection reform`, `10x grid` are all present in the first 160 chars. Optional tightening proposed below if you want a SERP-clean version; otherwise leave as-is.
- **tags:** OK. All six are kebab-case-lowercase and topical. Two reuse existing catalog entries (`tech-strategy`, `sustainability`); four are new but well-formed and earn their keep against the article's themes.

### Tag catalog notes

All six current tags are valid kebab-case. Reuse / new breakdown:

| Tag | Status in catalog |
|---|---|
| `ai-infrastructure` | NEW (first use in corpus) — topical fit; good coinage |
| `energy-policy` | NEW — topical fit; good coinage |
| `data-centers` | NEW — topical fit; good coinage |
| `power-grid` | NEW — topical fit; good coinage |
| `tech-strategy` | EXISTING (1 prior use as `tech-strategy`; also `tech strategy` legacy x1) |
| `sustainability` | EXISTING (1 prior use as `sustainability`; also `Sustainability` legacy x1) |

No semantically duplicate variants found that should have been reused instead. Four new tags in one article is on the high side, but each one names a real subject the piece is genuinely about, and `energy-policy` / `power-grid` / `data-centers` are likely to recur in the announced companion pieces on water and the larger AI-cost article — so they earn their place in the taxonomy now rather than later.

Legacy-cased duplicates exist in older posts (`Sustainability`, `tech strategy`) but per the skill, those are not touched here.

### Proposed edits

The only required edits are the spelling fix in **canonicalUrl** and the **filename** rename. Everything else is optional polish.

**1. Fix canonicalUrl typo (required)**

```yaml
canonicalUrl: "https://techtavern.com/articles/2026/05/02/the-power-grid-was-already-broken-ai-just-made-it-visible/"
```
(Change `visibile` → `visible` to match the `slug` field.)

**2. Rename the file (required, requires `git mv`)**

```
content/articles/2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx
  →
content/articles/2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visible.mdx
```
Use `git mv` so history tracks the rename. Per the user's instructions to this review, I have NOT edited the file myself.

**3. (Optional) Tighten ogDescription for SERP**

Current version is ~280 chars and will be visibly truncated by Google. If you want a clean ~155-char alternative that preserves keyword density:

> U.S. grid capacity has lagged for decades; AI data centers exposed it. Reconductoring, SMRs, and interconnection reform are the fast path to a 10x grid.

(This is essentially the style.md worked example, lightly extended. Use only if you want the SERP-clean version — the existing string is editorially fine, just truncated.)

**tags:** no change proposed.

**excerpt:** no change proposed.

### Open questions for the user

- **Filename rename:** Do you want to rename the `.mdx` file from `…-visibile.mdx` to `…-visible.mdx` (recommended) to match the corrected slug and canonical URL? If yes, use `git mv` to preserve history. (Note that the published article URL is driven by the frontmatter `slug`, not the filename, so the live URL is already correct — this is a hygiene fix, not a routing fix.)
- **ogDescription length:** Keep the longer, more editorial version (current), or swap in the ~155-char SERP-tuned version above? No wrong answer; depends on whether you weight social-share preview readability or Google SERP cleanliness higher for this piece.
- **No other questions.** Tags, excerpt, ogTitle, featuredImage, and ogImage are all good.

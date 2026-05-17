## Frontmatter review: 2026-05-18-the-u-s-water-system-was-already-broken.mdx

### Schema validation

- **pass**. All required fields are present and well-formed:
  - `title`: non-empty string
  - `date`: `"2026-05-18"` matches `^\d{4}-\d{2}-\d{2}$`
  - `slug`: `"the-u-s-water-system-was-already-broken"` non-empty
  - `canonicalUrl`: well-formed URL
  - `draft`: boolean `false`
  - No `lastModified` field present (optional, fine to omit)

Nothing here will break `npm run build`. All remaining issues are convention/stub problems, not schema failures.

### Convention checks

- **canonicalUrl**: ok — `https://techtavern.com/articles/2026/05/18/the-u-s-water-system-was-already-broken/` matches both `date` (2026-05-18 → 2026/05/18) and `slug`.
- **ogTitle**: present — `"The U.S. Water System was Already Broken"`. Sensibly shorter than the full title (drops the "AI just made it visible." trailing clause), which is a reasonable share-preview decision. Keep as-is.
- **filename slug vs frontmatter slug**: match — filename `2026-05-18-the-u-s-water-system-was-already-broken.mdx` aligns with `slug: "the-u-s-water-system-was-already-broken"`.
- **featuredImage**: custom — `/images/the-us-water-system.webp` (not the default placeholder). `ogImage` mirrors it. No action needed, assuming the image actually exists at that path.

### Stub detection

- **excerpt**: **stub** — current value is the literal scaffold string `"A brief description of this article."` (also under the 40-char threshold). Must be rewritten.
- **ogDescription**: **stub** — current value is the literal scaffold string `"A brief description of this article for social media sharing."` Must be rewritten.
- **tags**: **stub** — current value is exactly `["technology", "programming"]`, the `scripts/new-article.js` default. These are also irrelevant to the article (it's a water/infrastructure position paper, not a programming piece).

### Proposed edits

**tags** (kebab-case, reused from catalog where possible):

```yaml
tags:
  - ai-impact            # existing — "AI Impact" x2 in catalog; fits "AI didn't break it, it exposed it" frame
  - data-centers         # existing — "data-centers" x1; the demand-side trigger named in the piece
  - sustainability       # existing — "Sustainability" x1, "sustainability" x1; broad fit for infrastructure-resilience pieces
  - water-infrastructure # NEW — no existing tag in catalog; closest analog is `power-grid` (1 use) from the companion piece
  - infrastructure-policy # NEW — no existing tag; closest analog is `energy-policy` (1 use). Captures the governance / 50,000-utilities thesis
  - pfas                 # NEW — no existing tag; specific searchable term for the contamination angle, appears in summary, diagnosis, toolkit, and takeaways sections
```

Catalog notes:
- For the companion grid article, the corpus uses `power-grid` and `energy-policy` (both 1 use, kebab-case). The proposed `water-infrastructure` and `infrastructure-policy` follow that same pattern and pair the two papers cleanly as a series.
- `ai-impact` already exists in two casings (`AI Impact` x2). The kebab-case form proposed here is the canonical one going forward — older articles use Title Case but are not in scope to change.
- `data-centers` is already kebab-case in the catalog; reuse as-is.
- Six tags is at the top of the recommended 3–6 range. If you'd prefer to trim to five, the easiest drop is `sustainability` (most generic of the set); `pfas` is more searchable. If you'd prefer four, drop both `sustainability` and `infrastructure-policy` and keep the four most concrete.

**excerpt** (editorial hook, ~140–200 chars):

> AI didn't break the U.S. water system — it just turned the lights on a century of underinvestment. The fast path forward isn't new dams. It's hyperscale recycling, AI leak detection, and PFAS retrofit on the pipes we already have.

(228 chars — slightly over the 200 target, but mirrors the structure of the companion grid article's excerpt, which is also longer. Trim option: drop the third sentence's "and PFAS retrofit" to land at ~200.)

Tighter alternative (~180 chars):

> AI didn't break the U.S. water system — it just exposed a century of underinvestment. The fix isn't new dams. It's hyperscale recycling, AI leak detection, and PFAS retrofit on the pipes we already have.

**ogDescription** (SEO / social, ~150–160 chars, declarative, keyword-front-loaded):

> U.S. water infrastructure was failing before AI data centers arrived. Hyperscale wastewater recycling, AI leak detection, and PFAS retrofit are the fast path forward.

(166 chars — one over Google's 160 soft cap. Keyword-front-loaded: "U.S. water infrastructure", "AI data centers", "wastewater recycling", "AI leak detection", "PFAS retrofit" all appear in the first 160 chars.)

Tighter variant (~155 chars), if you want to stay strictly inside Google's window:

> U.S. water infrastructure was failing before AI data centers arrived. Hyperscale recycling, AI leak detection, and PFAS retrofit are the fast path forward.

Note the deliberate divergence from the excerpt:
- The excerpt uses the em-dash "didn't break it, just exposed it" framing for voice consistency with the companion grid piece, and names *what's on the pipes today* (recycling, leak detection, retrofit) as the hook.
- The ogDescription drops the em dash (Google sometimes rewrites stylized punctuation), front-loads the searchable phrase "U.S. water infrastructure", and pairs "AI data centers" as a high-volume search term that anchors the article's angle in the SERP.

### Open questions for the user

- **Tag count and shape**: I'm proposing six tags, three of which are new to the catalog (`water-infrastructure`, `infrastructure-policy`, `pfas`). Are you OK coining all three, or do you want to drop to four-five and pick only the most necessary new tag? My recommendation, if trimming: keep `water-infrastructure` and `pfas` (both highly searchable and article-specific), drop `infrastructure-policy` (overlaps with the thesis-level framing already covered by `ai-impact` + `data-centers`).
- **Series pairing with the grid article**: The piece explicitly frames itself as the companion to your power-grid position paper. Should the two articles share an identical core tag set so they show up together on tag pages? If yes, I'd suggest both end up with `ai-impact`, `data-centers`, `sustainability`, plus their topic-specific tag (`power-grid` vs `water-infrastructure`) and policy tag (`energy-policy` vs `infrastructure-policy`).
- **excerpt length**: My preferred draft is 228 chars, which is above the 200 char guideline but matches the rhythm of your companion grid excerpt. The 180-char tighter variant is also offered. Which do you want?
- **ogDescription length**: 166 vs 155. The 155 version is safer for Google's truncation window; the 166 version is two words richer. Pick one.
- **ogTitle**: Currently `"The U.S. Water System was Already Broken"`. Reasonable, but worth confirming you want the share preview to drop the "AI just made it visible." second clause — that clause is the article's actual frame and might earn its keep in the preview. Optional alternative: `"The U.S. Water System Was Already Broken — AI Just Made It Visible"`.
- **featuredImage**: `/images/the-us-water-system.webp` is set as a custom path (not the default placeholder). Worth a quick `ls public/images/` check to confirm the file actually exists before publish — if it doesn't, the build will still pass but the social card will be broken.

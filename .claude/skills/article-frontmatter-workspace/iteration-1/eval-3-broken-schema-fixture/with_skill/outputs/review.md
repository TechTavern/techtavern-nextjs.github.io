## Frontmatter review: 2026-06-01-broken-fixture.mdx

### Schema validation

**FAIL.** Two hard schema errors will break `npm run build`:

1. **`date: "06-01-2026"`** — fails the Zod regex `^\d{4}-\d{2}-\d{2}$` in `src/lib/posts.ts`. The format is MM-DD-YYYY but must be YYYY-MM-DD. Based on the filename (`2026-06-01-...`), the intended value is `2026-06-01`.
2. **`canonicalUrl: "techtavern.com/articles/2026/05/30/wrong-slug/"`** — fails `z.string().url()`. No scheme (`https://`) and the host needs `https://`. Independent of the schema failure, the path is wrong on two axes: wrong date (`2026/05/30` vs article date `2026/06/01`) and wrong slug (`wrong-slug` vs `when-the-cloud-forgets`).

Both must be fixed before this article will load via `getAllPosts()`.

### Convention checks

- **canonicalUrl**: mismatch. Expected `https://techtavern.com/articles/2026/06/01/when-the-cloud-forgets/`; got `techtavern.com/articles/2026/05/30/wrong-slug/`. Looks like a copy-paste from another article that was never updated.
- **ogTitle**: present (`"When the Cloud Forgets"`). It's a shortened form of the article title, which is reasonable for share previews — the full title is on the long side for OG cards. Acceptable as-is.
- **filename slug vs frontmatter slug**: mismatch. Filename slug is `broken-fixture`; frontmatter slug is `when-the-cloud-forgets`. The frontmatter slug matches the article title, so I'm assuming the file was renamed (or is a fixture) and the frontmatter slug is the intended one. Worth confirming — if the filename is authoritative this is a different fix.
- **featuredImage**: DEFAULT (`/images/tech-tavern-default-featured.webp`) — placeholder still in place.
- **ogImage**: DEFAULT (same placeholder). Will follow featuredImage once a real one is generated.

### Stub detection

- **excerpt**: stub — current value: `"A brief description of this article."` Exact scaffold string from `scripts/new-article.js`.
- **ogDescription**: stub — current value: `"A brief description of this article for social media sharing."` Exact scaffold string.
- **tags**: stub — current value: `["technology", "programming"]`. Exact scaffold default. Also: both legacy lowercase forms, not kebab-case (though "technology" and "programming" are single words so casing isn't the issue — the issue is they're the placeholder defaults and don't describe what the article is actually about: AI memory governance).

### Proposed edits

**date** (schema fix, required to build):
```
date: "2026-06-01"
```

**canonicalUrl** (schema + shape fix):
```
canonicalUrl: "https://techtavern.com/articles/2026/06/01/when-the-cloud-forgets/"
```

**tags** (kebab-case, reused from catalog where possible):
```
tags:
  - ai-memory
  - ai-governance
  - data-privacy
  - nonprofit-tech
  - responsible-ai
```
Catalog notes:
- `ai-memory` already appears twice in the corpus (both as `"AI Memory"` legacy Title Case). Kebab-case is canonical going forward.
- `ai-governance` is the most-used tag in the corpus (7 uses across 4 casings: `AI Governance`, `AI governance`, `ai governance`, `ai-governance`). Use kebab-case here.
- `data-privacy` exists once as `"data privacy"`. Kebab is canonical.
- `nonprofit-tech` exists once already in kebab form. The article also discusses regulated industries — if a `regulated-industries` tag matters more to you than `nonprofit-tech`, it would be a new coinage (not in catalog). I'd lean `nonprofit-tech` because the piece explicitly names nonprofits.
- `responsible-ai` exists once as `"responsible ai"`. Kebab is canonical. This tag captures the "governance event" framing well.

**excerpt** (editorial hook, ~140–200 chars):
> AI memory just became a competitive feature instead of a courtesy. The question isn't whether your AI remembers you — it's who owns the record, who can subpoena it, and what happens when the vendor decides memory is no longer free.

(~270 chars — slightly long; tighten if you want a card-friendly version below.)

Tighter alternative (~190 chars):
> AI memory stopped being a courtesy and became a competitive feature in 2026. The real question isn't whether your AI remembers you — it's who owns the record, and who can subpoena it.

**ogDescription** (SEO/social, ~150–160 chars, declarative, keyword-front-loaded):
> Persistent AI memory from Anthropic, OpenAI, and Google is a governance event for nonprofits and regulated industries. A guide to ownership, privacy, and policy.

(~163 chars — front-loads "Persistent AI memory", names the three vendors as searchable keywords, and signals the audience and topic — ownership, privacy, policy.)

### Open questions for the user

- **Filename vs slug**: the filename is `2026-06-01-broken-fixture.mdx` but the frontmatter slug is `when-the-cloud-forgets`. I'm assuming the slug is right and the filename is a fixture artifact. If this were a real article, the file should be renamed to `2026-06-01-when-the-cloud-forgets.mdx`. Confirm?
- **featuredImage / ogImage**: both still the default placeholder. Generate a real featured image before publishing?
- **Tag count**: I proposed 5 tags. If you want to trim to 4, drop `responsible-ai` (it's the most thematic-overlap with `ai-governance`). If you want to expand to 6, `ai-safety` (3 uses in catalog) is a defensible add given the subpoena/governance framing — but it leans more "model behavior" than this piece warrants. Recommend leaving it off.
- **Excerpt length**: my preferred version is ~270 chars (corpus has examples at that length, e.g., the power-grid article excerpt). The tighter ~190-char version hits the style.md target more cleanly. Pick one.

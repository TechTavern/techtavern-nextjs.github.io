---
name: article-frontmatter
description: Review and improve frontmatter for Tech Tavern MDX articles in `content/articles/`. Use when the user is finalizing, publishing, or reviewing a new article; when an article has stub or placeholder `excerpt` / `ogDescription` / `tags`; or when validating article metadata before commit. Catalogs existing tags across the corpus for consistency, generates editorially distinct excerpt and ogDescription strings, and validates against the project's Zod frontmatter schema. Trigger whenever the user mentions reviewing, publishing, finalizing, polishing, or fixing an article in this repo — even if they don't say "frontmatter" explicitly. Also trigger on phrases like "check this article", "is this ready to publish", "fill in the metadata", "tag this article", or when the user points at a file under `content/articles/`.
---

# Article Frontmatter Review

You are reviewing an MDX article in `content/articles/` for Tech Tavern, an IT/AI LLC publishing tech articles and position papers. Your job is to leave the frontmatter ready for publish: validated, consistent with the rest of the corpus, and editorially distinct.

The work has four phases. Do them in order — each one feeds the next.

## Phase 1 — Read the article and current frontmatter

Read the full MDX file. You need the body to write metadata that actually reflects the piece. Skimming just the title gives you generic, useless output.

While reading, note:
- The argument or thesis (what is the author claiming?)
- The audience (engineering leaders? nonprofit boards? practitioners?)
- 2–5 concrete technical or domain terms that an interested reader would search for
- The tone (declarative, op-ed-ish, technical deep-dive, urgent advisory?)

Then extract the existing frontmatter. Identify which fields are present, missing, or stub.

**Stub signals** — treat any of these as "needs rewriting":
- Exact match for known scaffold strings: `"A brief description of this article."`, `"A brief description of this article for social media sharing."`
- Empty string or absent
- Length < 40 characters (excerpt/ogDescription) — too short to do their job
- Generic placeholder phrasing: contains `TODO`, `TBD`, `placeholder`, `lorem`, `Your description here`
- Tags = `["technology", "programming"]` exactly — that's the scaffold default in `scripts/new-article.js`
- `featuredImage` = `/images/tech-tavern-default-featured.webp` — flag, don't auto-fix (image generation is a separate workflow)

## Phase 2 — Validate against the schema

The build's Zod schema lives at `src/lib/posts.ts`. A frontmatter file that fails validation will break `npm run build`. Check:

| Field | Rule |
|---|---|
| `title` | Required, non-empty string |
| `date` | Required, format `^\d{4}-\d{2}-\d{2}$` (e.g., `2026-05-18`) |
| `lastModified` | Optional; if present, same `yyyy-mm-dd` format |
| `slug` | Required, non-empty string |
| `canonicalUrl` | Optional; if present, must be a valid URL |
| `draft` | Optional boolean |

Additional Tech Tavern conventions (not enforced by Zod, but break implicit contracts):

- **`canonicalUrl` shape** must be `https://techtavern.com/articles/YYYY/MM/DD/slug/` where `YYYY/MM/DD` matches the article's own `date` field and `slug` matches the article's `slug`. A mismatch means the article advertises a canonical URL pointing at a different post — bad for SEO and likely a copy-paste error.
- **`ogTitle`** — flag if missing. Not required by the schema, but social/SERP previews benefit from an explicitly tuned title. Default to the article `title` if you propose one; only diverge when the article `title` is long or stylized in a way that hurts share previews.
- **File-name vs slug consistency** — files are named `YYYY-MM-DD-slug.mdx`. The slug in the filename should match the `slug` field. Mismatch is a renamed-but-not-updated bug.

Report all schema and convention violations before suggesting content edits. The user needs to see them.

## Phase 3 — Catalog existing tags before proposing new ones

This is the single most important step for consistency. The corpus has accumulated three tag style conventions over time (Title Case, lowercase-with-spaces, kebab-case-lowercase). Going forward, all new and corrected tags use **kebab-case-lowercase**, matching the 2026-era articles.

Before assigning tags to the article:

1. Run `bash .claude/skills/article-frontmatter/scripts/tag_catalog.sh` from the repo root. It emits a frequency table of every tag in `content/articles/`, plus a kebab-normalized canonical form. Read the output.
2. For each tag concept you want to assign, **prefer an existing kebab-case tag** that already appears in the catalog (e.g., `ai-governance`, `ai-strategy`, `nonprofit-tech`). Reusing an existing tag is almost always better than inventing a new variant.
3. Only invent a new tag if no semantically equivalent tag exists in the catalog. New tags must be kebab-case, lowercase, hyphen-separated.
4. Aim for **3–6 tags per article**. Fewer than 3 under-categorizes the piece; more than 6 dilutes signal.
5. Tags should describe what the article is **about**, not adjectives describing it. `ai-governance` good. `important` bad. `analysis` bad. `2026` bad.

When the catalog shows the same concept in multiple casings (e.g., `AI Governance`, `ai governance`, `ai-governance`), the kebab-case form is the canonical one for this article. Surface the legacy-cased variants in your report so the user knows duplicates exist in older posts — but do NOT modify other articles unless the user explicitly asks.

## Phase 4 — Generate or improve `excerpt` and `ogDescription`

These two fields look similar but serve different audiences. Writing them as duplicates wastes a real opportunity.

Read `references/style.md` for full editorial guidance, length targets, voice notes, and worked examples. The short version:

- **`excerpt`** is editorial copy shown on article cards and in the RSS feed. It's read by humans who are browsing. Write a hook — a tension, a thesis, or a vivid claim that makes someone want to click. Use the author's voice. Em dashes and questions are welcome. Target ~140–200 chars.
- **`ogDescription`** is meta description copy shown by Google in search results and on social shares. It's read by algorithms and by people skimming SERPs. Write a declarative, keyword-aware summary that front-loads the value prop. Target ~150–160 chars (Google's truncation point). Avoid `?!` and stylized punctuation.

When generating both: write the excerpt first (it's the harder one — voice matters), then write a separate ogDescription that's keyword-tuned. They should overlap in topic, not in wording. If you find yourself writing identical strings, stop and rewrite the ogDescription with the keywords you'd want the article to rank for.

If `ogDescription` is missing but `excerpt` is well-written, the page-level meta layer already falls back to `excerpt` (see `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx:29`). So an explicit `ogDescription` only earns its keep when it's genuinely different. Don't add one just to fill the field — make it work harder than the fallback would.

## Output format

Present your review in this structure. Don't blind-edit the file — show the user what you propose and let them say go.

```
## Frontmatter review: <article filename>

### Schema validation
- [ pass | fail with specific reasons ]

### Convention checks
- canonicalUrl: [ ok / mismatch — expected X, got Y ]
- ogTitle: [ present / missing ]
- filename slug vs frontmatter slug: [ match / mismatch ]
- featuredImage: [ custom / DEFAULT (image still placeholder) ]

### Stub detection
- excerpt: [ ok / stub — current value: "..." ]
- ogDescription: [ ok / stub / missing ]
- tags: [ ok / stub / generic ]

### Proposed edits

**tags** (kebab-case, reused from catalog where possible):
```
tags:
  - existing-tag-from-catalog
  - another-existing-tag
  - newly-coined-tag      # NEW — not in catalog
```
Catalog notes: <which existing variants this concept has appeared as, if relevant>

**excerpt** (editorial hook, ~140–200 chars):
> [proposed string]

**ogDescription** (SEO/social, ~150–160 chars, declarative, keyword-front-loaded):
> [proposed string, materially different from excerpt]

### Open questions for the user
- [Anything ambiguous: e.g., "Two tags could fit here — `data-privacy` (3 articles) or `privacy` (1 article). Recommend `data-privacy`. OK?"]
- [Flag default featuredImage if applicable: "featuredImage is still the default — generate one before publishing?"]
```

After the user approves (or asks for tweaks), apply the edits with the Edit tool. Preserve the surrounding YAML format the article already uses — some articles use `>-` block scalars, some use double-quoted strings, some use bracketed inline arrays. Match what's there. Don't reformat unrelated frontmatter fields.

## Why this workflow

The two failure modes this skill is designed to prevent:

1. **Generic, recycled metadata.** Without reading the article body, an LLM writes excerpts that could apply to any AI op-ed. Without consulting the tag catalog, it invents new tag spellings that fragment the taxonomy. Both make the site weaker over time.
2. **Silent schema breakage.** The Zod schema rejects bad frontmatter at build time, which means a typo can break `npm run build` after you've already pushed. Catching it before commit is cheaper than catching it in CI.

The phased structure (read → validate → catalog → write) ensures you have the context before you have an opinion. Skipping straight to "write an excerpt" without reading the article produces the kind of output Scott will rewrite anyway.

## Reference files

- `references/style.md` — Detailed voice/tone/length guidance for excerpt vs ogDescription, with examples drawn from existing Tech Tavern articles.
- `scripts/tag_catalog.sh` — Emits the current tag frequency table. Run from repo root.

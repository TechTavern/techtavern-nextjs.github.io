# Frontmatter Review: `2026-06-01-broken-fixture.mdx`

**File reviewed:** `/home/streamweaver/codingprojects/techtavern-nextjs.github.io/.claude/skills/article-frontmatter/evals/fixtures/2026-06-01-broken-fixture.mdx`
**Schema reference:** `src/lib/posts.ts` (`FrontmatterSchema`)

## Summary

The frontmatter has two **build-breaking** schema violations and several **content/consistency** problems that would harm SEO and reader experience even if the build passed. As written, `getAllPosts()` would throw an `Invalid frontmatter` error at build time and the site would not build.

---

## Blocking issues (will fail Zod validation at build time)

### 1. `date` is in the wrong format

```yaml
date: "06-01-2026"
```

The schema enforces ISO `yyyy-mm-dd`:

```ts
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be yyyy-mm-dd")
```

`"06-01-2026"` is `MM-DD-YYYY`, which fails the regex. This is also the format Tech Tavern's date-based URL routing depends on — `splitDate()` in `src/lib/posts.ts` splits on `-` and assigns the first segment to `year`, so even if the regex were lenient, the resulting URL would be `/articles/06/01/2026/...` instead of `/articles/2026/06/01/...`.

**Fix:** `date: "2026-06-01"` (matches the filename prefix).

### 2. `canonicalUrl` is not a valid URL

```yaml
canonicalUrl: "techtavern.com/articles/2026/05/30/wrong-slug/"
```

The schema requires a full, parseable URL:

```ts
canonicalUrl: z.string().url().optional(),
```

`"techtavern.com/..."` has no protocol (`https://`) and Zod's `.url()` will reject it.

**Fix:** prefix with `https://` — but see issue #3 below before fixing, because the URL itself is also wrong.

---

## Content / consistency issues (would pass schema, but are still wrong)

### 3. `canonicalUrl` points to the wrong article

Even once the protocol is added, the path doesn't match this post:

- Filename / intended date: `2026-06-01`
- Slug in frontmatter: `when-the-cloud-forgets`
- Canonical URL path: `/articles/2026/05/30/wrong-slug/`

Both the date segment (`2026/05/30`) and the slug (`wrong-slug`) disagree with this post's own frontmatter. A canonical URL pointing to a different page is worse than no canonical URL at all — it tells search engines to deindex this article in favor of a URL that doesn't exist.

**Fix:** Either remove `canonicalUrl` entirely (it's optional and only needed when republishing content that lives elsewhere), or set it to `https://techtavern.com/articles/2026/06/01/when-the-cloud-forgets/`.

### 4. Filename date does not match frontmatter date

- Filename: `2026-06-01-broken-fixture.mdx`
- Frontmatter `date`: `06-01-2026` (same calendar day, wrong format)
- Frontmatter `slug`: `when-the-cloud-forgets`

The filename slug (`broken-fixture`) also doesn't match the frontmatter slug. For a normal article in `content/articles/` this would be confusing for authors editing the file later; for a fixture named "broken-fixture" the mismatch is presumably intentional, but worth flagging.

### 5. `excerpt` is a placeholder

```yaml
excerpt: "A brief description of this article."
```

This is the literal default string emitted by `scripts/new-article.js`. It needs to be replaced with a real one-to-two-sentence summary of the article — e.g., something like *"Persistent AI memory shipped across all three major vendors in 2026. The real question isn't whether your assistant remembers you — it's who owns the record and what happens when memory stops being free."*

### 6. `ogDescription` is also a placeholder

```yaml
ogDescription: "A brief description of this article for social media sharing."
```

Same problem — this is the new-article scaffold default. Social cards will look unfinished. Either write a dedicated 1–2 sentence social blurb (often a tighter version of `excerpt`) or remove the field so the page falls back to `excerpt`.

### 7. `tags` are generic and unrelated to the topic

```yaml
tags: ["technology", "programming"]
```

The article is about AI memory, vendor lock-in, governance, and data ownership — there is no programming content. Suggested tags:

```yaml
tags: ["ai", "ai-memory", "governance", "vendor-lock-in", "privacy"]
```

Use whatever tag vocabulary Tech Tavern is already standardizing on, but `programming` should go.

### 8. `ogTitle` is shorter than `title` (minor)

```yaml
title: "When the Cloud Forgets: AI Memory and the Cost of Continuity"
ogTitle: "When the Cloud Forgets"
```

This is allowed and sometimes deliberate (social cards prefer punchier titles), so it's not necessarily wrong — but the trimmed version drops the subject matter ("AI Memory"), which is the part that would actually drive a click. Consider `"When the Cloud Forgets: AI Memory in 2026"` or similar.

---

## Suggested corrected frontmatter

```yaml
---
title: "When the Cloud Forgets: AI Memory and the Cost of Continuity"
date: "2026-06-01"
slug: "when-the-cloud-forgets"
excerpt: "Persistent AI memory shipped across Anthropic, OpenAI, and Google in 2026. The real question isn't whether your assistant remembers you — it's who owns the record, who can subpoena it, and what happens when memory stops being free."
tags: ["ai", "ai-memory", "governance", "privacy", "vendor-lock-in"]
featuredImage: "/images/tech-tavern-default-featured.webp"
ogTitle: "When the Cloud Forgets: AI Memory in 2026"
ogDescription: "Persistent AI memory is now a default, not a feature. Here's why nonprofits and regulated industries should be writing memory policy before the first incident."
ogImage: "/images/tech-tavern-default-featured.webp"
# canonicalUrl omitted — only needed when republishing from another canonical source
draft: false
---
```

## Severity ranking

| # | Issue | Severity | Build-blocking? |
|---|-------|----------|-----------------|
| 1 | `date` wrong format | Critical | Yes |
| 2 | `canonicalUrl` missing protocol | Critical | Yes |
| 3 | `canonicalUrl` points to wrong page | High (SEO) | No |
| 4 | Filename/slug/date mismatch | Medium | No |
| 5 | Placeholder `excerpt` | Medium | No |
| 6 | Placeholder `ogDescription` | Medium | No |
| 7 | Off-topic `tags` | Low–Medium | No |
| 8 | `ogTitle` drops key phrase | Low | No |

# Frontmatter Review: `2026-05-18-the-u-s-water-system-was-already-broken.mdx`

Reviewed against the Zod schema in `src/lib/posts.ts` (`FrontmatterSchema`) and the conventions established by recently published Tech Tavern articles — in particular the companion grid piece (`2026-05-02-the-power-grid-was-already-broken-ai-just-made-it-visibile.mdx`), which this article is explicitly paired with.

## Current frontmatter

```yaml
title: "The U.S. Water System was Already Broken. AI just made it visible."
date: "2026-05-18"
slug: "the-u-s-water-system-was-already-broken"
excerpt: "A brief description of this article."
tags: ["technology", "programming"]
featuredImage: "/images/the-us-water-system.webp"
ogTitle: "The U.S. Water System was Already Broken"
ogDescription: "A brief description of this article for social media sharing."
ogImage: "/images/the-us-water-system.webp"
canonicalUrl: "https://techtavern.com/articles/2026/05/18/the-u-s-water-system-was-already-broken/"
draft: false
```

## Schema validity check (`src/lib/posts.ts`)

All required fields are present and well-formed; the build will not fail:

- `title` — non-empty string. OK.
- `date` — matches `^\d{4}-\d{2}-\d{2}$`, and agrees with the filename prefix `2026-05-18-`. OK.
- `slug` — non-empty, matches the filename slug. OK.
- `canonicalUrl` — valid absolute URL, matches the URL the site will actually generate (`/articles/2026/05/18/the-u-s-water-system-was-already-broken/`). OK.
- `draft: false` — boolean. OK (will publish on next build).
- Optional fields are all the right types.

Conclusion: the file passes schema validation. **All findings below are quality / SEO / consistency issues, not blocking errors.**

## Issues to fix before publishing

### 1. Placeholder `excerpt` (BLOCKER for publish quality)

```yaml
excerpt: "A brief description of this article."
```

This is the `new-article.js` scaffold default. It will be used as the article preview on listing pages and in feeds, and is one of the most visible pieces of marketing copy for the post. It must be replaced.

**Proposed replacement** (drawn from the article's own framing — Summary section + "The demand collision" + "The obstacle is the way"):

```yaml
excerpt: "AI didn't break the U.S. water system — it just exposed a century of underinvestment that was already failing. Pipes from the 1800s, PFAS in a quarter of the supply, six billion gallons a day lost to leaks, and a workforce a decade from retirement. The fast path to a 10x water system isn't new dams; it's hyperscale recycling on the Orange County model, AI-powered leak detection, and PFAS retrofit at the plant scale."
```

This intentionally mirrors the structure of the grid piece's excerpt ("AI didn't break the U.S. power grid — it just turned the lights on...") since the two papers are companions and the parallelism is editorially load-bearing.

### 2. Placeholder `ogDescription` (BLOCKER for publish quality)

```yaml
ogDescription: "A brief description of this article for social media sharing."
```

Same scaffold-default problem. This is what shows up in Twitter / LinkedIn / Slack previews and matters a great deal for a position paper that is meant to circulate.

**Proposed replacement** (shorter and punchier than the excerpt, per the convention in the grid and Claude Code pieces):

```yaml
ogDescription: "The U.S. water system was aging out before AI showed up — data centers just made the bill impossible to ignore. Why hyperscale recycling, leak detection, and PFAS retrofit are the fast path to a 10x water system, and why institutional fragmentation (not engineering) is the real bottleneck."
```

### 3. `tags` are wrong / scaffold defaults (HIGH PRIORITY)

```yaml
tags: ["technology", "programming"]
```

Neither tag describes this article. "Programming" is actively misleading — this is a public-policy / infrastructure position paper with no code in it. These are the `new-article.js` defaults that were never updated.

The companion grid piece uses `["ai-infrastructure", "energy-policy", "data-centers", "power-grid", "tech-strategy", "sustainability"]`. For consistency (these two papers should cluster on tag pages) and accuracy, I recommend:

```yaml
tags: ["ai-infrastructure", "water-policy", "data-centers", "infrastructure", "tech-strategy", "sustainability"]
```

Rationale:
- `ai-infrastructure`, `data-centers`, `tech-strategy`, `sustainability` — keep parity with the grid piece so the two cluster together.
- `water-policy` — direct analog of `energy-policy` on the grid piece; this is the article's primary subject.
- `infrastructure` — broader umbrella that ties into the in-progress third piece referenced in the Notes section.
- Drop `power-grid` (wrong subject) and drop the generic `technology` / `programming` defaults.

If the site already has an established controlled vocabulary you'd rather hew to, swap `water-policy` for whatever the canonical tag is — but do not ship `["technology", "programming"]`.

### 4. `title` vs `ogTitle` inconsistency (MEDIUM)

```yaml
title:   "The U.S. Water System was Already Broken. AI just made it visible."
ogTitle: "The U.S. Water System was Already Broken"
```

The `ogTitle` drops the second sentence ("AI just made it visible."), which is the load-bearing half of the headline and the part that ties it to the grid piece. The grid article keeps the full headline in both fields. Recommend matching that:

```yaml
ogTitle: "The U.S. Water System was Already Broken. AI just made it visible."
```

Length is ~70 chars — well within the ~60–70 char range that renders cleanly on most social cards.

### 5. Title capitalization consistency (LOW / editorial)

Current: `"The U.S. Water System was Already Broken. AI just made it visible."`

Mixed case here is intentional and matches the grid piece (`"The Power Grid was already broken. AI just made it visible."`), so I'd leave it. Minor nit: the grid piece uses lowercase `"was already broken"` while this one uses `"was Already Broken"`. If you want strict parallelism with the companion piece, change to:

```yaml
title: "The U.S. Water System was already broken. AI just made it visible."
```

Not a blocker either way — just flagging so the choice is intentional.

### 6. Optional: consider adding `lastModified` (OPTIONAL)

The schema supports `lastModified` (yyyy-mm-dd). It falls back to `date` if omitted, so it's not needed at first publish. Worth knowing it exists for future revisions to this position paper, since you've indicated a third piece will tie back to both companions.

## Things that are good as-is

- `featuredImage` / `ogImage` both point at `/images/the-us-water-system.webp`, which exists in `public/images/`. Confirmed on disk.
- `canonicalUrl` is structurally correct and matches the URL `getAllPosts()` will generate from `date` + `slug`. (Unlike the grid piece, the slug here is not misspelled — the grid piece has `visibile` in its canonical URL, which is a pre-existing bug in that file but is **not** something to copy here.)
- `draft: false` — correct for an intended publish.
- Filename, `date`, and `slug` all agree.

## Proposed final frontmatter

```yaml
---
title: "The U.S. Water System was already broken. AI just made it visible."
date: "2026-05-18"
slug: "the-u-s-water-system-was-already-broken"
excerpt: "AI didn't break the U.S. water system — it just exposed a century of underinvestment that was already failing. Pipes from the 1800s, PFAS in a quarter of the supply, six billion gallons a day lost to leaks, and a workforce a decade from retirement. The fast path to a 10x water system isn't new dams; it's hyperscale recycling on the Orange County model, AI-powered leak detection, and PFAS retrofit at the plant scale."
tags: ["ai-infrastructure", "water-policy", "data-centers", "infrastructure", "tech-strategy", "sustainability"]
featuredImage: "/images/the-us-water-system.webp"
ogTitle: "The U.S. Water System was already broken. AI just made it visible."
ogDescription: "The U.S. water system was aging out before AI showed up — data centers just made the bill impossible to ignore. Why hyperscale recycling, leak detection, and PFAS retrofit are the fast path to a 10x water system, and why institutional fragmentation (not engineering) is the real bottleneck."
ogImage: "/images/the-us-water-system.webp"
canonicalUrl: "https://techtavern.com/articles/2026/05/18/the-u-s-water-system-was-already-broken/"
draft: false
---
```

## Summary of priorities

| Priority | Issue | Action |
| --- | --- | --- |
| Blocker (quality) | `excerpt` is scaffold default | Replace with real excerpt |
| Blocker (quality) | `ogDescription` is scaffold default | Replace with real social description |
| High | `tags` are wrong | Replace with subject-accurate, grid-piece-aligned tags |
| Medium | `ogTitle` drops the second sentence | Match full `title` |
| Low | Title capitalization vs grid piece | Optional: lowercase "already broken" for parallelism |
| None | Schema validation | Already passes — safe to build |

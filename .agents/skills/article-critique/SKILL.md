---
name: article-critique
description: Run a blind, skeptical peer review of a technical or informational article in `content/articles/`. Spawns an isolated subagent that reads only the article text — no conversation history, no project context, no prior framing — and returns a structured critique identifying gaps, weak arguments, unsupported claims, missing counterarguments, knowledge gaps for the stated audience, and broken or misrepresented links. Trigger when the user asks to "critique", "review", "validate", "stress test", "pressure test", "poke holes in", "find weaknesses in", or "blind review" an article. Also trigger on phrases like "what would a skeptical reader say", "where will people push back", "is this argument tight", "find the gaps", or whenever the user is preparing to publish and wants an adversarial second read on a piece in `content/articles/`. Distinct from `tech-tavern-editor` (which improves voice) and `article-frontmatter` (which fixes metadata) — this skill challenges the argument itself.
---

# Article Critique — Blind Peer Review

You orchestrate a blind, adversarial critique of a Tech Tavern article. The actual reading and critique is done by a **subagent that you spawn** with the article content and a sharply scoped reviewer prompt — and *nothing else*. The subagent never sees the conversation history, never inherits framing from CLAUDE.md, never knows who wrote the piece or why. It encounters the article cold, the way a stranger with relevant expertise would.

Your job is orchestration: locate the article, prepare a clean blind handoff, run the subagent, then relay the report to the user.

## Why blind matters

When the main Claude session critiques an article it just helped write or edit, two failure modes appear:

1. **Charity bias** — it remembers the author's intent and silently fills in context the reader doesn't have. The critique becomes "this is good, the author meant…" instead of "the page doesn't say…".
2. **Agreement drift** — it has been collaborating with the author for thousands of tokens. Switching to adversarial mode without resetting context produces hedged, polite critique that buries the real issues.

A fresh subagent has neither problem. It only knows what's on the page. If a claim isn't supported in the text, it has no way to "remember" the support from earlier in the conversation. That's the entire point — and it's worth protecting carefully in how you hand off.

## Phase 1 — Locate and read the article yourself

Identify the target article. If the user named a file, use it. If they said "my latest" or "the X article", list `content/articles/` and confirm with them before proceeding. Cheaper to confirm than to critique the wrong piece.

Read the full MDX file (frontmatter and body). You need to:

- Verify you have the right article.
- Note the declared `tags` and any audience signal that appears *in the prose itself* (the article may address "engineering leaders", "nonprofit boards", "AI practitioners", etc.). This informs your sanity check at the end — but only audience cues the article itself surfaces get passed to the reviewer.
- Strip nothing. The subagent receives the article body exactly as written, including frontmatter, headings, code blocks, blockquotes, and links.

## Phase 2 — Spawn the blind reviewer subagent

Use the Agent tool with `subagent_type: general-purpose`. Build the prompt from `references/reviewer-prompt.md` — that file is the full briefing for the subagent, including persona, rubric, anti-sycophancy guardrails, and the exact output template.

Paste the **complete article content** into the prompt where indicated in the template. Do not summarize, paraphrase, or trim it — the reviewer needs the actual prose to quote from.

### Critical handoff rules

These are what make the review actually blind. Treat them as non-negotiable.

- **No publication context.** Do NOT tell the subagent "this is for Tech Tavern", "this is by Scott", or anything about the site, the author, or the brand. The reviewer infers everything it can from the article and stops there.
- **No framing.** Do NOT say "this article argues that…" or "the author is making the case for…" in the prompt. That primes agreement before the reviewer reads a word. The article speaks for itself.
- **No conversation context.** The subagent prompt MUST explicitly instruct it to ignore CLAUDE.md, sibling articles, project documentation, and any prior reasoning. It treats the article body as its sole source of information about the topic.
- **No self-flattery loopholes.** Do NOT ask the reviewer to "find anything that could be improved" — that's the polite version. Ask it to find what an informed reader will *push back on*. The prompt template already does this; just don't dilute it.
- **Grant link-checking ability.** The subagent needs WebFetch so it can verify every external link.

### What the subagent does

1. Reads the article once, end to end, as a first-time reader would.
2. Re-reads with the rubric in hand, marking issues by category.
3. Verifies every external link — fetches the URL, confirms the destination exists and matches how the article describes it.
4. Returns the structured critique in the exact format from `references/reviewer-prompt.md`.

## Phase 3 — Relay the critique, don't soften it

Show the subagent's report to the user **verbatim**. Resist the urge to hedge, qualify, or reframe the harshest parts — softening the report defeats the purpose of having spawned a blind reviewer in the first place.

After the report, you may add at most one short note as the orchestrator. Reserve it for cases where you have private context that genuinely resolves a flag — for example, the reviewer says "no source for claim X" but you remember the user already linked a source in a passage the reviewer misquoted. Label it clearly:

> **Orchestrator note:** [the resolving context]

Otherwise, let the report stand. Then ask the user how they want to handle the issues. Do NOT auto-edit the article — the user decides which critiques to act on, and which to push back against. Some pushback risks are intentional editorial choices, not flaws.

## Output format

The subagent produces (and you relay) this exact structure:

```
## Critique — <article filename>

### Verdict
[1–3 sentences. Strongest concern, and whether a skeptical peer would recommend
publish-as-is, hold for revision, or rethink. Don't mince words.]

### Gaps
[Claims, premises, or definitions the article assumes but never establishes.
Quote the relevant phrase. Say what's missing and why it matters.]

### Weak arguments
[Specific reasoning that doesn't hold up — non-sequiturs, hidden premises,
appeals to authority, false dichotomies, conflated concepts, leaps from
correlation to causation. Quote and explain.]

### Pushback risks
[Where an informed reader will counter. The objection the article dodges.
The trade-off it doesn't name. The counterexample it doesn't address.
Phrase each as the objection itself, not as polite advice.]

### Unsupported empirical claims
[Statistics, "most teams", "studies show", performance numbers, market
sizing, adoption rates, historical anecdotes presented as fact — anything
quantitative or sweeping that lacks a citation. Quote each.]

### Audience knowledge gaps
[Jargon used without definition, prerequisite context the stated audience
may not have, leaps that assume insider familiarity. Anchor to who the
article itself appears to be written for.]

### Link audit
[Every external link in the article. For each one:
- URL
- Anchor text or surrounding context
- Verified status:
    ✓ verified — destination exists and matches the article's description
    ⚠ mismatch — destination exists but content does not match how the article describes it
    ✗ broken — dead link, suspicious redirect, paywall the article doesn't acknowledge]

### What the article does well
[Brief — 2–4 bullets. Not a participation trophy. This is signal about
what to preserve when revising, so a frustrated author doesn't tear out
the parts that were working.]
```

## When the subagent comes back light

If the report is short, vague, or sycophantic ("a few minor nits"), the handoff probably leaked framing. Common causes: you said "good article" anywhere in the prompt, you summarized the thesis before the article text, or you forgot the explicit instruction to ignore project context. Don't paper over a weak review — note it to the user and offer to re-run with a tightened prompt.

## Why this workflow

This skill exists because the moment most likely to need adversarial critique is the moment when the main session is *least* capable of providing it — right after helping draft or polish the piece. Pulling the critique into a fresh subagent isolates the work from accumulated charity. The phased structure (locate → blind handoff → relay verbatim) is what makes that isolation real instead of nominal.

## Reference files

- `references/reviewer-prompt.md` — The exact prompt template for the blind subagent, including persona, rubric per category, anti-sycophancy guardrails, and output format. Read this before spawning the subagent.

# Tech Tavern editorial style: excerpt vs ogDescription

Read this when generating or rewriting either field. Both summarize the same article but they're not interchangeable — they serve different readers in different contexts, and the corpus has accumulated examples of each.

## Why two fields at all

`excerpt` is shown on article listing cards (`ArticlesPageSections.tsx`), on the article page itself, and in the RSS feed. Humans read it while browsing. They're already on the site, already interested — the job is to make the click feel worth it.

`ogDescription` is shown in Google search results and on social shares (Twitter/X cards, LinkedIn previews, etc.). It's read by people who haven't seen the site yet, and by ranking algorithms. The job is to surface the keywords someone would search for and to compress the value prop into the SERP's truncation window.

Treating them as duplicates wastes both. A well-written excerpt with a stylized hook may bury the keywords Google needs; a keyword-tuned ogDescription often reads flat on a card. Write each for its actual audience.

## Voice baseline

Tech Tavern's voice across the corpus is:

- **Opinion-forward.** Scott takes positions. "AI didn't break X — it just made Y visible" is a recurring frame. "X isn't a prediction anymore." "The real sign of success isn't a flashy demo — it's momentum."
- **Concrete over abstract.** Name specific companies, technologies, dollar figures, dates. "Coinbase, Stripe, Cloudflare, and OpenAI have all shipped agent infrastructure in the last ninety days" beats "Major companies are entering the agent space."
- **Declarative, not hedged.** Avoid weasel words. "AI memory transforms tools into relationship-aware systems" beats "AI memory might transform tools..."
- **Audience-aware.** Many articles target nonprofit leaders, engineering leaders, or IT decision-makers. Name them when relevant: "what mission-driven organizations should do about it", "what engineering leaders should actually worry about".
- **Em dashes welcome.** Scott uses them. They signal voice. Don't strip them.

Avoid:
- "Dive into…", "Unlock…", "Explore the world of…", "In today's fast-paced…" — generic AI-blog filler.
- Stacked adjectives ("revolutionary, transformative, groundbreaking AI breakthrough").
- Vague abstraction ("This article discusses several important considerations around AI.").

## `excerpt` — the editorial hook

**Audience:** Someone already on Tech Tavern, scanning the article list or RSS reader.

**Job:** Surface the thesis or a vivid tension so the reader wants to keep reading.

**Length:** ~140–200 characters. Card layouts can wrap longer but the front of the line does the work. Two short sentences > one long one.

**Style moves that work in this corpus:**
- Open with a contrarian claim. "AI didn't break the grid — it just turned the lights on a crisis already in progress."
- Open with a tension. "AI enhances intelligence. It doesn't reduce human responsibility, it increases it."
- Open with a concrete-and-recent proof point. "Coinbase, Stripe, Cloudflare, and OpenAI have all shipped agent infrastructure in the last ninety days."
- Pose a sharp question. "Is your nonprofit unknowingly using consumer AI?"

**Style moves to avoid:**
- Generic openers: "This article explores…", "In this piece, we discuss…", "Learn about…"
- Restating the title. If the title is "The Future of AI Memory," an excerpt that says "Read about the future of AI memory" is dead weight.

**Worked examples from the corpus** (you can pattern-match on these):

> "AI didn't break the U.S. power grid — it just turned the lights on a fifty-year capacity crisis already in progress. The fix isn't orbital data centers or breakthroughs we're waiting on. It's reconductoring the lines we already have, siting SMRs at retired coal plants, and treating interconnection as the binding constraint it actually is."

> "The internet of agents isn't a prediction anymore. Coinbase, Stripe, Cloudflare, and OpenAI have all shipped agent infrastructure in the last ninety days. Here's what mission-driven organizations should do about it."

> "AI enhances intelligence. It doesn't reduce human responsibility, it increases it. The organizations that flourish won't wait for AI to take over. They'll redesign work so humans exercise authority through it."

## `ogDescription` — the SEO / share summary

**Audience:** Google's SERP algorithm and the human skimming search results. Also Twitter/LinkedIn preview readers.

**Job:** Tell the search engine what the article is about with the right keywords, and give the human a concrete reason to click.

**Length:** ~150–160 characters is Google's sweet spot. Beyond ~160 you'll get truncated mid-sentence. Twitter and OG tolerate up to ~200 but don't waste the budget — the first 120 chars do the heavy lifting.

**Style moves:**
- Front-load the topic and the keywords. If the article is about Spec Kit and AI software development, the words "Spec Kit," "AI," and "software development" should appear in the first half of the string.
- Use declarative sentences. "X reveals Y." "A guide to Z." "How A enables B."
- Name specific technologies, frameworks, or domains by their searchable name (`SMRs`, `MCP`, `interconnection reform`, `agent infrastructure`).
- It's OK — even good — for this to read slightly drier than the excerpt. SERPs reward clarity, not voice.

**Style moves to avoid:**
- Stylized punctuation: avoid `!`, `?`, em dashes — Google sometimes rewrites these.
- Pure curiosity gaps. "You won't believe what happens next" works on social, ranks poorly on Google.
- Identical to excerpt. If you wrote it once for humans, write a different version for search.

**Worked examples from the corpus:**

> "U.S. grid capacity has lagged for decades; AI data centers exposed it. Reconductoring, SMRs, and interconnection reform are the fast path forward."   (`the-power-grid-was-already-broken`)

> "GitHub's Spec Kit reveals how AI is merging programming, architecture, and project management into one unified discipline with profound implications."   (`spec-kit-in-practice`)

> "AI agents can now search the web, execute code, and spend money. The internet of agents is here, and mission-driven organizations need a plan for showing up without being exposed."   (`the-internet-of-agents-is-here`)

> "Practical AI workflows nonprofit leaders can use today, from organizing 'seed documents' to accelerating communications, analytics, and policy review, with clear guardrails for privacy and responsible adoption."   (`ai-workflows-that-actually-work`)

## Pair examples — excerpt + ogDescription for the same article

These are pairs from the existing corpus where the two strings are genuinely distinct. Use them as templates for proposing new pairs.

**Article: `the-internet-of-agents-is-here`**
```
excerpt: The internet of agents isn't a prediction anymore. Coinbase, Stripe,
  Cloudflare, and OpenAI have all shipped agent infrastructure in the last
  ninety days. Here's what mission-driven organizations should do about it.

ogDescription: AI agents can now search the web, execute code, and spend money.
  The internet of agents is here, and mission-driven organizations need a plan
  for showing up without being exposed.
```
Notice the divergence: the excerpt names the companies (concrete proof, hooks the reader), the ogDescription names the capabilities (search, execute code, spend money — the keywords someone might search for).

**Article: `the-power-grid-was-already-broken`**
```
excerpt: AI didn't break the U.S. power grid — it just turned the lights on
  a fifty-year capacity crisis already in progress. The fix isn't orbital data
  centers or breakthroughs we're waiting on. It's reconductoring the lines we
  already have, siting SMRs at retired coal plants, and treating interconnection
  as the binding constraint it actually is.

ogDescription: U.S. grid capacity has lagged for decades; AI data centers exposed
  it. Reconductoring, SMRs, and interconnection reform are the fast path forward.
```
The excerpt is editorial — em dashes, voice, a thesis. The ogDescription is tight, keyword-dense ("U.S. grid", "AI data centers", "SMRs", "interconnection reform" — all things people would search).

## Decision checklist

Before finalizing the pair, run through:

- [ ] Did I read the article body, not just the title?
- [ ] Does the excerpt have a hook (claim, tension, proof point, or question)?
- [ ] Does the ogDescription front-load the searchable keywords?
- [ ] Are they materially different in wording? (If you have to look twice to tell which is which, rewrite the ogDescription.)
- [ ] Is the excerpt 140–200 chars? Is the ogDescription 150–160?
- [ ] Did I avoid the generic AI-blog openers ("Dive into", "Explore", "Unlock")?
- [ ] Does the voice match the rest of the corpus — opinion-forward, declarative, concrete?

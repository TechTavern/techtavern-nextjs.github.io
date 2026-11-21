# Tech Tavern site wiki

A historical record kept by agents (chief-of-staff sessions). Every claim is dated or tied to a commit; pages never describe the code "as it is now". Domain terms: [GLOSSARY.md](../../GLOSSARY.md). Settled decisions: [docs/adr/](../adr/).

## Decisions
- [wiki-location](wiki-location.md) — why this wiki lives in `docs/wiki/` (2026-11-21)

## Subsystems
- [site-addresses](site-addresses.md) — basePath/trailing-slash handling and the site-address module
- [article-social-preview](article-social-preview.md) — one fallback chain for Social Preview and Canonical URL
- [article-index](article-index.md) — the Article Index module and its page addresses

## Recurring problems
- [basepath-pitfalls](basepath-pitfalls.md) — where NEXT_PUBLIC_BASE_PATH is and isn't applied automatically
- [worktree-node-modules](worktree-node-modules.md) — Turbopack builds fail in agent worktrees with symlinked node_modules

## Work log
- [2026-11-21-architecture-review](2026-11-21-architecture-review.md) — review candidates, what shipped, what was deferred

## User preferences
- [user-preferences](user-preferences.md) — how the user likes to work with agents

# AGENTS.md

Single source of guidance for AI coding agents (Claude Code, Codex, etc.) working in this repository. `CLAUDE.md` only points here — edit this file, not that one.

## Agent Skills & Subagents

Project skills and subagents live under `.agents/` so any agent tool can use them:

- `.agents/skills/<name>/SKILL.md` — project skills (read natively by Codex and other tools that support `.agents/skills`).
- `.agents/agents/*.md` — subagent definitions (Claude Code format).
- `.claude/skills` and `.claude/agents` are symlinks to the directories above. Add or edit files in `.agents/`, never through `.claude/`.
- Inside skills, reference files by their `.agents/...` path, not `.claude/...`.
- `.claude/settings.json` is shared and committed; `.claude/settings.local.json` is personal and gitignored.

## Project Overview

A Next.js static blog for Tech Tavern, LLC, deployed to GitHub Pages.

- **Static export**: `output: "export"`; `npm run build` writes to `out/`. No server runtime — no API routes, middleware, or request-time rendering.
- **Content**: MDX articles parsed with gray-matter, validated with Zod at build time, compiled from the filesystem at dev/build time (no import map to maintain).
- **MDX plugins**: remark-gfm, rehype-slug, rehype-autolink-headings (see `src/lib/mdx-options.ts`).
- **Styling**: Tailwind CSS v4 via PostCSS.
- **URLs**: date-based, `/articles/YYYY/MM/DD/slug/`.

## Project Structure

- `src/app/` — App Router pages, layouts, metadata, `sitemap.ts`, `robots.ts`, `rss.xml`, global CSS. Routes and folders are lowercase, semantic paths.
  - `src/app/articles/[year]/[month]/[day]/[slug]/page.tsx` — article pages.
- `src/components/` — reusable UI and section components (PascalCase files). One-off section/page copy lives with its component or page file.
- `src/lib/` — truly global utilities and config only:
  - `posts.ts` — post metadata, URL generation, frontmatter Zod schema, reading time (~200 wpm).
  - `profiles.ts` — author profiles from `content/profiles/`.
  - `env.ts` — environment variable validation (Zod).
  - `site.ts` / `site.server.ts` — `getBaseUrl()` and site helpers.
  - `csp.ts` — Content Security Policy builder.
  - `seo.ts`, `pagination.ts`, `format.ts`, `prose.ts`, `mdx-options.ts`.
- `src/mdx-components.tsx` — global MDX component styling.
- `content/articles/*.mdx` — articles, named `YYYY-MM-DD-slug.mdx`.
- `content/profiles/*.mdx` — author profiles.
- `public/` — static assets, fonts, images.
- `scripts/` — `new-article.js` (interactive article scaffold), `verify-test-data.js`, `validate-outputs.js`.
- `tests/` — Playwright E2E/accessibility specs (see `tests/README.md`).
- `.github/workflows/` — `deploy.yml` (quality gates, build, Pages deploy), `playwright-regression.yml` (scheduled/manual smoke and accessibility runs).

## Commands

```bash
# Development
npm run dev:webpack   # Preferred dev server (webpack applies the zod client-bundle block in next.config.mjs; Playwright uses this too)
npm run dev           # Turbopack dev server
npm run dev:watch     # Dev server + MDX change notifications

# Build
npm run build         # Static export to out/
npm start             # Production server (rarely needed)
npm run analyze       # Bundle analysis build

# Quality
npm run lint          # ESLint (Next core-web-vitals + TypeScript)
npm run typecheck     # tsc --noEmit
npm run test          # Jest unit/integration tests
npm run test:watch
npm run test:coverage
npm run test:ci       # typecheck + lint + coverage

# Playwright
npm run test:playwright   # All Playwright tests (starts dev server automatically)
npm run test:a11y         # Accessibility tests (axe-core, WCAG)
npm run test:smoke        # Primary user-journey smoke tests (also run on schedule by playwright-regression.yml)
npm run verify-test-data  # Confirm enough articles exist for pagination tests

# Content
npm run new-article   # Interactive script to create a new MDX article
```

Always run `npm run typecheck && npm run lint && npm run test` before opening a PR.

## Article Frontmatter

Required:
- `title: string`
- `date: string` (`yyyy-mm-dd`)
- `slug: string`

Optional: `excerpt`, `tags` (array), `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `draft` (boolean).

Frontmatter is validated by the Zod schema in `src/lib/posts.ts`; invalid frontmatter fails the build.

## Coding Standards

### TypeScript
- Strict mode, plus `noImplicitReturns` and `noFallthroughCasesInSwitch`. Path alias `@/*` → `src/*`.
- **Never use `any`.** Use `unknown` for truly unknown data, specific interfaces, or unions.
- Validate external data (frontmatter, env vars) at runtime with Zod or type guards.
- Prefix intentionally unused parameters with `_` (e.g. `_event`).
- Prefer utility types (`Omit`, `Pick`, `Partial`) over duplicated type definitions.

### Naming
- Components: PascalCase. Utilities/data files: kebab-case or lowerCamelCase.

### Next.js & React
- Prefer Server Components; mark client components explicitly with `'use client'` and keep them small.
- Use the Metadata API, structured data, and semantic HTML for SEO.
- Images are unoptimized (static export); still use `next/image` with explicit sizing.
- Use dynamic imports for heavy client-only code.
- Small, single-purpose components with clear prop interfaces; extract shared logic into hooks/utilities (DRY).
- Accessibility from the start: semantic HTML, ARIA where needed, keyboard navigation. Pages must pass the axe-core WCAG checks in `tests/`.

### Security
- CSP is built in `src/lib/csp.ts` and applied in `src/app/layout.tsx` — avoid inline scripts and remote assets; update the CSP deliberately if you must add a source.
- Zod is hard-blocked from client bundles (webpack alias in `next.config.mjs`); keep validation server-side.
- Avoid `dangerouslySetInnerHTML` unless unavoidable and the content is trusted.
- `NEXT_PUBLIC_` env vars are exposed to the client — never put secrets in them.
- Evaluate new dependencies carefully; run `npm audit` on upgrades.

## Testing

### Jest (unit/integration)
- Jest + React Testing Library, jsdom environment; setup in `jest.setup.js` (`@testing-library/jest-dom`). Shared helpers in `src/tests/test-utils.tsx`.
- Tests are co-located as `*.test.ts(x)` next to the unit under test.
- Coverage collects from `src/**/*.{ts,tsx}` excluding type definitions. Focus on critical paths: routing, MDX rendering, `src/lib` utilities.

### Playwright (E2E/accessibility)
- Config: `playwright.config.js` (auto-starts `npm run dev:webpack`).
- Requires at least 13 articles for pagination tests (12 per page → 2 pages; `paginationSettings` in `src/lib/site.ts`).
- Runs in the GitHub Actions `quality-gates` job; HTML reports are uploaded as artifacts (`npx playwright show-report` locally).
- See `tests/README.md` for test-data requirements.

## Environment

Validated in `src/lib/env.ts`:
- `SITE_URL` — optional; must be a valid URL. Used for absolute links in sitemap, RSS, OpenGraph. Defaults to `http://localhost:3000` in development.
- `NEXT_PUBLIC_BASE_PATH` — optional; defaults to empty. CI sets it for staging vs production.
- `NEXT_PUBLIC_GA_ID` — optional; enables Google Analytics when present.

Use `getBaseUrl()` from `src/lib/site.ts` to build absolute URLs (trailing slashes normalized). Local overrides go in `.env.local`.

## CI & Deployment

- CI (Node 24) runs lint, typecheck, tests, and build on pushes/PRs.
- Merging to `main` deploys via GitHub Pages; the workflow sets `NEXT_PUBLIC_BASE_PATH` automatically.

## Commits & Pull Requests

- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`). Keep messages clear and scoped.
- PRs: concise description, linked issues, screenshots for UI changes, notes on dev/build impact.

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.

Update cadence (code only):
- The graph tracks **code only** (`src/**`, `scripts/**`, config `.ts`/`.js`). Never rebuild it for content changes — `content/articles/*.mdx`, docs, or images do not trigger an update.
- A git post-commit hook rebuilds the graph automatically in the background after every commit that touches code files (AST-only, no LLM cost). Committing is the primary update mechanism — do not run a manual update after committing.
- In-session, run `graphify update .` manually only when both are true: (a) you changed code files that are still uncommitted, and (b) you are about to query the graph about that changed code. Do not run it after every edit.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tech Tavern

Static site for Tech Tavern, LLC built with Next.js (App Router) and MDX, deployed to GitHub Pages as a static export.

## Prerequisites

- Node.js 20.x (recommended) or >= 18.17
- npm 9+

## Quick Start

Choose the command set that matches your environment.

- macOS/Linux/Windows:
  ```bash
  npm install
  npm run dev
  ```
- Windows with WSL: use the `win-npm` wrapper so the dev server runs on the Windows host for reliable file watching. See Windows + WSL section below, then:
  ```bash
  win-npm install
  win-npm run dev
  ```

Build a static export (outputs to `out/`):

```bash
npm run build   # or: win-npm run build (WSL)
```

## Project Structure

- `src/app/`: App Router pages, layouts, metadata, global CSS
- `src/components/`: Reusable UI and section components
- `src/lib/`: Utilities (e.g., `env.ts`, `posts.ts`, `site(.server).ts`)
- `content/articles/`: MDX posts (`YYYY-MM-DD-slug.mdx`)
- `public/`: Static assets, fonts, images
- `.github/workflows/`: CI for lint/typecheck/build/deploy

## Project Scripts

- `dev`: Next.js dev server (uses Turbopack)
- `dev:webpack`: Next.js dev server with webpack (fallback option)
- `build`: Next.js static export build → `out/` (uses Turbopack)
- `start`: Next.js start (rarely needed; static export is default)
- `lint`: ESLint (Next + TS rules)
- `typecheck`: TypeScript `--noEmit`
- `new-article`: Scaffold a new MDX article
- `article-enrichment`: Enrich MDX frontmatter excerpts/tags via OpenAI
- `dev:watch`: Dev server + MDX change notifications (optional)

## Dev & Build

### Development Server

**Recommended:**
```bash
npm run dev           # or: win-npm run dev (WSL)
```

**Fallback (if issues occur):**
```bash
npm run dev:webpack   # or: win-npm run dev:webpack (WSL)
```

### Production Build

```bash
npm run build         # or: win-npm run build (WSL)
```

### Turbopack + MDX Plugins

**Status:** ✅ Resolved in Next.js 16 with string-based plugin configuration

**Solution:**
The project now uses string-based plugin names in `next.config.mjs`, which are serializable and work with Turbopack:

```javascript
remarkPlugins: ['remark-gfm'],
rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', { behavior: 'wrap' }]]
```

This is the **official recommended method** in Next.js 16 documentation. Plugin options (like `{ behavior: "wrap" }`) are still supported via array syntax.

**Historical Context:**
Previously, Turbopack had serialization issues when MDX plugins were imported as JavaScript functions. The string-based approach resolves this while maintaining full plugin functionality. If any issues occur, the `dev:webpack` script remains available as a fallback.

## Content & Authoring

- Articles live in `content/articles/` as MDX. Filenames: `YYYY-MM-DD-slug.mdx` with frontmatter.
- Frontmatter (required): `title`, `date` (yyyy-mm-dd), `slug`
- Frontmatter (optional): `lastModified` (yyyy-mm-dd), `excerpt`, `tags`, `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `draft`
- Add a new post: `npm run new-article` (or `win-npm run new-article` on WSL)
- MDX is compiled during dev/build automatically; no import map to maintain.

Reading time is computed automatically (~200 wpm) and shown on index and article pages.

### MDX Links & Images

- Links: internal links use `next/link`; external links open in a new tab with `rel="nofollow noopener noreferrer external"`.
- Images:
  - Preferred: `<Image src="/path.jpg" width={1200} height={630} alt="..." />`
  - Markdown images `![Alt](/path.jpg)` also work (falls back to `<img>` when needed)

### Routes

- Articles index: `/articles/`
- Article URLs: `/articles/YYYY/MM/DD/slug/`

### AI Article Enrichment

The `scripts/enrich-article.js` CLI fills in missing `excerpt` and `tags` frontmatter for `.mdx` articles by calling OpenAI's Responses API. Existing excerpts and tags are left untouched so the script can be re-run safely.

**Setup**
- Provide an `OPENAI_API_KEY` via your shell or `.env.local`. Lines in `.env.local` follow `KEY=value` syntax; quoted values are unwrapped. Missing keys cause the script to exit before any files are touched.
- Optionally set `OPENAI_MODEL` (defaults to `gpt-5-mini`).

**Usage**
- `npm run article-enrichment` – processes every `.mdx` file in `content/articles/` (non-recursive).
- `npm run article-enrichment -- content/articles/2025-09-29-spec-kit-in-practice.mdx` – limit to a single file or directory.
- `node scripts/enrich-article.js <path>` – run the script directly if you prefer not to use npm scripts.
- Append `--dry-run` or set `DRY_RUN=1` to preview the work without API calls or file writes.

**Behavior & validation**
- Files that already have both `excerpt` and `tags` are skipped with a log line.
- When enrichment is needed, the script prompts OpenAI once per file and merges the generated excerpt/tags back into the existing frontmatter.
- Excerpts must be a single paragraph between 100–160 characters and should highlight the article's hook; invalid responses cause the run to fail for that file.
- Tags must be an array of 2–5 Title Case words (each word capitalized); hyphenated compounds are allowed when each segment is Title Case. Whitespace or casing issues trigger validation errors.
- A summary is printed at the end (`updated`, `skipped`, `errors`). Any errors set a non-zero exit code so CI/editor integrations can detect failures.

## Environment Configuration

The site generates absolute links (sitemap, RSS, OpenGraph) using `SITE_URL`. Variables are validated with Zod in `src/lib/env.ts`.

- SITE_URL: The public origin of the site (no trailing slash). Examples:
  - GitHub Pages default (staging in this repo): `https://<owner>.github.io/techtavern-nextjs.github.io`
  - Custom domain: `https://example.com`
- NEXT_PUBLIC_BASE_PATH: Set by CI for staging vs production; rarely needed locally.
- NEXT_PUBLIC_GA_ID: Optional Google Analytics measurement ID.
- NEXT_PUBLIC_HUBSPOT_PORTAL_ID: Optional HubSpot tracking portal ID (numeric only; do not include the trailing `.js`). Set this in repo **Variables** or **Secrets** so CI can bake it into the static export.
- CSP is centralized in `src/lib/csp.ts`; update the allowlists there if you introduce additional third-party scripts or APIs.

Validation and defaults:
- `SITE_URL` must be a valid URL if provided; missing locally defaults to `http://localhost:3000` for previewing sitemap/RSS.
- `NEXT_PUBLIC_BASE_PATH` defaults to empty and helpers normalize trailing slashes.

Quick example: computing absolute URLs

```ts
// src/anywhere.ts
import { getBaseUrl } from '@/lib/site.server';

// Preferred: let URL handle slashes
const absolute = new URL('/articles/2025/08/24/hello-world/', getBaseUrl()).toString();

// Or simple string concat (getBaseUrl() has no trailing slash)
const absolute2 = `${getBaseUrl()}/articles/2025/08/24/hello-world/`;
```

Where to set `SITE_URL`:
- Local development: optional `.env.local` (e.g., `SITE_URL=http://localhost:3000`).
- GitHub Actions: set automatically by the workflow; override via an Actions Variable or Secret named `SITE_URL`.

Sitemap: `/sitemap.xml` • RSS: `/rss.xml`.

## Deployment (GitHub Pages)

- CI builds on pushes/PRs; deployment runs on `main`.
- The workflow sets `NEXT_PUBLIC_BASE_PATH` for staging (subdirectory) vs production (root) and derives `SITE_URL` automatically. You can override `SITE_URL` via an Actions Variable/Secret.
- Static export artifacts are in `out/` and are uploaded to GitHub Pages by the workflow.

## Security & CSP

- CSP meta tag lives in `src/app/layout.tsx`.
- Dev builds add `unsafe-eval` to simplify tooling; production builds do not.
- Zod is hard‑blocked from client bundles (`next.config.ts` sets `resolve.alias.zod = false`).
- If you embed remote images, extend `img-src` to include `https:` or add specific domains.

Server-only helpers that read validated env live in `src/lib/site.server.ts` and should be imported from server components/routes.

## Testing

- Unit tests: Jest + React Testing Library (`npm run test`)
- Type safety: `npm run typecheck`
- Linting: `npm run lint`

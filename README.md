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

- `dev`: Next.js dev server
- `build`: Next.js static export build → `out/`
- `start`: Next.js start (rarely needed; static export is default)
- `lint`: ESLint (Next + TS rules)
- `typecheck`: TypeScript `--noEmit`
- `new-article`: Scaffold a new MDX article
- `article-enrichment`: Generate excerpts and tags for MDX files
- `dev:watch`: Dev server + MDX change notifications (optional)

## Dev & Build

- Dev: `npm run dev` (or `win-npm run dev` on WSL)
- Build: `npm run build` (or `win-npm run build` on WSL)

## Content & Authoring

- Articles live in `content/articles/` as MDX. Filenames: `YYYY-MM-DD-slug.mdx` with frontmatter.
- Frontmatter (required): `title`, `date` (yyyy-mm-dd), `slug`
- Frontmatter (optional): `excerpt`, `tags`, `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `draft`
- Add a new post: `npm run new-article` (or `win-npm run new-article` on WSL)
- MDX is compiled during dev/build automatically; no import map to maintain.

Reading time is computed automatically (~200 wpm) and shown on index and article pages.

### Article Enrichment (optional)

Generate excerpts and tags for existing articles using OpenAI:

```bash
npm run article-enrichment
```

Requirements:
- `OPENAI_API_KEY` in `.env.local`
- `.mdx` files in `content/articles/`

What it does:
- Scans MDX files, skips ones that already have good metadata
- Uses `gpt-5-mini` with medium reasoning by default to produce a 100–160 char excerpt and 2–5 tags
- Updates frontmatter in place and prints a summary

Model configuration (via `.env.local`):
- `OPENAI_MODEL` (default `gpt-5-mini`)
- `OPENAI_REASONING` (default `medium`; one of `low|medium|high`)
See `sample.env.local` for a template.

Tip: run a dry run (no API calls) to verify config:

```bash
npm run article-enrichment -- --dry-run
# On WSL: win-npm run article-enrichment -- --dry-run
```

### MDX Links & Images

- Links: internal links use `next/link`; external links open in a new tab with `rel="nofollow noopener noreferrer external"`.
- Images:
  - Preferred: `<Image src="/path.jpg" width={1200} height={630} alt="..." />`
  - Markdown images `![Alt](/path.jpg)` also work (falls back to `<img>` when needed)

### Routes

- Articles index: `/articles/`
- Article URLs: `/articles/YYYY/MM/DD/slug/`

## Windows + WSL setup

If you develop in WSL, run the dev server on Windows for reliable file watching using a simple wrapper:

```bash
# Create wrapper scripts directory
mkdir -p ~/bin

# Create the win-npm wrapper
cat > ~/bin/win-npm << 'EOF'
#!/bin/bash
WIN_PATH=$(wslpath -w "$(pwd)")
powershell.exe -Command "cd '$WIN_PATH'; npm $*"
EOF

# Make it executable
chmod +x ~/bin/win-npm

# Add to PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
```

Then use `win-npm` for package commands from WSL:

```bash
win-npm install
win-npm run dev
win-npm run build
```

## Environment Configuration

The site generates absolute links (sitemap, RSS, OpenGraph) using `SITE_URL`. Variables are validated with Zod in `src/lib/env.ts`.

- SITE_URL: The public origin of the site (no trailing slash). Examples:
  - GitHub Pages default (staging in this repo): `https://<owner>.github.io/techtavern-nextjs.github.io`
  - Custom domain: `https://example.com`
- NEXT_PUBLIC_BASE_PATH: Set by CI for staging vs production; rarely needed locally.
- NEXT_PUBLIC_GA_ID: Optional Google Analytics measurement ID.

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

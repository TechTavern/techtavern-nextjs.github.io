# Tech Tavern

This is a project for website of Tech Tavern, LLC.

## Prerequisites

- Node.js 20.x (recommended) or >= 18.17
- npm 9+

## Install & Run

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build a static export (outputs to `out/`):

```bash
npm run build
```

## Environment Configuration

The site generates absolute links in the sitemap and RSS using `SITE_URL`.

- SITE_URL: The public origin of the site (no trailing slash). Examples:
  - GitHub Pages user/org domain: `https://techtavern-nextjs.github.io`
  - Custom domain: `https://example.com`
- NEXT_PUBLIC_BASE_PATH: Already handled by CI for staging vs production; you usually don’t set this locally.

### Env Validation (Zod)

Environment variables are validated at runtime using Zod (see `src/lib/env.ts`).

- Validation: `SITE_URL` must be a valid URL if provided; `NEXT_PUBLIC_BASE_PATH` defaults to an empty string.
- Normalization: trailing slashes are removed when computing the base URL.
- Failure mode: an invalid `SITE_URL` value (e.g., `not-a-url`) will throw an error early during startup/build.
- Defaults: if `SITE_URL` is unset in local dev, the app falls back to `http://localhost:3000` for sitemap/RSS previews only.

Quick example: computing absolute URLs

```ts
// src/anywhere.ts
import { getBaseUrl } from '@/lib/site';

// Preferred: let URL handle slashes
const absolute = new URL('/articles/2025/08/24/hello-world/', getBaseUrl()).toString();

// Or simple string concat (getBaseUrl() has no trailing slash)
const absolute2 = `${getBaseUrl()}/articles/2025/08/24/hello-world/`;
```

Where to set `SITE_URL`:
- Local development: create `.env.local` at the repository root
  - Example: `SITE_URL=http://localhost:3000`
  - Optional; if unset, it defaults to `http://localhost:3000` for local-only sitemap/RSS preview.
- GitHub Actions (production/staging builds): now set automatically.
  - The workflow derives `SITE_URL` from your repository owner (defaults to `https://<owner>.github.io`).
  - You can override this by defining an Actions Variable or Secret named `SITE_URL` in your repo or org settings.

Sitemap is available at `/sitemap.xml` and RSS at `/rss.xml`.

## Project Scripts

- `dev`: Next.js dev server
- `build`: Next.js static export build → `out/`
- `start`: Next.js start (rarely needed; static export is default)
- `lint`: ESLint (Next + TS rules)
- `typecheck`: TypeScript `--noEmit`
- `new-article`: Interactive script to scaffold a new MDX article
- `dev:watch`: Run dev and print MDX file change notifications (optional)

## Dev & Build

- Dev: `npm run dev` (Next.js dev with MDX)
- Build: `npm run build` (Next.js static export build)

## Content & Authoring

- Articles live in `content/articles/` as MDX. Filenames: `YYYY-MM-DD-slug.mdx` with frontmatter.
- Frontmatter (required): `title`, `date` (yyyy-mm-dd), `slug`
- Frontmatter (optional): `excerpt`, `tags`, `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `draft`
- Add a new post with: `npm run new-article` (prompts for title, date, and optional excerpt/tags/featuredImage)
- MDX content is compiled during dev/build automatically; no manual import map needed.

Reading time is computed automatically (~200 wpm) and displayed on the index and article pages.

### MDX Links & Images

- Links: internal links render via `next/link`; external links open in a new tab with `rel="nofollow noopener noreferrer external"`.
- Images:
  - Preferred: `<Image src="/path.jpg" width={1200} height={630} alt="..." />` in MDX for best layout.
  - Markdown images `![Alt](/path.jpg)` work too (fall back to `<img>` if dimensions are unknown or URL is remote).

### Routes

- Articles index: `/articles/`
- Article URLs: `/articles/YYYY/MM/DD/slug/`

## Note on Windows Dev Setup

Because I seem to like the way of pain, I'm developing this on a Windows machine while using WSL.
Which causes problems with commanes like `npm run dev` and such.  So I've setup npm commands to
run through a win-npm wrapper instead.

The setup is as follows:

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

From there I just put the following my CLAUDE.md file

```markdown
# NextJS Windows Project

This project uses Windows npm through PowerShell. 

**Use `win-npm` instead of `npm` for all package management:**
- `win-npm install`
- `win-npm run dev` 
- `win-npm run build`

The development server runs on Windows for proper file watching.
```

Lastly, I add permissions explicitly to the claude local settings.

```json
{
    "permissions": {
      "allow": [
        "Bash(npm-win install)",
        "Bash(npm-win run build)",
        "Bash(npm-win run dev)",
        "Bash(npm-win run test)"
      ],
      "deny": [
        "Bash(npm install)",
        "Bash(npm run build)",
        "Bash(npm run dev)",
        "Bash(npm run test)"
      ],
      "ask": [],
      "defaultMode": "acceptEdits"
  }
}

## Deployment (GitHub Pages)

- CI builds on pushes/PRs; deployment runs on `main`.
- The workflow sets `NEXT_PUBLIC_BASE_PATH` for staging (subdirectory) vs production (root) and derives `SITE_URL` automatically. You can override `SITE_URL` via an Actions Variable/Secret.
- Static export artifacts are in `out/` and are uploaded to GitHub Pages by the workflow.

## Security & CSP

- A CSP meta tag is enabled in `src/app/layout.tsx`.
- If you embed remote images in MDX or use remote OG images, update the policy to include `img-src 'self' data: https:` or specify an allowlist of domains.
```

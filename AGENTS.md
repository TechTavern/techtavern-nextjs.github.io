# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: App Router pages, layouts, metadata, global CSS.
- `src/components/`: Reusable UI and section components (PascalCase files).
- `src/lib/`: Utilities (e.g., `posts.ts`).
- `src/data/`: Static data sources (e.g., `services.ts`).
- `content/articles/`: MDX posts. Filenames `YYYY-MM-DD-slug.mdx` with frontmatter `title`, `date` (yyyy-mm-dd), `slug`.
- `public/`: Static assets, fonts, and images.
- `.github/workflows/`: CI for lint/typecheck/build/deploy to GitHub Pages.

## Build, Test, and Development Commands
- Dev server: `npm run dev` (WSL users: `win-npm run dev`).
- WSL wrapper: On Windows with WSL, prefix any npm command with `win-npm` to run it from the Windows host. Examples: `win-npm install`, `win-npm run build`, `win-npm run test`, `win-npm run lint`, `win-npm run dev`.
- Build static export: `npm run build` → outputs to `out/`.
- Start prod server: `npm start` (rarely needed; export is default).
- Lint: `npm run lint` (Next.js + TypeScript rules).
- Type check: `npm run typecheck`.

CI builds on pushes/PRs; deployment runs on `main`. For staging vs production, the workflow sets `NEXT_PUBLIC_BASE_PATH` automatically.

## Coding Style & Naming Conventions
- TypeScript strict; use explicit types over `any`.
- Components: PascalCase. Utilities/data: kebab-case or lowerCamelCase files.
- Routes and folders under `src/app/`: lowercase, semantic paths.
- Formatting/linting: ESLint (extends Next core-web-vitals + TS). Tailwind v4 for styles.

## Testing Guidelines
- No test framework configured yet. When adding tests:
  - Prefer Jest + React Testing Library.
  - Name tests `*.test.ts(x)` next to the unit under test.
  - Aim for critical path coverage (routing, MDX rendering, lib utilities).
- Always run `npm run typecheck && npm run lint` before PRs.

## Content Workflow (MDX)
- Add posts to `content/articles/` with required frontmatter.
- MDX is compiled at dev/build time from the filesystem; no import map maintenance is required.
- URLs are date-based: `/articles/YYYY/MM/DD/slug/`.

## Commit & Pull Request Guidelines
- Commits: prefer Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). The history mixes styles; keep messages clear and scoped.
- PRs: include a concise description, linked issues, screenshots for UI changes, and notes on dev/build impact. Merging to `main` triggers a staging deploy via Pages.

## Security & Configuration Tips
- CSP meta tag is enabled in `src/app/layout.tsx`—avoid inline scripts and remote assets.
- For subdirectory hosting, set `NEXT_PUBLIC_BASE_PATH` (CI handles this). Local overrides go in `.env.local`.

## Environment
- Validation: `src/lib/env.ts` uses Zod to validate environment variables.
  - `SITE_URL`: optional; must be a valid URL if provided. Used for absolute links in sitemap/RSS and OpenGraph.
  - `NEXT_PUBLIC_BASE_PATH`: optional; defaults to empty. CI sets this for staging vs production.
- Base URL helper: use `getBaseUrl()` from `src/lib/site.ts` to construct absolute URLs safely (trailing slashes normalized).
- Local setup: create `.env.local` when needed (e.g., `SITE_URL=http://localhost:3000`).

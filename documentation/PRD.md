# Tech Tavern Website — Product Requirements Document (PRD)

- Document owner: Tech Tavern, LLC (Engineering + Product)
- Version: 1.0
- Status: Approved for build (static site, MDX blog)
- Last updated: 2025-09-01

## 1. Product Overview

- Purpose: Provide a fast, secure, and easily maintained marketing site for Tech Tavern, LLC, featuring a company landing page, services overview, leadership profile, and a blog (MDX-based) to publish articles with strong SEO.
- Primary Value:
  - Showcase capabilities in AI, data, cloud, and digital transformation.
  - Generate inbound leads via clear calls-to-action and contact info.
  - Publish thought leadership with SEO-friendly, date-based article URLs.
- Delivery Model: Static export via Next.js App Router, deployed to GitHub Pages. No runtime servers.

## 2. Goals and Non‑Goals

- Goals:
  - Clear, branded landing page with sections: Hero, Info, Mission, Services, Profile, Contact.
  - Blog with date-based routes `/articles/YYYY/MM/DD/slug/` and index page `/articles/`.
  - Excellent SEO: metadata, sitemap, RSS, canonical URLs, OG/Twitter cards.
  - Strong performance: fully static, local fonts, responsive imagery, and minimal JavaScript.
  - Robust CI quality gates (typecheck, lint, tests) and reproducible builds.
  - Low-maintenance content workflow using MDX files under version control.
- Non‑Goals (v1):
  - No CMS (e.g., headless CMS, admin UI) — content authored in Git.
  - No user accounts, comments, or e‑commerce.
  - No dynamic server features or databases.
  - No multi-language/i18n requirements.

## 3. Target Users and Personas

- Prospective Clients: Nonprofit, public sector, and mission-driven leaders seeking strategic tech/AI expertise.
- Partners/Peers: Technologists and advisors exploring collaboration or due diligence.
- Search Engines/Newsletters: Crawlers and aggregators indexing articles via sitemap and RSS.

## 4. Success Metrics (North Star and Health)

- Traffic Growth: Unique visitors to site and `/articles/` monthly.
- Content Engagement: Average article read time; click‑through to additional articles.
- Lead Signals: Clicks on Contact CTA and mailto link; scroll depth to Contact section.
- SEO Health: Index coverage, sitemap served, RSS served, OG/Twitter previews correct.
- Build Quality: 100% successful CI checks on `main` (typecheck/lint/tests).

## 5. User Journeys / Key Flows

- Home Discovery:
  - Land on `/`, scan Hero → Info → Mission → Services → Profile.
  - CTA clicks for Services and Contact; navigation anchors operate smoothly.
- Reading Content:
  - From `/` or `/articles/` to an article page; view hero image, metadata, tags, and MDX content.
  - Back to list or continue reading; CTA at footer to Contact.
- Content Syndication:
  - Consumers discover articles via `/sitemap.xml` and `/rss.xml`.

## 6. Information Architecture

- Top-Level Routes:
  - `/` Home
  - `/articles/` Articles index
  - `/articles/YYYY/MM/DD/slug/` Article detail (SSG via dynamic params)
  - `/sitemap.xml` Sitemap (static)
  - `/rss.xml` RSS feed (static)
  - `404` Not Found page
- Navigation:
  - Fixed navigation on homepage only, with smooth scrolling to `#Services`, `#About`, `#Contact`.
  - Simple header within Articles layout providing links back to Home and Articles.

## 7. Functional Requirements

### 7.1 Home Page
- Sections: Hero, Info, Mission, Services, Profile, Contact, Footer.
- Branding: Typography via local Poppins (headings) and Lato (body). Gradient brand backgrounds and glass effects present.
- Responsive imagery:
  - Hero uses responsive background images for multiple breakpoints.
  - Section imagery optimized and lazy loads where applicable.
- Accessibility:
  - All meaningful images have `alt` text.
  - Interactive elements have appropriate labels, contrast, and focus styles.
- Navigation:
  - Fixed header appears only on `/`. Desktop and mobile menus supported.
  - Anchor links scroll to sections smoothly.

### 7.2 Articles Index `/articles/`
- Displays a grid of article cards containing:
  - Featured image (fallback to default featured image if not provided).
  - Title, formatted date, optional reading time, and up to two tags.
  - Excerpt when present.
  - Link to full article.
- Empty state: Friendly placeholder content when no posts exist.
- CTA section encouraging contact.

### 7.3 Article Detail `/articles/YYYY/MM/DD/slug/`
- Static generation for all articles via frontmatter-derived params.
- Header:
  - Breadcrumb back to Articles, featured image, title, date, reading time, and tags.
  - Optional excerpt rendered as introductory paragraph.
- Content Rendering:
  - MDX content compiled with `remark-gfm`, `rehype-slug`, and `rehype-autolink-headings`.
  - Enhanced typographic styles (headings, paragraphs, code, blockquotes, lists, tables, hr).
  - Links:
    - Internal links use `next/link`.
    - External links open in new tab with `rel="nofollow noopener noreferrer external"`.
  - Images:
    - Prefer `next/image` for local images with known `width` and `height` via `MDXImage` component.
    - Fallback to native `<img>` for external or dimension-unknown images.
- Article Footer: CTA to Contact and to more Articles.

### 7.4 Content Model (MDX)
- Location: `content/articles/`
- Filename convention: `YYYY-MM-DD-slug.mdx`
- Required frontmatter:
  - `title: string`
  - `date: string` (yyyy-mm-dd)
  - `slug: string`
- Optional frontmatter:
  - `excerpt: string`
  - `tags: string[]`
  - `featuredImage: string` (path or absolute URL)
  - `ogTitle: string`
  - `ogDescription: string`
  - `ogImage: string` (path or absolute URL)
  - `canonicalUrl: string` (absolute URL)
  - `draft: boolean` (default false)
- Derived at build:
  - `readingTimeMinutes` ~ 200 wpm
  - `year`, `month`, `day` from `date`
  - `url` `/articles/YYYY/MM/DD/slug/`
  - `featuredImage` and `ogImage` auto-prefixed with base path when relative
- Validation: Zod schema validates required fields; build fails on invalid frontmatter.

### 7.5 SEO & Social
- Metadata for Home, Articles index, and Article pages:
  - `title`, `description`, `metadataBase` configured from environment.
  - OpenGraph and Twitter cards with large summary images when available.
  - Canonical URLs for article pages (frontmatter `canonicalUrl` overrides).
- Sitemap `/sitemap.xml` includes Home, Articles index, and all published articles.
- RSS `/rss.xml` contains all published articles with title, link, pubDate, and description.

### 7.6 Analytics (Optional)
- Google Analytics enabled only when `NEXT_PUBLIC_GA_ID` is present.
- Inject GA script lazily (`lazyOnload`) via `next/script` component.

### 7.7 Content Enrichment (Optional Dev Tooling)
- Script `npm run article-enrichment` uses OpenAI to generate missing excerpts and tags for articles.
- Requires `OPENAI_API_KEY` in `.env.local`.
- Skips articles that already have sufficient metadata.

## 8. Non‑Functional Requirements

### 8.1 Performance
- Static export (`next build` with `output: 'export'` in production) → deployable to GitHub Pages.
- Unoptimized Next.js images to ensure compatibility with static export.
- Local fonts with `font-display: swap`.
- Critical styling present; Tailwind v4 for styles.
- Avoid blocking resources and excessive JS; use server components by default; mark client components explicitly.

### 8.2 Reliability & Availability
- GitHub Pages hosting for high availability; no server state.
- CI validates type safety, linting, and unit tests before build and deploy steps.

### 8.3 Security & Privacy
- CSP meta tag applied in root layout; script and style policies defined.
- Avoid inline scripts except where policy explicitly allows (GA injected via Next Script; CSP accounts for it).
- Links to external resources limited; images generally served from local assets.
- Environment variables validated with Zod at startup/build.
- Dependencies audited via `npm audit` (CI) and optional Snyk if configured.

### 8.4 Accessibility (A11y)
- Provide alt text for images.
- Ensure color contrast meets WCAG AA for text on gradient backgrounds.
- Keyboard navigability for menus and links; focus states visible.
- Semantic headings within MDX content; autolinked headings maintain accessible text.

### 8.5 Observability
- Core analytics: page views via GA when configured.
- No server logging (static hosting). Client errors monitored manually or via future tooling.

## 9. Environment, Configuration, and Build

- Node: v20 (CI default).
- Required env (validated by `src/lib/env.ts` using Zod):
  - `SITE_URL` (optional): public origin of site; used to generate absolute URLs.
  - `NEXT_PUBLIC_BASE_PATH` (optional): base path for subdirectory hosting.
  - `NEXT_PUBLIC_GA_ID` (optional): enables Google Analytics.
- Base URL helper: `getBaseUrl()` concatenates `SITE_URL` and `NEXT_PUBLIC_BASE_PATH` (trailing slashes removed).
- Build modes:
  - Production (CI): sets `output: 'export'`, `trailingSlash: true`, and conditionally `basePath/assetPrefix`.
  - Dev: `next dev` with MDX support.
- Windows + WSL development wrapper:
  - Use `win-npm` prefix for all npm commands to ensure proper file watching when developing via WSL on Windows.

## 10. CI/CD and Deployment

- Workflow: `.github/workflows/deploy.yml`
  - Triggers: `push` to `main`, PRs to `main`, and manual `workflow_dispatch` with `environment` (staging/production).
  - Jobs:
    - `quality-gates`: checkout, Node 20, cache, `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` if jest available, `npm audit`, optional Snyk scan; decides if deploy should proceed.
    - `build`: installs deps, configures env for `SITE_URL` and `NEXT_PUBLIC_BASE_PATH`:
      - Custom domain (via Actions Var/Secret `SITE_URL`) → `BASE_PATH=''` and `SITE_URL=<custom>`.
      - Production default Pages domain → base path `''`, `SITE_URL=https://<owner>.github.io`.
      - Staging (repo subdir) → `BASE_PATH='/techtavern-nextjs.github.io'`, `SITE_URL=https://<owner>.github.io/techtavern-nextjs.github.io`.
      - Builds static site to `out/`, validates output, uploads artifacts, and prepares Pages.
    - `deploy`: uses `actions/deploy-pages@v4` to publish; performs a basic health check via `curl`.
    - `pr-comment`: posts build summary on PRs.
- Artifacts: `out/` uploaded for traceability.
- Source maps are removed for production for security.

## 11. Acceptance Criteria

- Home Page
  - Renders all sections; navigation anchors scroll smoothly; mobile menu toggles; typography matches design.
  - Lighthouse performance ≥ 90 on mobile for Home.
- Articles Index
  - Lists published, non-draft posts sorted by date desc; each shows date, title, optional excerpt, optional reading time, up to two tags, and featured image.
  - Cards link to correct article routes.
- Article Page
  - Route exists for every MDX file; metadata generated from frontmatter; OG/Twitter images render correctly.
  - MDX content renders headings, links, images, code blocks, tables, and blockquotes with enhanced styles.
  - External links open in a new tab with safe `rel` attributes.
- SEO
  - `/sitemap.xml` includes Home, Articles index, and all articles with correct absolute URLs.
  - `/rss.xml` validates and includes all articles; description escapes XML.
  - Canonical URLs correct per article; base path applied where needed.
- Analytics
  - When `NEXT_PUBLIC_GA_ID` is set, GA loads lazily and records pageviews; otherwise no GA requests made.
- Build & Deploy
  - CI quality gates pass for `main`; static export completes; Pages deploy succeeds; basic health check returns 200.

## 12. Constraints and Assumptions

- Hosting on GitHub Pages requires static export and optional subdirectory base path.
- `next/image` optimization is disabled (`unoptimized: true`) for static export compatibility.
- All content is authored as MDX with validated frontmatter; invalid content fails the build.
- CSP set via meta tag; inline styles are permitted; script policy allows GA domain.
- No backend or server APIs; any future dynamic features require alternative hosting.

## 13. Risks and Mitigations

- Base Path Errors: Incorrect `NEXT_PUBLIC_BASE_PATH` may break asset links. Mitigate via CI environment logic and `withBasePath` helper usage.
- Invalid Frontmatter: Build failures when schema invalid. Mitigate with pre-commit checks and authoring scripts.
- External Image Hosts: MDX may reference remote images; availability outside our control. Prefer local assets when possible.
- GA/CSP Mismatch: CSP must permit GA hosts; configuration currently accounts for this.

## 14. Future Enhancements (Out‑of‑Scope for v1)

- Article taxonomy pages (by tag) and tag listings.
- Full-text search across articles (client-side index or external search).
- Pagination for `/articles/`.
- Author bios, multi-author support.
- Newsletter signup and lead capture forms (with privacy notice).
- Structured data (JSON‑LD) for Articles and Organization.
- Image optimization pipeline and automated responsive image generation.
- Broader analytics/observability (e.g., Plausible, PostHog, or Sentry for client errors).

## 15. Content Guidelines

- Excerpts: 100–160 characters, plain text, no quotes or ellipses; must reflect the unique value of the piece.
- Tags: 2–5, Title Case, mix of general and specific.
- Images: Provide descriptive `alt`. Prefer local assets; include dimensions for `next/image` usage in MDX.
- Tone: Professional, accessible, and mission-focused.

## 16. Testing Strategy

- Unit Tests:
  - `src/lib/env.ts`: env parsing and validation cases.
  - `src/lib/site.ts`: base URL composition and normalization.
  - `src/components/ui/MDXImage.tsx`: selection of `next/image` vs `<img>`.
  - `src/lib/posts.ts`: frontmatter parsing, derived fields, URL formation.
- Integration Checks:
  - MDX compilation path with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.
  - Sitemap and RSS output sanity (URLs absolute; counts match published posts).
- CI Gates: `npm run typecheck && npm run lint && npm test` before build.

## 17. Operational Playbooks

- Local Development
  - Windows with WSL: install `win-npm` wrapper; use `win-npm run dev` et al.
  - Environment: `.env.local` can define `SITE_URL` for local absolute links.
- Content Authoring
  - Create new article: `npm run new-article` and fill prompts.
  - Enrich articles: `npm run article-enrichment` (requires `OPENAI_API_KEY`).
- Deployment
  - Merge to `main` triggers build + staging deploy to repo subdirectory.
  - Manual `workflow_dispatch` can deploy to production; custom domain supported via Actions Var/Secret `SITE_URL

## 18. Accessibility & Quality Gates in CI

- **Purpose:** Ensure that Tech Tavern’s static site maintains a high standard of accessibility and does not regress over time. Automated accessibility and performance checks are added to the CI/CD pipeline using free, open-source tools.  

- **Tools:**  
  - **axe-core CLI** (open-source): runs WCAG 2.0/2.1 A/AA checks on representative URLs (Home, Articles index, one Article).  
  - **Lighthouse CI** (open-source): validates Lighthouse accessibility score and provides audit reports as build artifacts.  

- **Implementation:**  
  - In GitHub Actions workflow, after the static site build:  
    - Serve the `out/` directory locally.  
    - Run axe CLI against a defined set of URLs; build fails on WCAG violations.  
    - Run Lighthouse CI with configuration in `lhci.config.js`; assert minimum accessibility score ≥ 0.95.  
  - Upload Lighthouse CI reports to temporary public storage (or GitHub Actions artifacts).  

- **Acceptance Criteria:**  
  - Every PR and `main` branch build runs axe + Lighthouse checks.  
  - Build fails if axe detects WCAG 2.0/2.1 A/AA violations on target pages.  
  - Build fails if Lighthouse accessibility score < 0.95.  
  - Successful builds attach Lighthouse reports to CI artifacts for inspection.  

- **Non-Goals:**  
  - Paid versions of Axe or Lighthouse; dashboard/enterprise integrations.  
  - Full crawl of all articles (sampled subset only).  

- **Rationale:**  
  - Keeps site aligned with WCAG standards.  
  - Prevents accidental regressions in accessibility as content or templates evolve.  
  - Maintains lightweight, zero-cost CI checks appropriate for a static GitHub Pages deployment.  

## 19. Structured Data & Enhanced Open Graph Tags

- **Purpose:** Improve discoverability, indexing accuracy, and content sharing of Tech Tavern articles and pages by embedding structured data (JSON-LD) and enhanced Open Graph (OG) metadata. This ensures articles appear correctly in search results, are eligible for rich snippets, and are more effectively harvested by AI-driven engines and aggregators.

- **Tools & Standards:**  
  - **JSON-LD (Schema.org vocabulary):**  
    - `Organization` schema for Tech Tavern, LLC (name, logo, URL, contact).  
    - `Article` schema for individual posts (headline, datePublished, author, publisher, description, image, canonical URL).  
  - **Open Graph (OG) Tags:**  
    - Extended metadata for article type pages (`og:type=article`, `og:title`, `og:description`, `og:image`, `og:url`).  
    - Twitter Card tags for large image previews.  

- **Implementation:**  
  - Each article page automatically generates an `Article` JSON-LD block from MDX frontmatter.  
  - The site layout injects `Organization` JSON-LD on global pages (Home, About, Articles index).  
  - Frontmatter fields (`ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`) override defaults when provided.  
  - OG/Twitter tags generated dynamically at build from validated frontmatter + defaults.  
  - Ensure canonical URLs are always absolute and correct for each page.  

- **Acceptance Criteria:**  
  - Every published article includes valid JSON-LD `Article` markup.  
  - Site includes global JSON-LD `Organization` markup with correct logo, name, and homepage URL.  
  - OG/Twitter tags render correctly when shared to LinkedIn, Twitter/X, and Facebook.  
  - JSON-LD validates with [Google Rich Results Test](https://search.google.com/test/rich-results).  
  - OG/Twitter tags verified via platform card validators.  

- **Non-Goals:**  
  - No dynamic SEO plugin or CMS integration.  
  - No custom JSON-LD beyond `Article` and `Organization` schemas for v1.  

- **Rationale:**  
  - Enhances search engine visibility, enabling eligibility for Google rich results and improved rankings.  
  - Increases likelihood of article harvesting and citation by AI-driven search/answer engines.  
  - Ensures consistent, attractive previews when articles are shared on social networks.  

## 20. Articles Pagination

- **Purpose:** Improve usability and content discovery on the `/articles/` index page by adding pagination. This prevents overly long scrolling, provides a clearer sense of site depth, and supports efficient navigation on both desktop and mobile.

- **Scope:**  
  - **Pagination Only:** Tag archive pages are not required; tags remain purely metadata for signaling article topics.  
  - **Configurable Page Size:** Number of articles per page is centrally defined in the site config file.  

- **Implementation:**  
  - Add server-side static pagination to `/articles/`, generating pages such as:  
    - `/articles/` → page 1  
    - `/articles/page/2/`, `/articles/page/3/`, etc.  
  - Pagination controls displayed at bottom of the articles index:  
    - "Previous" and "Next" buttons.  
    - Page number links (e.g., 1, 2, 3 … n).  
    - Accessible labels for screen readers (`aria-label` attributes).  
  - Ensure responsive design: pagination controls adapt to small screens (mobile-friendly spacing, tap targets ≥44px).  
  - Central configuration:  
    - Add `ARTICLES_PER_PAGE` constant in site config file.  
    - Changing this value regenerates pagination automatically at build.  

- **Acceptance Criteria:**  
  - `/articles/` displays the most recent N articles as configured.  
  - Additional pages are generated statically with proper routing.  
  - Pagination UI is fully accessible and keyboard-navigable.  
  - Mobile view renders pagination buttons/links with adequate touch target size.  
  - SEO best practices:  
    - Canonical URLs set for each page.  
    - `rel="prev"` and `rel="next"` attributes included in `<head>` where applicable.  
    - Sitemap includes all paginated pages.  

- **Non-Goals:**  
  - No tag archive pages or category landing pages in this iteration.  
  - No infinite scroll; traditional pagination only.  

- **Rationale:**  
  - Improves content navigation without requiring tag-based browsing.  
  - Supports long-term scalability as the number of published articles grows.  
  - Maintains strong SEO and accessibility practices for static site architecture.  

## 21. Appendix — Key Technical References

- Architecture:
  - Next.js App Router with static export; routes under `src/app/`.
- Content:
  - Articles: `content/articles/*.mdx` with Zod frontmatter schema (`src/lib/posts.ts`).
- SEO/Syndication:
  - `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`.
- Utilities:
  - `src/lib/env.ts` (Zod env validation), `src/lib/site.ts` (URL helpers, defaults, metadata), `src/mdx-components.tsx` (MDX components/styling).
- UI Components:
  - Sections: `src/components/sections/*`, UI: `src/components/ui/*`.
- CI/CD:
  - `.github/workflows/deploy.yml` (quality gates, build, deploy to Pages).

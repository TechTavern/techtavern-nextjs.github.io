<!--
Sync Impact Report:
- Version change: Template → 1.0.0 (initial constitution for Tech Tavern NextJS project)
- Added sections: Core Principles (5), Technology Standards, Quality Gates
- Added principles: 
  * Static-First Architecture
  * Test-Driven Development  
  * SEO-First Design
  * Performance-by-Design
  * Security-by-Design
- Templates requiring updates: 
  ✅ Updated plan-template.md (Constitution Check section)
  ✅ Updated tasks-template.md (NextJS/Static-First task categories)
  ✅ Reviewed spec-template.md (no changes needed - focuses on requirements)
  ✅ Reviewed agent-file-template.md (template for generating agent guidelines)
  ✅ Verified AGENTS.md alignment (already follows constitution principles)
- Follow-up TODOs: None - all placeholders filled, all templates aligned
-->

# Tech Tavern Static Site Constitution

## Core Principles

### I. Static-First Architecture
All features must be implementable as a static export from Next.js App Router. Server-side rendering at build time only; no runtime server dependencies. Components must work with `output: 'export'` configuration. Base path handling required for GitHub Pages subdirectory deployment. Client-side JavaScript minimized and progressive enhancement only.

**Rationale**: Ensures maximum reliability, security, and cost-effectiveness through static hosting while maintaining compatibility with GitHub Pages deployment pipeline.

### II. Test-Driven Development (NON-NEGOTIABLE)
TDD mandatory for all business logic: Tests written → Approved → Tests fail → Implementation begins. Red-Green-Refactor cycle strictly enforced. Unit tests for utilities (`src/lib/*`), integration tests for MDX processing, and CI gates for typecheck + lint + test before build. Jest + React Testing Library as standard testing framework.

**Rationale**: Maintains code quality, prevents regressions, and ensures reliable static site generation across all environments and deployment scenarios.

### III. SEO-First Design
Every page must generate complete metadata, proper OpenGraph tags, JSON-LD structured data, and canonical URLs. Sitemap and RSS feeds automatically updated. Content structure optimized for search engines and social sharing. Images include descriptive alt text. Semantic HTML structure maintained throughout.

**Rationale**: Maximizes discoverability and professional presentation of Tech Tavern's thought leadership content, directly supporting business development goals.

### IV. Performance-by-Design
Lighthouse performance score ≥ 90 on mobile for all pages. Local fonts with font-display: swap. Images optimized and properly sized. Critical CSS inlined. No render-blocking resources. Bundle analysis included in CI to detect performance regressions. Reading time automatically calculated and displayed.

**Rationale**: Fast loading times improve user experience, SEO rankings, and professional credibility, reflecting Tech Tavern's technical excellence standards.

### V. Security-by-Design
Content Security Policy (CSP) enforced via meta tag. No unsafe-eval in production builds. Zod validation for all environment variables and frontmatter. Client bundles blocked from importing server-only modules. External links include proper rel attributes. Dependencies audited via npm audit in CI.

**Rationale**: Demonstrates security best practices expected of a technology consulting firm while protecting site integrity and user privacy.

## Technology Standards

**Stack Requirements**: Next.js 15+ with App Router, React 19+, TypeScript strict mode, Tailwind CSS v4, MDX for content. No runtime dependencies beyond static hosting capabilities.

**Code Quality**: ESLint with Next.js rules, TypeScript strict mode, Zod for runtime validation, SOLID principles adherence. All utilities must be pure functions when possible.

**Content Standards**: MDX files in `content/articles/` with Zod-validated frontmatter. Filename convention `YYYY-MM-DD-slug.mdx`. Required fields: title, date, slug. Auto-generated fields: URL, reading time, derived date components.

**Build Requirements**: Static export to `out/` directory. Environment variable validation at build time. Base path configuration for staging vs production deployment. Source maps removed in production builds.

## Quality Gates

**Pre-commit**: Type checking, linting, and unit tests must pass. No TypeScript errors or ESLint violations permitted.

**CI Pipeline**: Full quality gate including typecheck, lint, test, npm audit, and build verification. Accessibility checks via axe-core CLI and Lighthouse CI (≥ 0.95 accessibility score).

**Deployment**: Build artifacts uploaded for traceability. Health check performed post-deployment. Staging deployment occurs for all PRs to main branch.

**Content Workflow**: All articles validated against Zod schema. Build fails on invalid frontmatter. Optional AI enrichment for excerpts and tags via OpenAI API.

## Governance

Constitution supersedes all other development practices and must be referenced in code reviews. Any feature that cannot comply with core principles must be rejected or redesigned. Amendments require documentation of impact on existing codebase and migration plan.

All PRs must verify compliance with Static-First, TDD, SEO-First, Performance, and Security principles. Complexity beyond these standards must be explicitly justified. Use `AGENTS.md` for agent-specific development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25
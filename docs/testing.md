# Testing Reference

## Overview
- Primary unit testing framework: Jest 30 with Testing Library
- Default environment: jsdom via `jest.config.js`; use `/* @jest-environment node */` for server tests
- Test files: colocated `*.test.ts(x)` alongside source for clear ownership
- Coverage reports: written to `coverage/` with json, lcov, text, clover formats

## Configuration Map
- `jest.config.js`: wraps Next.js config, maps `@/` alias, collects coverage for lib utilities and route handlers (`src/lib/**/*`, `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`, `src/app/robots.ts`) while deferring component coverage to later M3 phases
- `jest.setup.js`: registers Testing Library matchers
- `playwright.config.js`: runs accessibility smoke flows; invoke with `npm run test:a11y`
- `.github/workflows/*`: CI runs lint, typecheck, and (after Phase 1) coverage reporting

## Commands
- `npm run test`: unit/integration suite (Jest)
- `npm run test:coverage`: Jest with coverage enabled; produces `coverage-summary.json`
- `npm run test:a11y`: Playwright accessibility smoke suite (`tests/accessibility.spec.js`)
- `npm run test:a11y-static`: Node-based axe audit for static export

## Helpers & Fixtures
- `src/tests/test-utils.tsx`: central render helper (`renderWithProviders`) and `createPostMeta` / `createPosts` factories for consistent `PostMeta` fixtures
- Extend `renderWithProviders` with context providers when components require them; prefer updating the helper over ad-hoc wrappers in individual tests
- Use `createPostMeta` when a single post object is needed; `createPosts` generates ordered post arrays with normalized dates/slugs

## Authoring Guidelines
- Prefer descriptive `describe` blocks mirroring feature names (e.g., `describe('rss route GET')`)
- Mock server-only modules (`site.server.ts`) with explicit restore/cleanup inside tests to avoid cross-test coupling
- Validate both happy path and failure signals (thrown errors, status codes, fallback responses)
- Keep fixtures lightweight; rely on factories above rather than reading MDX content unless end-to-end parsing is required
- Capture coverage regressions early by running `npm run test:coverage` locally before PRs

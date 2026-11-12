# Dependency upgrade plan — 2026-11-12

Package manager: npm. Security tool: `npm audit` (Snyk not installed).
Baseline: build, lint, typecheck, and 135 Jest tests pass. `npm audit`: 18 distinct advisories (3 critical, 5 high, 8 moderate, 2 low).

**Result:** all six groups passed every gate. `npm audit`: 18 → 4 distinct advisories (0 critical, 0 high, 3 moderate, 1 low). The four remaining are the holds listed below.

## Groups, in execution order

### Patch tier

**1. Standalone patches (low risk)**
- zod 4.6.5 → 4.6.7 (fixes GHSA-mrhx-c7xc-m3w5, high)
- concurrently 10.0.5 → 10.0.7 (pulls shell-quote 1.9.0 → 1.12.0, fixes GHSA-pqg4-j6r4-53mv, critical)
- baseline-browser-mapping 2.11.25 → 2.11.36
- @testing-library/user-event 14.6.7 → 14.6.10
- @types/node 25.9.8 → 25.9.9

**2. React (low risk)**
- react, react-dom 19.3.0 → 19.3.1. @types/react already at 19.3.0 (latest).

**3. Tailwind / PostCSS (low risk)**
- tailwindcss, @tailwindcss/postcss 4.3.3 → 4.3.5; postcss 8.5.28 → 8.5.32
- `npm update source-map-js` → 1.2.2 (in range of `^1.2.1`; fixes GHSA-68fv-2mgg-jv7q, high)

### Minor tier

**4. Testing (low risk, dev only)**
- playwright, @playwright/test 1.63.0 → 1.65.0; @axe-core/playwright 4.13.0 → 4.14.0

**5. lucide-react 1.47.0 → 1.72.0 (low risk)** — icon additions; peer range covers React 19.

**6. Next.js (medium risk, highest security value)**
- next, eslint-config-next, @next/mdx, @next/bundle-analyzer 16.3.6 → 16.4.6
- sharp override `^0.35.4` → `^0.35.5` (GHSA-wq5f-xc86-pv6w, high)
- Fixes 10 Next.js advisories including two critical RCEs (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr, both `<=16.4.0`).
- 16.4 adds lazy compilation, smaller Turbopack output, React 19.3 support, and Cache Components improvements. Cache Components default only applies to new `create-next-app` projects. No breaking changes found for static export. Build is the real gate.

## Deliberate holds

- **eslint 10.14.0** — `eslint-config-next@16.4.6` bundles `eslint-plugin-react@7.37.5` (peer `eslint ^9.7`, unpublished since 2025-04). Already on the 9.x maintenance tip (9.39.5). Unblocks when eslint-plugin-react supports v10 or Next drops it.
- **@types/node 26** — CI runs Node 24; types should not run ahead of the runtime floor.
- **deepmerge 4.3.1** (GHSA-gcqx-w48m-w2h4, low) — no patched release exists. Dev only (jest-config).
- **glob 10.x/13.x, minimatch 9.x/10.x** (moderate) — fixes only in glob ≥14.0.2 / minimatch ≥11.0.1, outside parents' ranges (jest, test-exclude, typescript-estree). Dev/lint tooling only; not shipped.
- **postcss-selector-parser 6.0.10** (moderate) — pinned exactly by `@tailwindcss/typography@0.5.20`, the latest. Build-time only.

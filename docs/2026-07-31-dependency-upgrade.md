# Dependency Upgrade — 2026-07-31

**Project:** techtavern-nextjs.github.io · **Package manager:** npm · **Audit tool:** `npm audit`

Staged upgrade with build/lint/typecheck/test gates between groups. All groups landed; nothing was skipped or rolled back except one deliberate experiment (TypeScript 7, see below).

## Result

**Security: 19 → 1 distinct advisories.**

(npm's headline count is unreliable here — it counts graph nodes, not advisories. `next` alone carried 9 advisories behind a headline of 1.)

| Severity | Before | After |
|---|---|---|
| critical | 1 | 0 |
| high | 11 | 1 |
| moderate | 6 | 0 |
| low | 1 | 0 |

Final gate state — all passing:

| Gate | Result |
|---|---|
| `npm run build` | pass — 39 static pages |
| `npm run lint` | pass |
| `npm run typecheck` | pass (TypeScript 7.0.2) |
| `npm run typecheck:ts6` | pass (TypeScript 6.0.3) |
| `npm test` | pass — 41 suites, 135 tests, 2 snapshots |
| `npx playwright test tests/accessibility.spec.js` | pass — 12 tests |

## Packages upgraded

**Next.js ecosystem** — cleared 9 advisories (2 SSRF, 2 DoS, 3 cache-confusion, middleware/proxy bypass, unauthenticated Server Function endpoint disclosure)

- `next` 16.2.7 → 16.2.12
- `@next/mdx` 16.2.7 → 16.2.12
- `@next/bundle-analyzer` 16.2.7 → 16.2.12
- `eslint-config-next` 16.2.7 → 16.2.12

**PostCSS + Tailwind** — cleared PostCSS path traversal (GHSA-r28c-9q8g-f849)

- `postcss` 8.5.15 → 8.5.25
- `tailwindcss` 4.3.0 → 4.3.3
- `@tailwindcss/postcss` 4.3.0 → 4.3.3
- `@tailwindcss/typography` 0.5.19 → 0.5.20

**React core**

- `react` 19.2.7 → 19.2.8
- `react-dom` 19.2.7 → 19.2.8
- `@types/react` 19.2.16 → 19.2.18
- `@types/react-dom` 19.2.3 → 19.2.4

**ESLint** — 9.39.5 is the `maintenance` dist-tag; see the ESLint 10 hold below

- `eslint` 9.39.4 → 9.39.5
- `@eslint/eslintrc` 3.3.5 → 3.3.6

**Testing**

- `@playwright/test` 1.60.0 → 1.62.1
- `playwright` 1.60.0 → 1.62.1
- `@axe-core/playwright` 4.11.3 → 4.12.1
- `@testing-library/jest-dom` 6.9.1 → **7.0.0** (major)
- `@testing-library/dom` added at ^10.4.1 — now a required peer of jest-dom 7

**Misc** — `concurrently` cleared the only critical advisory (`shell-quote`, GHSA-w7jw-789q-3m8p) plus a high

- `concurrently` 9.2.1 → **10.0.4** (major)
- `lucide-react` 1.17.0 → 1.28.0
- `@types/node` 25.9.1 → 25.9.5
- `@types/mdx` 2.0.13 → 2.0.14
- `baseline-browser-mapping` 2.10.34 → 2.11.8

**Transitive sweep** via `npm update` — no `package.json` change needed; the patched versions already satisfied existing ranges and simply weren't in the lockfile

- `js-yaml` (1 high + 1 moderate), `ws` (1 high), `@babel/core` (1 low), and one of two `brace-expansion` advisories

**Override**

- `sharp` 0.34.5 → 0.35.3, scoped under `next`. `next@16.2.12` pins `sharp: ^0.34.5` in `optionalDependencies`, and the patched version is `>=0.35.0` — outside the caret, so `npm update` could not reach it. Cleared a high advisory.

## Infrastructure changes

**CI Node 20 → 24** in `.github/workflows/deploy.yml` (2 places) and `playwright-regression.yml` (1 place). This directly unblocked `@testing-library/jest-dom@7` and `concurrently@10`, both of which require Node ≥22 and would have passed locally (Node 24) while failing in CI.

Note: `deploy.yml` uses CRLF line endings; `playwright-regression.yml` uses LF. Preserve them when editing.

**Removed `whatwg-url`** — a direct devDependency at 16.0.1 that nothing imported. No source file, test, or config referenced it; `jsdom@26.1.0` resolves its own nested `whatwg-url@14.2.0` regardless. Verified intact after removal.

## TypeScript 7 — adopted side-by-side

`npm run typecheck` now runs **TypeScript 7.0.2** (the Go-native compiler). Typecheck went from 2.31s to 0.53s (~4.3x).

```json
"@typescript/native": "npm:typescript@^7.0.2",
"typescript": "npm:@typescript/typescript6@^6.0.2"
```

- `npx tsc` → 7.0.2 — used by `npm run typecheck`
- `npx tsc6` → 6.0.3 — used by `npm run typecheck:ts6` (escape hatch)
- `require('typescript')` → the TS 6 API, which is what keeps `typescript-eslint` working

**Why the alias is necessary.** A plain `typescript@7` install does not fail at install time — npm accepts it with 8 `ERESOLVE overriding peer dependency` warnings. It fails at *lint* time:

```
Error: typescript-eslint does not support TS 7.0.
  at node_modules/.../typescript-eslint/dist/index.js:52
```

That is a deliberate guard (`if (versionMajor >= 7) throw`) added in `typescript-eslint@8.65.0`. Two things worth recording, because both are counterintuitive:

1. **There is no newer typescript-eslint to upgrade to.** 8.65.0 *is* `latest`, and it is the version that throws.
2. **Patching out the throw would not work.** `typescript@7.0.2` ships `exports: { ".": "./lib/version.cjs" }` — the main entry is a version constant. The real API is behind `./unstable/*` with an entirely different shape. `require('typescript')` returns no `createProgram` and no `TypeChecker`, so removing the guard trades a clear error for an obscure failure deeper in the linter.

The codebase itself is fully TS7-clean — `tsc --noEmit` passes with zero errors under 7.0.2.

**When TS 7.1 lands** (it restores the classic compiler API; typescript-eslint tracks support in [issue #10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)), collapse the alias back to a plain `"typescript": "^7.x"` and drop `typecheck:ts6`.

## Remaining hold — ESLint 10

`eslint` stays on the 9.x maintenance line. `eslint-config-next@16.2.12` declares an unbounded peer of `eslint: ">=9.0.0"`, which is misleading — npm would install ESLint 10 without complaint and it would break at lint time. The real constraint is the plugins it pulls in:

| Plugin | Installed | ESLint peer ceiling | Last publish |
|---|---|---|---|
| `eslint-plugin-react` | 7.37.5 | `^9.7` | 2025-04-03 |
| `eslint-plugin-jsx-a11y` | 6.10.2 | `^9` | 2024-10-26 |
| `eslint-plugin-import` | 2.32.0 | `^9` | 2025-06-20 |

Three of the five bundled plugins cap at ESLint 9. ESLint 10 additionally removes `eslintrc` entirely (this repo still uses `@eslint/eslintrc`) and requires replacing `eslint-plugin-import` with `eslint-plugin-import-x`.

**Standing risk, separate from this upgrade:** `eslint-plugin-jsx-a11y` has not published in ~21 months. An unmaintained plugin gating your linter's major version is worth tracking on its own.

**Unblocked when:** `eslint-config-next` migrates to `eslint-plugin-import-x` and the React/a11y plugins ship ESLint 10 support.

## Remaining advisory — `brace-expansion` (high, DoS)

Left in place deliberately. This is not an oversight and does not need re-litigating next pass.

The advisory range is `<=5.0.7`, which has **no lower bound** — so it matches every 1.x and 2.x release, and no patch on those lines can ever satisfy it. Two copies remain flagged:

- `brace-expansion@1.1.18` ← `@eslint/eslintrc` → `minimatch@3.1.5`
- `brace-expansion@2.1.4` ← `jest` → `glob@10.5.0` → `minimatch@9.0.9`

An `overrides` entry forcing 5.x **would break ESLint and Jest**, verified directly:

```
v1.1.18  ->  typeof = function   (module.exports = expand)
v5.0.9   ->  typeof = object     ({ expand, EXPANSION_MAX, ... })
```

`minimatch@3.1.5` does `require('brace-expansion')` and calls the result. Under v5 that is an object, so it throws `expand is not a function`.

npm's suggested fix is `@eslint/eslintrc@0.1.0` — a major *downgrade* from 3.3.6. Not acceptable; this is the classic `npm audit fix --force` trap.

**Actual exposure: negligible.** Dev-only dependency path, DoS-only, operating on developer-authored glob patterns from local config files. Not attacker-reachable, and this is a static site with no server runtime.

**Unblocked when:** `@eslint/eslintrc` and `jest`'s `glob` move to `minimatch@10.x`, which uses `brace-expansion@5.x`. Both are upstream changes.

## Notes for next time

- Report **distinct advisories**, not `npm audit`'s summary line. The headline counts graph nodes and misleads in both directions.
- Try `npm update <pkg>` before reaching for `overrides` — it resolved 5 of this pass's advisories with no `package.json` change at all.
- `sharp` is unreachable in this project (`images.unoptimized: true` + `output: 'export'` means the Image Optimization path never executes). It was patched anyway since the override was free, but it should never justify a risky change.

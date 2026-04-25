# Dependency Update Groups

Initial grouping generated from `npm outdated --json` on April 25, 2026.

Update run outcome: all groups were applied except the ESLint 10 major upgrade. ESLint 10.2.1 was tested and then reverted because `eslint-config-next@16.2.4` still depends on ESLint plugins with peer ranges capped at ESLint 9, and lint crashed at runtime with `scopeManager.addGlobals is not a function`.

Use one branch or PR per group unless the group is explicitly marked as safe to combine. After each group, commit both `package.json` and `package-lock.json` changes if package manifests changed.

## Baseline

Before starting any update branch:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

If this baseline is not green, fix or document the pre-existing failure before updating dependencies.

## Group 1: Next.js Patch Set

Packages:

- `next`: `16.2.2` -> `16.2.4`
- `@next/mdx`: `16.2.2` -> `16.2.4`
- `@next/bundle-analyzer`: `16.2.2` -> `16.2.4`
- `eslint-config-next`: `16.2.2` -> `16.2.4`

Command:

```bash
npm install next@16.2.4 @next/mdx@16.2.4 @next/bundle-analyzer@16.2.4 eslint-config-next@16.2.4
```

Why this is grouped: these packages are version-coupled to the Next.js release line and should move together.

Validation:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:smoke
```

## Group 2: React Runtime Patch

Packages:

- `react`: `19.2.4` -> `19.2.5`
- `react-dom`: `19.2.4` -> `19.2.5`

Command:

```bash
npm install react@19.2.5 react-dom@19.2.5
```

Why this is grouped: React and React DOM must stay in sync, and rendering regressions should be isolated from framework changes.

Validation:

```bash
npm run typecheck
npm run test
npm run build
npm run test:smoke
```

## Group 3: Styling Build Chain

Packages:

- `tailwindcss`: `4.2.2` -> `4.2.4`
- `@tailwindcss/postcss`: `4.2.2` -> `4.2.4`
- `postcss`: `8.5.8` -> `8.5.10`

Command:

```bash
npm install -D tailwindcss@4.2.4 @tailwindcss/postcss@4.2.4 postcss@8.5.10
```

Why this is grouped: Tailwind v4 and its PostCSS adapter share the CSS generation path. Keep visual and CSS build changes in one review.

Validation:

```bash
npm run lint
npm run build
npm run test:smoke
npm run test:a11y
```

Also do a quick browser pass on the home page and an article page because CSS regressions may pass automated tests.

## Group 4: Test And Browser Metadata Tooling

Packages:

- `@axe-core/playwright`: `4.11.1` -> `4.11.2`
- `baseline-browser-mapping`: `2.10.15` -> `2.10.21`

Command:

```bash
npm install -D @axe-core/playwright@4.11.2 baseline-browser-mapping@2.10.21
```

Why this is grouped: these affect browser and accessibility test behavior, not production runtime behavior.

Validation:

```bash
npm run test:smoke
npm run test:a11y
npm run test:a11y-static
```

## Group 5: Node Type Definitions

Packages:

- `@types/node`: `25.5.2` -> `25.6.0`

Command:

```bash
npm install -D @types/node@25.6.0
```

Why this is isolated: type definition changes can surface compile errors without changing runtime code.

Validation:

```bash
npm run typecheck
npm run test
```

Note: the README recommends Node.js 20.x or `>=18.17`, while the project currently uses Node 25 type definitions. Before doing a larger cleanup, decide whether to keep following the newest Node types or align `@types/node` to the supported runtime major.

## Group 6: Icon Library Major Upgrade

Packages:

- `lucide-react`: `0.564.0` -> `1.11.0`

Command:

```bash
npm install lucide-react@1.11.0
```

Why this is isolated: this is a major upgrade. Even if most icon imports continue to compile, visual output or export names may change.

Validation:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:smoke
```

Also inspect pages and components that import from `lucide-react`.

## Group 7: ESLint Major Upgrade

Status: deferred.

Packages:

- `eslint`: `9.39.4` -> `10.2.1`

Command:

```bash
npm install -D eslint@10.2.1
```

Why this is isolated: ESLint major releases can require config or plugin compatibility changes. This was tested after the Next.js patch set and is not currently compatible with the installed Next ESLint plugin stack.

Validation:

```bash
npm run lint
npm run typecheck
```

Revisit this only after `eslint-config-next` and its bundled plugins advertise ESLint 10 support.

## Group 8: TypeScript Major Upgrade

Packages:

- `typescript`: `5.9.3` -> `6.0.3`

Command:

```bash
npm install -D typescript@6.0.3
```

Why this is isolated: TypeScript major upgrades can change inference, module resolution, library declarations, and framework support constraints.

Validation:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Do this after Group 1 so the Next.js toolchain is on its latest patch before testing TypeScript 6 compatibility.

## Suggested Order

1. Group 1: Next.js patch set
2. Group 2: React runtime patch
3. Group 3: styling build chain
4. Group 4: test and browser metadata tooling
5. Group 5: Node type definitions
6. Group 6: icon library major upgrade
7. Group 7: ESLint major upgrade
8. Group 8: TypeScript major upgrade

Groups 3, 4, and 5 are safe to combine only if the baseline test suite is already fast and reliable. Keep Groups 6, 7, and 8 separate.

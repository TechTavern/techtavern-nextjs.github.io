// Types for bundler-resolved image imports (e.g. `import x from "./a.webp"`).
// next-env.d.ts also references this, but it is gitignored and only generated
// by `next dev`/`next build`, so a fresh `tsc --noEmit` (CI) would miss it.
/// <reference types="next/image-types/global" />

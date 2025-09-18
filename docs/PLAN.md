# Development Plan

This fill will contain development plan information for the application.

## AI excerpt and tagging script

Below is a prompt to use for the creation of a script.  For some reason ChatGPT-5 can't create an error free script for it's own API.  

```markdown
You are a senior Node.js engineer. Generate a single-file script named `scripts/enrich-article.js` for a Next.js content repo.

Environment / dependencies:
- CommonJS module syntax, Node 18+ (global `fetch` available).
- Use only core modules plus `gray-matter` (assume it is installed).
- Do not introduce extra packages or helper files.

Functional requirements:
1. If supplied with an `.mdx` file, act only on that file.  If supplied with a directory discover every `.mdx` file under `content/articles/` (non-recursive).
2. Parse each file’s frontmatter and body with `gray-matter`.
3. Determine whether the frontmatter needs enrichment:
   - `excerpt`: string, trimmed length between 100 and 160 characters inclusive, single paragraph (no newlines).
   - `tags`: array of 2–5 strings; every entry trimmed, non-empty, and Title Case (first letter capitalized, remaining lower except interior spaces).
   - Skip a file entirely when both fields already satisfy these rules.
4. For files needing enrichment, call OpenAI’s Responses API (`POST https://api.openai.com/v1/responses`) with:
   - `model`: value from `OPENAI_MODEL` env var or `.env.local`, default `'gpt-4.1-mini'`.
   - `input`: a list containing one `role: "system"` instruction (restate the excerpt/tag rules) and one `role: "user"` message with article title plus full Markdown body.
   - `max_output_tokens`: 1000.
   - `temperature`: 0.5.
   - Authorization header using `OPENAI_API_KEY`.
5. Expect the model to return a JSON object `{ "excerpt": "...", "tags": ["..."] }` in its first text segment. Parse it defensively, re-validate the excerpt/tag rules, and bail on that file with a clear error if parsing or validation fails.
6. When enrichment succeeds, update the frontmatter in place while preserving markdown body formatting.
7. Add a CLI `--dry-run` flag (or `DRY_RUN=1`) that skips API calls and file writes but prints which files would be processed.
8. Log progress with concise, human-friendly messages and print a summary totals line (updated / skipped / errors) when finished.
9. Exit with status code 1 if any unexpected error bubbles out.

Implementation notes:
- Provide a small helper to read `.env.local` (key=value, `#` comments) and merge with `process.env`. Throw a descriptive error if the API key is missing after merge.
- Wrap the main loop in `async function main()` and call it at the end with `.catch`.
- Keep the script well-structured (helpers like `needsEnrichment`, `callOpenAI`, `updateFrontmatter`). Use early returns instead of deep nesting. Add minimal inline comments only where logic is non-obvious.
```

## Styling & Design System Improvements

Based on comprehensive analysis by tailwind-ui-designer agent, the following phased implementation plan addresses critical accessibility, CSS architecture, and design system improvements.

### Phase 1: Accessibility Compliance (Critical - Week 1)

**Objective**: Achieve WCAG AA compliance and improve user experience for all users.

#### Tasks:
1. **Implement Focus States**
   - Add focus states to all interactive elements (buttons, links, form inputs)
   - Implement focus-visible for keyboard navigation
   - Add focus-within for complex components

2. **Color Contrast Audit**
   - Audit all text/background combinations for WCAG AA compliance (4.5:1 ratio)
   - Update color variables if needed to meet standards
   - Test with accessibility tools (axe-core, WAVE)

3. **ARIA Attributes & Semantic HTML**
   - Add proper ARIA labels to navigation elements
   - Implement skip links for keyboard navigation
   - Add screen reader support with sr-only utilities

4. **Mobile Touch Targets**
   - Ensure all interactive elements meet 44px minimum touch target
   - Improve mobile navigation UX

**Acceptance Criteria**:
- [ ] All interactive elements have visible focus states
- [ ] Color contrast ratios meet WCAG AA standards (4.5:1 minimum)
- [ ] Lighthouse accessibility score ≥ 95
- [ ] axe-core accessibility tests pass with 0 violations
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader testing passes for main navigation flows

**Files to Update**:
- `src/globals.css` - Add focus state utilities to @theme
- `src/components/Navigation.tsx` - ARIA attributes, focus states
- `src/components/ui/Button.tsx` - Focus states, touch targets
- `src/app/articles/[...]/page.tsx` - Link focus states
- All component files with interactive elements

**Tests Needed**:
```bash
# Add to package.json scripts
"test:a11y": "jest --testPathPattern=accessibility",
"audit:contrast": "pa11y --standard WCAG2AA http://localhost:3000"
```

### Phase 2: CSS Architecture Cleanup (Important - Week 2)

**Objective**: Consolidate custom CSS into Tailwind utilities for better maintainability.

#### Tasks:
1. **Replace Custom Classes with Tailwind Utilities**
   - `.glass` → `backdrop-blur-lg bg-white/10`
   - `.gradient-brand` → `bg-gradient-to-br from-seal-brown to-maroon`
   - `.divider` → `w-4/5 h-0.5 bg-gradient-to-r from-gray-800 via-gray-300 to-gray-800`

2. **Refactor globals.css**
   - Move component-specific styles to component files
   - Reduce globals.css from 323 lines to essential utilities only
   - Convert remaining custom CSS to Tailwind @apply directives

3. **Standardize Component Variants**
   - Create consistent button, card, and typography variants
   - Implement reusable component patterns
   - Use class-variance-authority (cva) for component variants

**Acceptance Criteria**:
- [ ] globals.css reduced to <100 lines of essential utilities
- [ ] All custom CSS classes replaced with Tailwind utilities
- [ ] Bundle size analysis shows no regression in CSS size
- [ ] Visual regression tests pass
- [ ] No broken styling across all pages

**Files to Update**:
- `src/globals.css` - Reduce and refactor custom styles
- All component files using custom classes
- Create `src/lib/variants.ts` for component variants

**Tests Needed**:
```bash
# Visual regression testing
"test:visual": "playwright test --project=chromium",
"analyze:bundle": "ANALYZE=true npm run build"
```

### Phase 3: Performance Optimization (Enhancement - Week 3)

**Objective**: Optimize CSS delivery and bundle size for better Core Web Vitals.

#### Tasks:
1. **Critical CSS Implementation**
   - Extract above-the-fold styles
   - Implement proper CSS loading strategy
   - Optimize font loading with font-display: swap

2. **Bundle Size Optimization**
   - Audit unused Tailwind classes
   - Optimize custom property usage
   - Remove unnecessary font weights

3. **Image Optimization Review**
   - Verify all images use Next.js Image component
   - Implement proper responsive breakpoints
   - Add missing alt text and loading states

**Acceptance Criteria**:
- [ ] Lighthouse Performance score ≥ 90
- [ ] First Contentful Paint (FCP) ≤ 1.5s
- [ ] Cumulative Layout Shift (CLS) ≤ 0.1
- [ ] CSS bundle size reduced by 10-20%
- [ ] All images properly optimized and accessible

**Files to Update**:
- `next.config.js` - Bundle analyzer configuration
- `src/globals.css` - Critical CSS extraction
- All image components for optimization

**Tests Needed**:
```bash
"test:perf": "lighthouse http://localhost:3000 --output=json",
"test:bundle": "bundlesize check"
```

### Phase 4: Design System Enhancement (Polish - Week 4)

**Objective**: Create a comprehensive, scalable design system.

#### Tasks:
1. **Design Token System**
   - Implement comprehensive spacing scale
   - Create semantic color system
   - Establish typography hierarchy

2. **Component Library**
   - Document all reusable components
   - Create Storybook for component showcase
   - Implement design system documentation

3. **Dark Mode Support**
   - Add dark mode toggle functionality
   - Implement dark variants for all components
   - Test accessibility in both themes

**Acceptance Criteria**:
- [ ] Complete design token system implemented
- [ ] All components follow consistent design patterns
- [ ] Dark mode fully functional with proper contrast ratios
- [ ] Design system documented and maintainable
- [ ] Component library accessible to team

**Files to Create/Update**:
- `src/lib/design-tokens.ts` - Centralized design tokens
- `src/components/ui/` - Enhanced component library
- `src/hooks/use-theme.ts` - Dark mode functionality
- `docs/design-system.md` - Design system documentation

**Tests Needed**:
```bash
"test:design-tokens": "jest --testPathPattern=design-tokens",
"test:dark-mode": "playwright test --project=dark-mode"
```

### Implementation Guidelines

#### Getting Started:
1. Create feature branch: `git checkout -b feature/styling-improvements`
2. Install development dependencies:
   ```bash
   npm install -D @axe-core/playwright pa11y class-variance-authority
   ```
3. Set up testing infrastructure before starting changes

#### Quality Gates:
- Each phase must pass all acceptance criteria before moving to next phase
- All existing tests must continue passing
- Visual regression testing required for UI changes
- Accessibility testing required for all phases

#### Rollback Strategy:
- Maintain feature flags for major changes
- Keep incremental commits for easy rollback
- Test in staging environment before production deployment

#### Success Metrics:
- **Accessibility**: Lighthouse score ≥ 95, zero axe-core violations
- **Performance**: Core Web Vitals in green, bundle size optimized
- **Maintainability**: Reduced custom CSS, consistent component patterns
- **User Experience**: Improved navigation, better mobile experience

This phased approach ensures systematic improvement while maintaining site functionality and provides clear checkpoints for quality assurance.
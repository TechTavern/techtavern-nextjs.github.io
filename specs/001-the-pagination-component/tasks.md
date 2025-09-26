# Tasks: Pagination Component

**Input**: Design documents from `/specs/001-the-pagination-component/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.0+ with Next.js 15+ App Router, React 19+, Tailwind CSS v4, Zod
   → Libraries: Jest 30 + React Testing Library, ESLint Next.js + TypeScript rules
   → Structure: Single Next.js project with static export, pagination utilities in src/lib/
2. Load design documents:
   → data-model.md: PaginationData, PaginationConfig, PaginationLinks entities
   → contracts/: interfaces.ts, pagination-contracts.md with function contracts
   → research.md: Next.js static pagination strategy, URL state management decisions
   → quickstart.md: TDD workflow, validation scenarios, ESLint compliance requirements
3. Generate tasks by category:
   → Setup: pagination utilities, test infrastructure, ESLint compliance
   → Tests: utility functions, component behavior, integration scenarios
   → Core: pagination logic, React component, posts integration
   → Integration: Next.js pages, static generation, error handling
   → Polish: accessibility, performance, SEO optimization
4. Apply TDD rules:
   → ALL test tasks before corresponding implementation tasks
   → Mark [P] for independent files (different utilities, separate components)
   → Sequential for same file modifications (posts.ts extensions)
5. Number tasks sequentially (T001-T030)
6. Enforce constitutional compliance: Static-First, TDD, SEO-First, Performance, Security
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions
- Follow ESLint compliance: no `any` types, strict TypeScript

## Path Conventions
Single Next.js project structure:
- Core utilities: `src/lib/`
- Components: `src/components/ui/`
- Pages: `src/app/articles/`
- Tests: colocated `*.test.ts(x)` files
- Integration tests: `tests/integration/`

## Phase 3.1: Setup & Infrastructure
- [ ] **T001** [P] Add pagination configuration constants to `src/lib/site.ts` (itemsPerPage: 15, maxVisiblePageLinks: configurable)
- [ ] **T002** [P] Create pagination utility types file `src/lib/pagination.types.ts` with ESLint-compliant TypeScript interfaces
- [ ] **T003** [P] Setup pagination test fixtures in `src/tests/test-utils.tsx` (extend existing createPosts function)
- [ ] **T004** [P] Configure Jest environment for pagination testing (if needed beyond existing setup)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Utility Function Tests [P]
- [ ] **T005** [P] Create `src/lib/pagination.test.ts` with failing tests for `getPaginationData()` function
- [ ] **T006** [P] Create `src/lib/pagination.test.ts` with failing tests for `validatePageParameter()` function  
- [ ] **T007** [P] Create `src/lib/pagination.test.ts` with failing tests for `generatePaginationLinks()` function
- [ ] **T008** Extend `src/lib/posts.test.ts` with failing tests for new pagination functions in posts.ts

### Component Tests [P]  
- [ ] **T009** [P] Create `src/components/ui/Pagination.test.tsx` with failing tests for component rendering
- [ ] **T010** [P] Create `src/components/ui/Pagination.test.tsx` with failing tests for navigation interactions
- [ ] **T011** [P] Create `src/components/ui/Pagination.test.tsx` with failing tests for accessibility features
- [ ] **T012** [P] Create `src/components/ui/Pagination.test.tsx` with failing tests for responsive behavior

### Integration Tests [P]
- [ ] **T013** [P] Create `tests/integration/pagination.spec.ts` with failing Playwright tests for pagination navigation
- [ ] **T014** [P] Extend `tests/accessibility.spec.js` with failing tests for pagination accessibility compliance

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Pagination Utilities
- [ ] **T015** [P] Implement `src/lib/pagination.ts` with `getPaginationData<T>()` function to make T005 tests pass
- [ ] **T016** [P] Implement `src/lib/pagination.ts` with `validatePageParameter()` function to make T006 tests pass
- [ ] **T017** [P] Implement `src/lib/pagination.ts` with `generatePaginationLinks()` function to make T007 tests pass
- [ ] **T018** Extend `src/lib/posts.ts` with pagination functions `getPaginatedPosts()` and `generatePaginationParams()` to make T008 tests pass

### React Component
- [ ] **T019** Create `src/components/ui/Pagination.tsx` with TypeScript props interface to make T009 tests pass
- [ ] **T020** Implement pagination navigation logic in `src/components/ui/Pagination.tsx` to make T010 tests pass
- [ ] **T021** Add accessibility features (ARIA labels, keyboard navigation) to `src/components/ui/Pagination.tsx` to make T011 tests pass
- [ ] **T022** Implement responsive design using existing site breakpoint strategy (grid gap-8 md:grid-cols-2 lg:grid-cols-3 pattern) with mobile showing only Prev/Next buttons in `src/components/ui/Pagination.tsx` to make T012 tests pass

## Phase 3.4: Next.js Pages Integration

### Articles Page Updates
- [ ] **T023** Update `src/app/articles/page.tsx` to use pagination for first page (≤15 articles display logic)
- [ ] **T024** Create `src/app/articles/page/[pageNumber]/page.tsx` for paginated article routes with static generation
- [ ] **T025** Implement `generateStaticParams()` in paginated articles page for static export compatibility
- [ ] **T026** Add proper metadata generation for paginated pages (SEO titles, canonical URLs)

### Error Handling
- [ ] **T027** Enhance `src/app/not-found.tsx` to handle pagination error cases (invalid/out-of-range pages)

## Phase 3.5: Polish & Quality Gates

### SEO & Performance
- [ ] **T028** [P] Update `src/app/sitemap.ts` to include all paginated article pages
- [ ] **T029** [P] Verify Lighthouse performance score ≥90 with pagination component
- [ ] **T030** [P] Run accessibility audit with pagination component using existing axe-core setup

## Dependencies
```
Setup Phase: T001, T002, T003, T004 (all parallel)
    ↓
Tests Phase: T005-T014 (all parallel, must complete before implementation)
    ↓
Core Utils: T015, T016, T017 (parallel) → T018 (extends posts.ts)
    ↓
Component: T019 → T020 → T021, T022 (T021-T022 can be parallel)
    ↓
Pages: T023 → T024 → T025, T026 (T025-T026 can be parallel)
    ↓
Error Handling: T027
    ↓
Polish: T028, T029, T030 (all parallel)
```

## Parallel Execution Examples

### Tests Phase (After T001-T004)
```bash
# Launch T005-T012 together (all different test files):
Task: "Create pagination utility tests in src/lib/pagination.test.ts with getPaginationData failing tests"
Task: "Create pagination component tests in src/components/ui/Pagination.test.tsx with rendering failing tests"  
Task: "Create integration tests in tests/integration/pagination.spec.ts with navigation failing tests"
Task: "Extend accessibility tests in tests/accessibility.spec.js with pagination failing tests"
```

### Core Implementation Phase (After all tests fail)
```bash
# Launch T015-T017 together (same pagination.ts file, but different functions):
Task: "Implement getPaginationData function in src/lib/pagination.ts"
Task: "Implement validatePageParameter function in src/lib/pagination.ts" 
Task: "Implement generatePaginationLinks function in src/lib/pagination.ts"
```

### Polish Phase (After T027)
```bash
# Launch T028-T030 together (different files/systems):
Task: "Update sitemap generation in src/app/sitemap.ts to include paginated pages"
Task: "Run Lighthouse performance audit with pagination component"
Task: "Run axe-core accessibility audit with pagination component"
```

## Validation Checklist

### Functional Requirements (from spec.md)
- [ ] FR-001: Pagination controls only appear when >15 articles
- [ ] FR-002-003: Previous/Next buttons and numbered page links rendered
- [ ] FR-004-005: Page number in URL, defaults to page 1
- [ ] FR-006-007: Display correct subset, update URL without reload
- [ ] FR-008: Show 404 for invalid page scenarios (non-numeric, negative, zero, out-of-range)
- [ ] FR-009-010: Disable buttons at boundaries
- [ ] FR-011: Component works with any array type
- [ ] FR-012-013: 15 itemsPerPage, configurable visible page links
- [ ] FR-015: Page consistency when content changes (reverse-chronological order)
- [ ] FR-015B: Redirect to last valid page when bookmarked pages no longer exist
- [ ] FR-016-018: Mobile responsive (Prev/Next only), accessible

### Constitutional Compliance
- [ ] **Static-First**: All pages generated at build time, no runtime dependencies
- [ ] **TDD**: All tests written and failing before implementation starts
- [ ] **SEO-First**: Proper canonical URLs, sitemap inclusion, metadata
- [ ] **Performance**: Lighthouse score ≥90, no render-blocking resources
- [ ] **Security**: Zod validation, CSP compliance, no security risks
- [ ] **Code Quality**: ESLint compliance, no `any` types, TypeScript strict

### ESLint Compliance Requirements
- [ ] No `any` types - use `unknown` or proper generics
- [ ] Follow Next.js + TypeScript ESLint rules
- [ ] All code passes `npm run lint`
- [ ] TypeScript strict mode throughout

## Notes
- **[P] tasks**: Different files, no dependencies between them
- **TDD Mandatory**: Verify ALL tests fail before starting T015 (implementation phase)
- **ESLint First**: Every task must produce ESLint-compliant code
- **Accessibility Priority**: WCAG 2.1 AA compliance required
- **Performance Gates**: Maintain existing Lighthouse scores
- **Static Export**: All features must work with `output: 'export'`

## File Modifications Summary
**New Files**: 6 new files created
- `src/lib/pagination.ts` (core utilities)
- `src/lib/pagination.test.ts` (utility tests)
- `src/components/ui/Pagination.tsx` (React component)
- `src/components/ui/Pagination.test.tsx` (component tests)
- `src/app/articles/page/[pageNumber]/page.tsx` (paginated routes)
- `tests/integration/pagination.spec.ts` (integration tests)

**Modified Files**: 7 existing files extended
- `src/lib/site.ts` (add pagination configuration constants)
- `src/lib/posts.ts` (add pagination functions)
- `src/lib/posts.test.ts` (extend with pagination tests)
- `src/app/articles/page.tsx` (add pagination logic)
- `src/app/sitemap.ts` (include paginated pages)
- `src/app/not-found.tsx` (handle pagination errors)
- `src/tests/test-utils.tsx` (add pagination fixtures)
- `tests/accessibility.spec.js` (add pagination accessibility tests)
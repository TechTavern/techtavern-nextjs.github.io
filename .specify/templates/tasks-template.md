# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create NextJS App Router structure per implementation plan (src/app/, src/components/, src/lib/)
- [ ] T002 Initialize project dependencies ensuring static export compatibility
- [ ] T003 [P] Configure ESLint, TypeScript, and Tailwind CSS
- [ ] T004 [P] Setup Jest + React Testing Library test environment

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T005 [P] Unit tests for utility functions in src/lib/*.test.ts
- [ ] T006 [P] Component tests for new UI components in src/components/ui/*.test.tsx
- [ ] T007 [P] Integration tests for MDX processing in src/test/mdx.test.ts
- [ ] T008 [P] Page metadata generation tests in src/test/metadata.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] Utility functions in src/lib/ with Zod validation
- [ ] T010 [P] UI components in src/components/ui/ with TypeScript props
- [ ] T011 [P] Page components in src/app/ following App Router patterns
- [ ] T012 Static generation functions (generateStaticParams, generateMetadata)
- [ ] T013 MDX processing and content validation
- [ ] T014 SEO metadata and JSON-LD structured data

## Phase 3.4: Static Export Integration
- [ ] T015 Verify static export compatibility (output: 'export')
- [ ] T016 Base path configuration for GitHub Pages
- [ ] T017 Image optimization settings (unoptimized: true)
- [ ] T018 CSP implementation and security headers

## Phase 3.5: Polish & Quality Gates
- [ ] T019 [P] Lighthouse performance optimization (≥90 mobile score)
- [ ] T020 [P] Accessibility audit with axe-core CLI
- [ ] T021 [P] Update sitemap.xml and rss.xml generation
- [ ] T022 Remove any server-side dependencies
- [ ] T023 Validate constitution compliance (Static-First, TDD, SEO-First, Performance, Security)

## Dependencies
- Tests (T004-T007) before implementation (T008-T014)
- T008 blocks T009, T015
- T016 blocks T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
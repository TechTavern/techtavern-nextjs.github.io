
# Implementation Plan: Pagination Component

**Branch**: `001-the-pagination-component` | **Date**: 2025-09-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-the-pagination-component/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Create a reusable Pagination component for the Tech Tavern static site that displays 15 articles per page with 3 visible page number links. Initially implemented for `/articles/` route with URL-based state management via `?page=N` query parameter. Component must work with static export, handle error cases (invalid/out-of-range pages), and be fully responsive with mobile and accessibility support. Implementation follows TDD approach with comprehensive test coverage.

## Technical Context
**Language/Version**: TypeScript 5.0+ with Next.js 15+ App Router  
**Primary Dependencies**: React 19+, Next.js, Tailwind CSS v4, Zod for validation  
**Storage**: Static MDX files in `content/articles/`, no runtime database  
**Testing**: Jest 30 + React Testing Library, TDD approach mandatory  
**Target Platform**: Static export for GitHub Pages deployment with base path support  
**Project Type**: Single Next.js application with static export  
**Performance Goals**: Lighthouse performance ≥90 mobile, no render-blocking resources  
**Constraints**: Static-first architecture, CSP compliance, mobile responsive  
**Scale/Scope**: Pagination for article collections, reusable across site sections  
**Code Quality**: ESLint Next.js + TypeScript rules enforced, no `any` types allowed, strict TypeScript

**User Context**: The pagination component allows users to browse paginated articles efficiently across different parts of the site, initially for `/articles/` route. It must integrate with existing post loading utilities and follow the PRD specifications for articles pagination (Section 20).

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Static-First Architecture**: ✅ Pagination works with static generation, no runtime dependencies  
**Test-Driven Development**: ✅ TDD approach planned with Jest + RTL, tests written before implementation  
**SEO-First Design**: ✅ Paginated pages include proper canonical URLs, meta tags, and sitemap inclusion  
**Performance-by-Design**: ✅ Client-side only component, minimal JS, no render-blocking impact  
**Security-by-Design**: ✅ URL parameter validation with Zod, CSP compliant, no security risks  
**Code Quality**: ✅ ESLint compliance enforced, TypeScript strict mode, no `any` types in specifications

*No constitutional violations detected. All specifications updated for ESLint compliance.*

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/
│   ├── articles/
│   │   ├── page.tsx                    # Updated to use pagination
│   │   └── page/
│   │       └── [pageNumber]/
│   │           └── page.tsx           # Paginated article pages
│   ├── layout.tsx
│   └── not-found.tsx                 # Error page for invalid pagination
├── components/
│   ├── ui/
│   │   ├── Pagination.tsx             # NEW: Core pagination component
│   │   └── Pagination.test.tsx        # NEW: Component unit tests
│   └── sections/
│       └── ArticlesList.tsx           # Updated to use pagination
├── lib/
│   ├── posts.ts                       # Updated with pagination utilities
│   ├── posts.test.ts                  # Updated with pagination tests
│   ├── pagination.ts                  # NEW: Pagination logic utilities
│   └── pagination.test.ts             # NEW: Pagination utility tests
└── test/
    └── test-utils.tsx                 # Updated with pagination fixtures

content/
└── articles/                          # Existing MDX articles

tests/
├── integration/
│   └── pagination.spec.ts             # NEW: End-to-end pagination tests
└── accessibility.spec.js             # Updated with pagination a11y tests
```

**Structure Decision**: Single Next.js project structure following the existing Tech Tavern codebase organization. Pagination component goes in `src/components/ui/` as a reusable component, with supporting utilities in `src/lib/` and comprehensive test coverage following the established patterns.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base template
- Generate TDD-ordered tasks from Phase 1 design artifacts:
  - Pagination utility functions from `contracts/interfaces.ts` → test + implementation tasks
  - Pagination component from `data-model.md` → component test + implementation tasks  
  - Posts integration from `quickstart.md` → integration test + implementation tasks
  - Next.js page implementations → page test + implementation tasks
  - Error handling and 404 pages → error handling test + implementation tasks

**Ordering Strategy**:
- **TDD Mandatory**: All test tasks before corresponding implementation tasks
- **Dependency Order**: 
  1. Utility tests + implementations (foundation layer)
  2. Component tests + implementations (UI layer) 
  3. Integration tests + implementations (page layer)
  4. End-to-end tests + final validation
- **Parallel Execution**: Mark [P] for independent test files and utility functions
- **Sequential Requirements**: UI components depend on utilities, pages depend on components

**Estimated Task Breakdown**:
- **Tests**: 8-10 test creation tasks (utilities, component, integration, e2e)
- **Implementation**: 8-10 implementation tasks to make tests pass
- **Integration**: 4-6 tasks for Next.js pages and routing
- **Validation**: 3-4 tasks for accessibility, performance, and deployment verification
- **Total**: 23-30 numbered, ordered tasks in tasks.md

**Key Task Categories**:
1. **Pagination Utilities** [P]: Core logic functions with comprehensive test coverage
2. **React Component** [P]: UI component with accessibility and responsive tests  
3. **Posts Integration**: Extensions to existing post loading system
4. **Next.js Pages**: Route implementations with static generation
5. **Error Handling**: 404 pages and parameter validation
6. **Performance & A11y**: Lighthouse and axe-core validation tasks

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none needed)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*

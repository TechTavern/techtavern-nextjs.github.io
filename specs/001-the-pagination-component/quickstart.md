# Quickstart Guide: Pagination Component

## Overview
This guide provides step-by-step instructions for implementing and testing the pagination component for the Tech Tavern website. Follow this guide to ensure proper implementation of the specification requirements.

## Prerequisites
- Node.js 20+ installed
- Tech Tavern repository cloned locally
- Basic understanding of Next.js App Router and TypeScript

## Development Workflow

### Step 1: Set Up Test Environment
```bash
# Ensure you're on the feature branch
git checkout 001-the-pagination-component

# Install dependencies (if not already done)
npm install

# Run existing tests to ensure baseline
npm run test
npm run typecheck
npm run lint
```

**⚠️ ESLint Compliance Requirements**:
- NO use of `any` type - use `unknown` or proper generics instead
- Follow Next.js + TypeScript ESLint rules strictly
- All code must pass `npm run lint` before implementation
- TypeScript strict mode enforced throughout

### Step 2: Follow TDD Approach
**IMPORTANT**: Write tests BEFORE implementation (constitutional requirement).

```bash
# Create test files first
touch src/lib/pagination.test.ts
touch src/components/ui/Pagination.test.tsx
touch src/lib/posts.test.ts  # Add pagination tests
```

**Test-First Development Order**:
1. Write failing tests for pagination utilities
2. Write failing tests for pagination component
3. Write failing tests for posts integration
4. Implement utilities to make tests pass
5. Implement component to make tests pass
6. Implement integration to make tests pass

### Step 3: Implement Core Pagination Utilities

**File**: `src/lib/pagination.ts`

```typescript
// Start with failing tests, then implement these functions:

export function getPaginationData<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number = 15
): PaginationData<T> {
  // Implementation makes tests pass
}

export function validatePageParameter(
  pageParam: string | string[] | undefined,
  totalPages: number
): PageParameter {
  // Implementation makes tests pass
}

export function generatePaginationLinks(
  currentPage: number,
  totalPages: number,
  maxVisibleLinks: number = 3
): PaginationLinks {
  // Implementation makes tests pass
}
```

**Test Coverage Requirements**:
- ✅ Empty arrays (0 items)
- ✅ Single page (≤15 items)
- ✅ Multiple pages (>15 items)
- ✅ Edge cases (exactly 15, 16 items)
- ✅ Invalid page parameters
- ✅ Page out of range scenarios

### Step 4: Implement Pagination Component

**File**: `src/components/ui/Pagination.tsx`

```tsx
// Test-driven implementation approach:
interface PaginationProps<T = unknown> {
  data: PaginationData<T>;
  onPageChange: (page: number) => void;
  config?: Partial<PaginationConfig>;
  className?: string;
  'aria-label'?: string;
}

export function Pagination<T = unknown>({ data, onPageChange, config, ...props }: PaginationProps<T>) {
  // Implementation guided by failing tests
}
```

**Component Test Requirements**:
- ✅ Renders previous/next buttons correctly
- ✅ Disables buttons appropriately (first/last page)
- ✅ Displays correct page numbers
- ✅ Handles click events properly
- ✅ Applies accessibility attributes
- ✅ Responsive behavior (mobile/desktop)
- ✅ Keyboard navigation support

### Step 5: Extend Posts Utilities

**File**: `src/lib/posts.ts` (extend existing)

```typescript
// Add these functions to existing posts.ts:

export async function getPaginatedPosts(
  page: number = 1,
  itemsPerPage: number = 15
): Promise<PaginationData<PostMeta>> {
  // Use existing getAllPosts() + new pagination utilities
}

export async function generatePaginationParams(
  itemsPerPage: number = 15
): Promise<{ pageNumber: string }[]> {
  // Generate static params for Next.js
}
```

### Step 6: Implement Next.js Pages

**File**: `src/app/articles/page.tsx` (modify existing)

```tsx
// Update existing articles page to show paginated results
export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const pageParam = searchParams.page;
  const pageNumber = parseInt(pageParam || '1', 10);
  
  // Validate page parameter
  // Get paginated posts
  // Render with pagination component
}
```

**File**: `src/app/articles/page/[pageNumber]/page.tsx` (new)

```tsx
// New file for paginated routes
export async function generateStaticParams() {
  return await generatePaginationParams();
}

export default async function PaginatedArticlesPage({ params }: PaginationPageProps) {
  // Similar to main articles page but uses params.pageNumber
}
```

### Step 7: Error Handling Implementation

**File**: `src/app/not-found.tsx` (enhance existing)

```tsx
// Ensure not-found page handles pagination errors appropriately
// Add context for pagination-specific 404s
```

**Error Handling Requirements**:
- ✅ Invalid page format (`?page=abc`) → 404
- ✅ Page out of range (`?page=999`) → 404  
- ✅ Negative pages (`?page=-1`) → 404
- ✅ Zero page (`?page=0`) → 404

### Step 8: Mobile and Accessibility

**Responsive Implementation**:
```css
/* Tailwind classes for responsive pagination */
.pagination-container {
  /* Mobile: show only prev/next + current page */
  @apply flex items-center justify-center space-x-2;
}

.pagination-links {
  /* Hide numbered links on mobile, show on tablet+ */
  @apply hidden md:flex;
}

.pagination-button {
  /* Minimum 44px touch target for mobile */
  @apply min-w-[44px] min-h-[44px] flex items-center justify-center;
}
```

**Accessibility Requirements**:
- ✅ ARIA labels and landmarks
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ Current page indication (`aria-current="page"`)

### Step 9: Integration Testing

**File**: `tests/pagination.spec.ts` (new integration test)

```typescript
// Playwright integration tests
test.describe('Pagination Integration', () => {
  test('should navigate between paginated article pages', async ({ page }) => {
    // Test navigation flow
  });
  
  test('should handle invalid page parameters', async ({ page }) => {
    // Test error conditions
  });
  
  test('should be accessible via keyboard', async ({ page }) => {
    // Test accessibility requirements
  });
});
```

### Step 10: Performance Validation

**Build and Performance Checks**:
```bash
# Build static site with pagination
npm run build

# Verify pagination pages are generated
ls out/articles/page/  # Should show 2/, 3/, etc.

# Check bundle size impact
npm run build && ls -la out/_next/static/chunks/

# Run lighthouse on paginated pages
npm run test:a11y  # Includes pagination pages
```

## Validation Checklist

### Functional Requirements (from spec.md)
- [ ] **FR-001**: Pagination controls only appear when >15 articles
- [ ] **FR-002**: Previous/Next buttons rendered
- [ ] **FR-003**: Numbered page links displayed (max 3)
- [ ] **FR-004**: Page number in URL as `?page=N`
- [ ] **FR-005**: Default to page 1 when no parameter
- [ ] **FR-006**: Display correct subset of articles per page
- [ ] **FR-007**: Update URL without page reload
- [ ] **FR-008**: Show 404 for invalid page parameters
- [ ] **FR-009**: Disable Previous button on page 1
- [ ] **FR-010**: Disable Next button on last page
- [ ] **FR-011**: Component works with any array of items
- [ ] **FR-012**: Display 15 itemsPerPage
- [ ] **FR-013**: Limit to 3 visible page links
- [ ] **FR-014**: Show 404 for pages exceeding total
- [ ] **FR-015**: Same page number shows updated content when articles change
- [ ] **FR-016**: Mobile responsive with touch-friendly controls
- [ ] **FR-017**: Adaptive page links on smaller screens
- [ ] **FR-018**: Keyboard and screen reader accessible

### User Scenarios Validation
- [ ] **Scenario 1**: >15 articles shows pagination
- [ ] **Scenario 2**: Next button navigates correctly
- [ ] **Scenario 3**: Previous button navigates correctly
- [ ] **Scenario 4**: Direct page link navigation works
- [ ] **Scenario 5**: Direct URL with ?page=3 works
- [ ] **Scenario 6**: ≤15 articles hides pagination
- [ ] **Scenario 7**: Mobile touch navigation works
- [ ] **Scenario 8**: Screen reader navigation works

### Technical Validation
- [ ] **Static Export**: All pagination pages generated in `out/`
- [ ] **SEO**: Canonical URLs correct for each page
- [ ] **Performance**: Lighthouse score ≥90 maintained
- [ ] **Accessibility**: axe-core tests pass
- [ ] **Type Safety**: TypeScript compilation with no errors
- [ ] **ESLint Compliance**: All code passes `npm run lint` with no violations
- [ ] **Code Quality**: No `any` types used, proper generics and `unknown` instead
- [ ] **Test Coverage**: All critical paths covered
- [ ] **Error Handling**: Invalid URLs show proper 404

## Troubleshooting

### Common Issues

**Pagination not showing**: 
- Check if article count >15
- Verify pagination component is imported
- Check console for JavaScript errors

**404 errors on valid pages**:
- Verify `generateStaticParams()` is implemented
- Check if pages are generated in build output
- Validate page parameter parsing logic

**Accessibility failures**:
- Ensure ARIA attributes are present
- Test keyboard navigation manually
- Run screen reader testing

**Mobile responsiveness issues**:
- Test on actual mobile devices
- Verify touch target sizes ≥44px
- Check responsive breakpoint behavior

### Debug Commands
```bash
# Check generated pages
find out/articles -name "*.html" | head -10

# Validate pagination data
npm test -- --testNamePattern="pagination"

# Check accessibility
npm run test:a11y

# Monitor build output
npm run build 2>&1 | grep -i "page"
```

## Success Criteria
✅ All functional requirements implemented and tested  
✅ All user scenarios validated  
✅ Constitutional requirements met (Static-first, TDD, SEO, Performance, Security)  
✅ Comprehensive test coverage >90%  
✅ Accessibility compliance verified  
✅ Mobile responsiveness confirmed  
✅ Integration with existing codebase seamless  

## Next Steps
After completing this quickstart guide:
1. Code review with focus on constitutional compliance
2. QA testing across different devices and browsers
3. Performance monitoring post-deployment
4. User feedback collection and iteration

## Resources
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tech Tavern Constitution](../../.specify/memory/constitution.md)
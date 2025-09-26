# Pagination Component Contracts

## Overview
This document defines the TypeScript interfaces and function contracts for the pagination component. These contracts serve as the API specification between different parts of the pagination system.

## Core Function Contracts

### getPaginationData
Calculates pagination state from array of items and page parameters.

```typescript
interface GetPaginationDataContract<T> {
  // Input
  items: T[];
  currentPage: number;
  itemsPerPage: number;
  
  // Output
  returns: PaginationData<T>;
  
  // Behavior
  validates: {
    currentPage: "Must be >= 1";
    itemsPerPage: "Must be > 0";
    items: "Must be valid array";
  };
  
  throws: {
    InvalidPageError: "When currentPage exceeds available pages";
    InvalidConfigError: "When itemsPerPage <= 0";
  };
}
```

**Test Contract**: Must handle edge cases
- Empty items array → totalPages = 0
- currentPage > totalPages → throw InvalidPageError
- itemsPerPage = 1 → each item gets own page
- Large arrays → efficient slicing operation

### validatePageParameter
Validates and parses URL page parameter.

```typescript
interface ValidatePageParameterContract {
  // Input
  pageParam: string | string[] | undefined;
  totalPages: number;
  
  // Output
  returns: PageParameter;
  
  // Behavior
  handles: {
    undefined: "Returns { parsed: 1, isValid: true, errorType: null }";
    "1": "Returns { parsed: 1, isValid: true, errorType: null }";
    "abc": "Returns { parsed: null, isValid: false, errorType: 'INVALID_FORMAT' }";
    "999": "Returns { parsed: null, isValid: false, errorType: 'OUT_OF_RANGE' }";
    "-1": "Returns { parsed: null, isValid: false, errorType: 'INVALID_FORMAT' }";
    "0": "Returns { parsed: null, isValid: false, errorType: 'INVALID_FORMAT' }";
  };
}
```

**Test Contract**: Must validate all parameter formats
- String numbers: "1", "2", "10"
- Invalid strings: "abc", "1.5", ""
- Array parameters (Next.js edge case)
- Boundary conditions: 1, totalPages, totalPages + 1

### generatePaginationLinks
Computes visible page links for UI rendering.

```typescript
interface GeneratePaginationLinksContract {
  // Input
  currentPage: number;
  totalPages: number;
  maxVisibleLinks: number;
  
  // Output
  returns: PaginationLinks;
  
  // Behavior
  algorithms: {
    centerCurrent: "Keep current page in center when possible";
    handleBoundaries: "Adjust when near first/last pages";
    ellipsisLogic: "Show ... when gaps > ellipsisThreshold";
  };
  
  examples: {
    "currentPage=1, totalPages=5, maxVisible=3": {
      visiblePages: [1, 2, 3];
      showStartEllipsis: false;
      showEndEllipsis: true;
    };
    "currentPage=3, totalPages=10, maxVisible=3": {
      visiblePages: [2, 3, 4];
      showStartEllipsis: true;
      showEndEllipsis: true;
    };
  };
}
```

**Test Contract**: Must handle pagination UI logic
- Total pages <= max visible → show all pages
- Current page at boundaries → adjust visible range
- Ellipsis calculation → consistent behavior
- Single page → hide pagination entirely

## Component Contracts

### Pagination Component Props
React component interface for pagination UI.

```typescript
interface PaginationComponentContract<T = unknown> {
  // Required Props
  data: PaginationData<T>;
  onPageChange: (page: number) => void;
  
  // Optional Props
  config?: Partial<PaginationConfig>;
  className?: string;
  'aria-label'?: string;
  
  // Behavior Contracts
  renders: {
    previousButton: "Disabled when hasPreviousPage=false";
    nextButton: "Disabled when hasNextPage=false";
    pageLinks: "Array of numbered page buttons";
    currentPage: "Highlighted with aria-current='page'";
    screenReaderText: "Hidden text for context";
  };
  
  accessibility: {
    keyboardNav: "Arrow keys, Enter, Space navigation";
    screenReader: "Proper ARIA labels and landmarks";
    focusManagement: "Focus persists through page changes";
  };
  
  responsive: {
    mobile: "Shows prev/next + current page indicator";
    tablet: "Shows prev/next + limited page links";
    desktop: "Shows full pagination with all configured links";
  };
}
```

**Test Contract**: Must verify component behavior
- Props validation and defaults
- Event handler calls with correct parameters
- ARIA attributes and accessibility
- Responsive behavior across breakpoints
- Keyboard navigation patterns

### Articles Page Integration
Next.js page component integration contract.

```typescript
interface ArticlesPageContract {
  // Route Parameters
  params: {};
  searchParams: { page?: string };
  
  // Static Generation
  generateStaticParams: () => { pageNumber: string }[];
  
  // Page Rendering
  renders: {
    articlesList: "First 15 articles for page 1";
    paginationControls: "When totalArticles > 15";
    emptyState: "When no articles exist";
  };
  
  // Navigation Behavior
  handles: {
    validPageParam: "Render articles for specified page";
    invalidPageParam: "Call notFound() to show 404";
    missingPageParam: "Default to page 1";
  };
  
  // SEO Requirements
  metadata: {
    title: "Page-specific titles with page numbers";
    canonical: "Proper canonical URLs for each page";
    robots: "Index all pagination pages";
  };
}
```

**Test Contract**: Must verify page functionality
- Static parameter generation for all valid pages
- Correct article filtering per page
- 404 handling for invalid pages
- Metadata generation per page
- Integration with existing article loading

## Error Handling Contracts

### InvalidPageError
Custom error for pagination boundary violations.

```typescript
interface InvalidPageErrorContract extends Error {
  name: "InvalidPageError";
  message: string;
  code: "PAGE_OUT_OF_RANGE" | "PAGE_INVALID_FORMAT";
  context: {
    requestedPage: number | string;
    totalPages: number;
    validRange: string;
  };
}
```

### NotFoundBehavior
Next.js not-found handling for pagination errors.

```typescript
interface NotFoundBehaviorContract {
  triggers: {
    invalidPageFormat: "?page=abc, ?page=-1";
    pageOutOfRange: "?page=999 when only 5 pages exist";
    negativePages: "?page=0, ?page=-5";
  };
  
  response: {
    statusCode: 404;
    page: "Custom not-found.tsx with pagination context";
    seo: "Proper 404 headers and no-index directive";
  };
}
```

## Performance Contracts

### Static Generation Requirements
Build-time performance contracts.

```typescript
interface StaticGenerationContract {
  // Build Performance
  constraints: {
    maxPagesGenerated: 100; // Reasonable limit for articles
    buildTimeIncrease: "<10% per additional page";
    memoryUsage: "Linear growth with page count";
  };
  
  // Runtime Performance
  guarantees: {
    pageLoadTime: "No additional JS for pagination logic";
    bundleSize: "~2-3KB addition for pagination component";
    renderTime: "No blocking operations in pagination";
  };
  
  // SEO Performance
  outputs: {
    sitemapEntries: "All paginated pages included";
    canonicalUrls: "Proper rel=canonical for each page";
    metaTags: "Page-specific titles and descriptions";
  };
}
```

## Testing Contracts

### Unit Test Coverage Requirements
Minimum test coverage contracts for each module.

```typescript
interface TestCoverageContract {
  // Pagination Utilities
  "src/lib/pagination.ts": {
    coverage: ">= 95%";
    testCategories: ["happy path", "edge cases", "error conditions"];
    mockingStrategy: "Pure functions - no mocking needed";
  };
  
  // Pagination Component
  "src/components/ui/Pagination.tsx": {
    coverage: ">= 90%";
    testCategories: ["rendering", "interactions", "accessibility", "responsive"];
    mockingStrategy: "Mock onPageChange callback";
  };
  
  // Posts Integration
  "src/lib/posts.ts": {
    coverage: ">= 85%";
    testCategories: ["pagination integration", "data consistency"];
    mockingStrategy: "Mock filesystem for MDX parsing";
  };
}
```

### Integration Test Requirements
End-to-end behavior verification contracts.

```typescript
interface IntegrationTestContract {
  // Navigation Flow
  paginationNavigation: {
    scenario: "Click through multiple pages";
    verifies: ["URL updates", "content changes", "state persistence"];
    browsers: ["Chrome", "Firefox", "Safari", "Mobile"];
  };
  
  // Accessibility Flow
  keyboardNavigation: {
    scenario: "Navigate pagination using only keyboard";
    verifies: ["focus management", "ARIA announcements", "screen reader compatibility"];
    tools: ["axe-core", "screen reader simulation"];
  };
  
  // Error Handling Flow
  errorConditions: {
    scenario: "Test invalid URL parameters";
    verifies: ["404 page display", "proper error messaging", "navigation recovery"];
    conditions: ["?page=abc", "?page=999", "?page=-1"];
  };
}
```
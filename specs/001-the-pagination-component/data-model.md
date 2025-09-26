# Phase 1: Data Model - Pagination Component

## Core Entities

### PaginationData
Represents the computed pagination state for a given dataset.

**Fields**:
- `currentPage: number` - Current active page (1-based)
- `totalPages: number` - Total number of pages available
- `totalItems: number` - Total number of items in the dataset
- `itemsPerPage: number` - Number of items displayed per page
- `startIndex: number` - Starting index for current page items (0-based)
- `endIndex: number` - Ending index for current page items (0-based)
- `hasNextPage: boolean` - Whether a next page exists
- `hasPreviousPage: boolean` - Whether a previous page exists
- `pageItems: T[]` - Items to display on the current page

**Validation Rules**:
- `currentPage` must be >= 1 and <= `totalPages`
- `itemsPerPage` must be > 0
- `totalItems` must be >= 0
- `totalPages` calculated as `Math.ceil(totalItems / itemsPerPage)`

**State Transitions**:
- Navigate Next: `currentPage` increments by 1 (if `hasNextPage`)
- Navigate Previous: `currentPage` decrements by 1 (if `hasPreviousPage`)
- Jump to Page: `currentPage` sets to target page (if valid)

### PaginationConfig
Configuration settings for pagination behavior.

**Fields**:
- `itemsPerPage: number` - Items per page (default: 15)
- `maxVisiblePageLinks: number` - Maximum page numbers to show (default: 3)
- `showFirstLastButtons: boolean` - Whether to show "First"/"Last" buttons
- `showPreviousNextButtons: boolean` - Whether to show "Previous"/"Next" buttons
- `ellipsisThreshold: number` - When to show ellipsis (...) in page links

**Validation Rules**:
- `itemsPerPage` must be between 1 and 100
- `maxVisiblePageLinks` must be between 1 and 10
- All boolean fields default to appropriate values

### PaginationLinks
Represents the computed page links for UI rendering.

**Fields**:
- `visiblePages: number[]` - Array of page numbers to display as links
- `showStartEllipsis: boolean` - Whether to show "..." before visible pages
- `showEndEllipsis: boolean` - Whether to show "..." after visible pages
- `firstPage: number` - Always 1
- `lastPage: number` - Equal to `totalPages`

**Computation Logic**:
```typescript
// For maxVisiblePageLinks = 3, currentPage = 5, totalPages = 10
// Result: visiblePages = [4, 5, 6], showStartEllipsis = true, showEndEllipsis = true
```

### PageParameter
Represents and validates URL page parameters.

**Fields**:
- `raw: string | null` - Raw URL parameter value
- `parsed: number | null` - Parsed integer value
- `isValid: boolean` - Whether the parameter is valid
- `errorType: 'INVALID_FORMAT' | 'OUT_OF_RANGE' | 'MISSING' | null`

**Validation Rules**:
- Must be parseable as positive integer
- Must be within valid page range (1 to totalPages)
- Null/undefined defaults to page 1

## Relationships

### PostMeta ↔ PaginationData
- `PostMeta[]` array is input to pagination calculations
- `PaginationData.pageItems` contains subset of `PostMeta[]` for current page
- Maintains existing `PostMeta` interface from `src/lib/posts.ts`

### PaginationConfig → PaginationData
- Configuration provides parameters for pagination calculations
- Same config can be reused across different content types
- Allows global pagination behavior customization

### PaginationData → PaginationLinks
- Links are computed from pagination data
- Links determine UI rendering of page numbers
- Responsive behavior affects link visibility

## Zod Schemas

### PaginationDataSchema
```typescript
const PaginationDataSchema = z.object({
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalItems: z.number().int().min(0),
  itemsPerPage: z.number().int().min(1),
  startIndex: z.number().int().min(0),
  endIndex: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  pageItems: z.array(z.any()), // Generic array for reusability
});
```

### PaginationConfigSchema
```typescript
const PaginationConfigSchema = z.object({
  itemsPerPage: z.number().int().min(1).max(100).default(15),
  maxVisiblePageLinks: z.number().int().min(1).max(10).default(3),
  showFirstLastButtons: z.boolean().default(false),
  showPreviousNextButtons: z.boolean().default(true),
  ellipsisThreshold: z.number().int().min(1).default(2),
});
```

### PageParameterSchema
```typescript
const PageParameterSchema = z.object({
  raw: z.string().nullable(),
  parsed: z.number().int().min(1).nullable(),
  isValid: z.boolean(),
  errorType: z.enum(['INVALID_FORMAT', 'OUT_OF_RANGE', 'MISSING']).nullable(),
});
```

## State Management

### URL State Synchronization
- Page number maintained in URL query parameter `?page=N`
- Next.js `useSearchParams()` for reading current page
- Next.js `useRouter().push()` for updating page
- Static generation supports all valid page URLs

### Error State Handling
- Invalid page parameters trigger Next.js `notFound()`
- Page numbers exceeding total pages show 404
- Graceful degradation when JavaScript disabled

### Responsive State
- Mobile viewport affects `maxVisiblePageLinks`
- CSS media queries adjust pagination layout
- Touch-friendly button sizing on mobile devices

## Performance Considerations

### Static Generation
- All valid pagination URLs pre-generated at build time
- No runtime computation for page existence
- SEO-optimized with proper canonical URLs

### Memory Efficiency
- Pagination utilities use lazy evaluation
- Only compute current page items, not all pages
- Minimal state stored in component

### Caching Strategy
- Static pages leverage CDN caching
- Client-side navigation uses Next.js prefetching
- No runtime data fetching required

## Integration Points

### Existing Codebase
```typescript
// Extends existing posts.ts utilities
export function getPaginatedPosts(page: number): PaginationData<PostMeta>
export function generatePaginationParams(): { pageNumber: string }[]
```

### Component Architecture
```typescript
// Reusable pagination component
<Pagination 
  data={paginationData}
  config={paginationConfig}
  onPageChange={(page) => router.push(`/articles?page=${page}`)}
/>
```

### Testing Integration
- Unit tests for all data transformations
- Integration tests for URL parameter handling  
- Accessibility tests for component behavior
- Visual regression tests for responsive layouts
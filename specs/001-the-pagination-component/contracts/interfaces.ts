/**
 * TypeScript Interface Definitions for Pagination Component
 * 
 * These interfaces define the type contracts for the pagination system.
 * They serve as the single source of truth for type checking and API consistency.
 */

// ============================================================================
// Core Data Structures
// ============================================================================

/**
 * Represents the complete pagination state for a dataset
 */
export interface PaginationData<T = any> {
  /** Current active page number (1-based) */
  currentPage: number;
  
  /** Total number of pages available */
  totalPages: number;
  
  /** Total number of items in the complete dataset */
  totalItems: number;
  
  /** Number of items displayed per page */
  itemsPerPage: number;
  
  /** Starting index for current page items (0-based) */
  startIndex: number;
  
  /** Ending index for current page items (0-based, exclusive) */
  endIndex: number;
  
  /** Whether a next page exists */
  hasNextPage: boolean;
  
  /** Whether a previous page exists */
  hasPreviousPage: boolean;
  
  /** Items to display on the current page */
  pageItems: T[];
}

/**
 * Configuration options for pagination behavior
 */
export interface PaginationConfig {
  /** Number of items to display per page */
  itemsPerPage: number;
  
  /** Maximum number of page links to show in UI */
  maxVisiblePageLinks: number;
  
  /** Whether to show First/Last navigation buttons */
  showFirstLastButtons: boolean;
  
  /** Whether to show Previous/Next navigation buttons */
  showPreviousNextButtons: boolean;
  
  /** Threshold for showing ellipsis (...) in page links */
  ellipsisThreshold: number;
}

/**
 * Computed page links for UI rendering
 */
export interface PaginationLinks {
  /** Array of page numbers to display as clickable links */
  visiblePages: number[];
  
  /** Whether to show "..." before the visible pages */
  showStartEllipsis: boolean;
  
  /** Whether to show "..." after the visible pages */
  showEndEllipsis: boolean;
  
  /** First page number (always 1) */
  firstPage: number;
  
  /** Last page number (equal to totalPages) */
  lastPage: number;
}

/**
 * Validated URL page parameter
 */
export interface PageParameter {
  /** Raw URL parameter value */
  raw: string | null;
  
  /** Parsed integer value (null if invalid) */
  parsed: number | null;
  
  /** Whether the parameter is valid */
  isValid: boolean;
  
  /** Type of validation error, if any */
  errorType: 'INVALID_FORMAT' | 'OUT_OF_RANGE' | 'MISSING' | null;
}

// ============================================================================
// Function Interfaces
// ============================================================================

/**
 * Calculates pagination data from an array of items
 */
export interface GetPaginationDataFunction {
  <T>(
    items: T[],
    currentPage: number,
    itemsPerPage: number
  ): PaginationData<T>;
}

/**
 * Validates and parses URL page parameter
 */
export interface ValidatePageParameterFunction {
  (
    pageParam: string | string[] | undefined,
    totalPages: number
  ): PageParameter;
}

/**
 * Generates visible page links for pagination UI
 */
export interface GeneratePaginationLinksFunction {
  (
    currentPage: number,
    totalPages: number,
    maxVisibleLinks: number
  ): PaginationLinks;
}

/**
 * Generates static parameters for Next.js static generation
 */
export interface GenerateStaticPaginationParamsFunction {
  (
    totalItems: number,
    itemsPerPage: number
  ): { pageNumber: string }[];
}

// ============================================================================
// Component Interfaces
// ============================================================================

/**
 * Props for the Pagination React component
 */
export interface PaginationProps {
  /** Pagination state data */
  data: PaginationData<any>;
  
  /** Callback when user navigates to a different page */
  onPageChange: (page: number) => void;
  
  /** Optional configuration overrides */
  config?: Partial<PaginationConfig>;
  
  /** Additional CSS classes */
  className?: string;
  
  /** ARIA label for the pagination navigation */
  'aria-label'?: string;
  
  /** Whether pagination is currently disabled */
  disabled?: boolean;
}

/**
 * Props for pagination-aware article list component
 */
export interface PaginatedArticlesProps {
  /** Current page number */
  page: number;
  
  /** Total number of articles */
  totalArticles: number;
  
  /** Articles to display on current page */
  articles: PostMeta[];
  
  /** Base URL for pagination navigation */
  baseUrl: string;
}

// ============================================================================
// Next.js Page Interfaces
// ============================================================================

/**
 * Next.js page props for paginated articles
 */
export interface ArticlesPageProps {
  params: {};
  searchParams: {
    page?: string;
  };
}

/**
 * Next.js page props for specific pagination page
 */
export interface PaginationPageProps {
  params: {
    pageNumber: string;
  };
  searchParams: {};
}

// ============================================================================
// Error Interfaces
// ============================================================================

/**
 * Custom error for pagination-related issues
 */
export interface InvalidPageError extends Error {
  name: 'InvalidPageError';
  code: 'PAGE_OUT_OF_RANGE' | 'PAGE_INVALID_FORMAT';
  context: {
    requestedPage: number | string;
    totalPages: number;
    validRange: string;
  };
}

// ============================================================================
// Utility Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid pagination data object
 */
export interface IsPaginationDataFunction {
  <T>(value: any): value is PaginationData<T>;
}

/**
 * Type guard to check if a page parameter is valid
 */
export interface IsValidPageParameterFunction {
  (param: PageParameter): param is PageParameter & { parsed: number };
}

// ============================================================================
// Integration Interfaces
// ============================================================================

/**
 * Extended PostMeta interface for pagination integration
 */
export interface PostMeta {
  // Existing fields from src/lib/posts.ts
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
  readingTimeMinutes?: number;
  year: number;
  month: number;
  day: number;
  url: string;
  // No additional fields needed for pagination
}

/**
 * Pagination-enhanced posts utilities
 */
export interface PaginatedPostsUtilities {
  /** Get paginated posts for a specific page */
  getPaginatedPosts: (page: number, itemsPerPage?: number) => Promise<PaginationData<PostMeta>>;
  
  /** Get total number of pages for all posts */
  getTotalPages: (itemsPerPage?: number) => Promise<number>;
  
  /** Generate static params for all pagination pages */
  generatePaginationParams: (itemsPerPage?: number) => Promise<{ pageNumber: string }[]>;
  
  /** Get posts for a specific page (synchronous) */
  getPostsForPage: (
    posts: PostMeta[],
    page: number,
    itemsPerPage: number
  ) => PostMeta[];
}

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Default pagination configuration values
 */
export interface PaginationConstants {
  /** Default number of articles per page (from spec clarifications) */
  readonly DEFAULT_ARTICLES_PER_PAGE: 15;
  
  /** Default maximum visible page links (from spec clarifications) */
  readonly DEFAULT_MAX_VISIBLE_LINKS: 3;
  
  /** Default ellipsis threshold */
  readonly DEFAULT_ELLIPSIS_THRESHOLD: 2;
  
  /** Minimum touch target size for mobile (44px) */
  readonly MIN_TOUCH_TARGET_SIZE: 44;
  
  /** Maximum reasonable items per page */
  readonly MAX_ITEMS_PER_PAGE: 100;
  
  /** Maximum reasonable total pages for static generation */
  readonly MAX_STATIC_PAGES: 100;
}

// ============================================================================
// Testing Interfaces
// ============================================================================

/**
 * Test utilities for pagination component testing
 */
export interface PaginationTestUtilities {
  /** Create mock pagination data for testing */
  createMockPaginationData: <T>(
    overrides?: Partial<PaginationData<T>>
  ) => PaginationData<T>;
  
  /** Create mock page parameter for testing */
  createMockPageParameter: (
    overrides?: Partial<PageParameter>
  ) => PageParameter;
  
  /** Create array of mock posts for pagination testing */
  createMockPosts: (count: number) => PostMeta[];
}

/**
 * Test scenarios for pagination functionality
 */
export interface PaginationTestScenarios {
  /** Happy path test cases */
  happyPath: {
    singlePage: () => void;
    multiplePages: () => void;
    navigation: () => void;
  };
  
  /** Edge case test scenarios */
  edgeCases: {
    emptyDataset: () => void;
    singleItem: () => void;
    exactPageBoundary: () => void;
  };
  
  /** Error condition test scenarios */
  errorConditions: {
    invalidPageParameter: () => void;
    pageOutOfRange: () => void;
    negativePageNumber: () => void;
  };
}

// ============================================================================
// Export Default Configuration
// ============================================================================

/**
 * Default pagination configuration
 */
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  itemsPerPage: 15,
  maxVisiblePageLinks: 3,
  showFirstLastButtons: false,
  showPreviousNextButtons: true,
  ellipsisThreshold: 2,
};

/**
 * Type for pagination component ref
 */
export interface PaginationRef {
  /** Focus the pagination component */
  focus: () => void;
  
  /** Get current pagination state */
  getCurrentState: () => PaginationData<any>;
  
  /** Programmatically navigate to a page */
  goToPage: (page: number) => void;
}
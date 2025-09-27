export type PaginationErrorType = 'INVALID_FORMAT' | 'OUT_OF_RANGE' | 'MISSING';

export interface PaginationData<T = unknown> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageItems: T[];
}

export interface PaginationConfig {
  itemsPerPage: number;
  maxVisiblePageLinks: number;
  showFirstLastButtons: boolean;
  showPreviousNextButtons: boolean;
  ellipsisThreshold: number;
}

export interface PaginationLinks {
  visiblePages: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  firstPage: number;
  lastPage: number;
}

export interface PageParameter {
  raw: string | null;
  parsed: number | null;
  isValid: boolean;
  errorType: PaginationErrorType | null;
}

export interface PaginationConstants {
  readonly defaultItemsPerPage: number;
  readonly maxVisiblePageLinks: number;
  readonly showFirstLastButtons: boolean;
  readonly showPreviousNextButtons: boolean;
  readonly ellipsisThreshold: number;
  readonly minTouchTargetSize: number;
}

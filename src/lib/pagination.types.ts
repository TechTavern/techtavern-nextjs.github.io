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

export interface PaginationLinks {
  visiblePages: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  firstPage: number;
  lastPage: number;
}

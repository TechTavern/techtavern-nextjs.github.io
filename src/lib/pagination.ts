import { paginationSettings } from '@/lib/site';
import type { PaginationData, PaginationLinks } from '@/lib/pagination.types';

export class InvalidPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPageError';
  }
}

export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}

function assertPositiveInteger(value: number, message: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new InvalidConfigError(message);
  }
}

function createPageRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getPaginationData<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number = paginationSettings.defaultItemsPerPage,
): PaginationData<T> {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }

  assertPositiveInteger(itemsPerPage, 'itemsPerPage must be a positive integer');

  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / itemsPerPage);

  if (!Number.isInteger(currentPage) || currentPage <= 0) {
    throw new InvalidPageError('Invalid current page');
  }

  if (currentPage > totalPages) {
    throw new InvalidPageError('Page out of range');
  }

  const startIndex = Math.min((currentPage - 1) * itemsPerPage, Math.max(totalItems - 1, 0));
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageItems = items.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages && totalItems > 0,
    hasPreviousPage: currentPage > 1,
    pageItems,
  };
}

export function generatePaginationLinks(
  currentPage: number,
  totalPages: number,
  maxVisibleLinks: number = paginationSettings.maxVisiblePageLinks,
  _ellipsisThreshold: number = paginationSettings.ellipsisThreshold,
): PaginationLinks {
  assertPositiveInteger(maxVisibleLinks, 'maxVisibleLinks must be a positive integer');
  assertPositiveInteger(_ellipsisThreshold, 'ellipsisThreshold must be a positive integer');

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const visibleCount = Math.min(maxVisibleLinks, safeTotalPages);

  const halfWindow = Math.floor(visibleCount / 2);
  let start = Math.max(safeCurrentPage - halfWindow, 1);
  let end = start + visibleCount - 1;

  if (end > safeTotalPages) {
    end = safeTotalPages;
    start = Math.max(end - visibleCount + 1, 1);
  }

  const visiblePages = createPageRange(start, end);

  const showStartEllipsis = start > 1;
  const showEndEllipsis = end < safeTotalPages;

  return {
    visiblePages,
    showStartEllipsis,
    showEndEllipsis,
    firstPage: 1,
    lastPage: safeTotalPages,
  };
}


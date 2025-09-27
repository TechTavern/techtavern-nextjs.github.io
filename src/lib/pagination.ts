import { paginationSettings } from '@/lib/site';
import type {
  PageParameter,
  PaginationConfig,
  PaginationData,
  PaginationErrorType,
  PaginationLinks,
} from '@/lib/pagination.types';

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

function normalizeConfig(config?: Partial<PaginationConfig>): PaginationConfig {
  return {
    itemsPerPage: config?.itemsPerPage ?? paginationSettings.defaultItemsPerPage,
    maxVisiblePageLinks: config?.maxVisiblePageLinks ?? paginationSettings.maxVisiblePageLinks,
    showFirstLastButtons: config?.showFirstLastButtons ?? paginationSettings.showFirstLastButtons,
    showPreviousNextButtons:
      config?.showPreviousNextButtons ?? paginationSettings.showPreviousNextButtons,
    ellipsisThreshold: config?.ellipsisThreshold ?? paginationSettings.ellipsisThreshold,
  };
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

function coerceRawParam(pageParam: string | string[] | undefined): string | null {
  if (Array.isArray(pageParam)) {
    return pageParam[0] ?? null;
  }
  return pageParam ?? null;
}

export function validatePageParameter(
  pageParam: string | string[] | undefined,
  totalPages: number,
): PageParameter {
  const raw = coerceRawParam(pageParam);

  if (raw === null) {
    return {
      raw,
      parsed: 1,
      isValid: true,
      errorType: null,
    };
  }

  const parsed = Number.parseInt(raw, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return {
      raw,
      parsed: null,
      isValid: false,
      errorType: 'INVALID_FORMAT',
    };
  }

  const maxPage = Math.max(1, totalPages);

  if (parsed > maxPage) {
    return {
      raw,
      parsed: null,
      isValid: false,
      errorType: 'OUT_OF_RANGE',
    };
  }

  return {
    raw,
    parsed,
    isValid: true,
    errorType: null,
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

export function createPaginationState<T>(
  items: T[],
  currentPage: number,
  config?: Partial<PaginationConfig>,
): PaginationData<T> {
  const normalizedConfig = normalizeConfig(config);
  return getPaginationData(items, currentPage, normalizedConfig.itemsPerPage);
}

export function getPaginationErrorType(error: unknown): PaginationErrorType | null {
  if (error instanceof InvalidPageError) {
    return 'OUT_OF_RANGE';
  }
  if (error instanceof InvalidConfigError) {
    return 'INVALID_FORMAT';
  }
  return null;
}

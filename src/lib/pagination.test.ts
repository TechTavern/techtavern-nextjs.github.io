import { paginationSettings } from '@/lib/site';
import type { PaginationData } from '@/lib/pagination.types';
import {
  generatePaginationLinks,
  getPaginationData,
  validatePageParameter,
  createPaginationState,
  InvalidConfigError,
  InvalidPageError,
} from './pagination';
import { createPosts } from '@/tests/test-utils';

const ITEMS_PER_PAGE = paginationSettings.defaultItemsPerPage;

describe('getPaginationData', () => {
  it('returns pagination meta for the first page', () => {
    const posts = createPosts([], ITEMS_PER_PAGE + 5);

    const result: PaginationData = getPaginationData(posts, 1, ITEMS_PER_PAGE);

    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(Math.ceil(posts.length / ITEMS_PER_PAGE));
    expect(result.pageItems).toHaveLength(ITEMS_PER_PAGE);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('throws when current page is less than 1', () => {
    const posts = createPosts([], ITEMS_PER_PAGE);

    expect(() => getPaginationData(posts, 0, ITEMS_PER_PAGE)).toThrow('Invalid current page');
  });

  it('throws when current page exceeds total pages', () => {
    const posts = createPosts([], ITEMS_PER_PAGE);

    expect(() => getPaginationData(posts, 3, ITEMS_PER_PAGE)).toThrow('Page out of range');
  });

  it('validates inputs before computing pagination', () => {
    expect(() => getPaginationData(null as unknown as number[], 1, ITEMS_PER_PAGE)).toThrow(
      TypeError,
    );
    expect(() => getPaginationData([], 1, 0)).toThrow(InvalidConfigError);
  });
});

describe('validatePageParameter', () => {
  it('returns default page when parameter missing', () => {
    const result = validatePageParameter(undefined, 5);

    expect(result.parsed).toBe(1);
    expect(result.isValid).toBe(true);
    expect(result.errorType).toBeNull();
  });

  it('marks invalid format errors', () => {
    const result = validatePageParameter('abc', 5);

    expect(result.isValid).toBe(false);
    expect(result.errorType).toBe('INVALID_FORMAT');
    expect(result.parsed).toBeNull();
  });

  it('marks out of range errors when page exceeds total', () => {
    const result = validatePageParameter('9', 2);

    expect(result.isValid).toBe(false);
    expect(result.errorType).toBe('OUT_OF_RANGE');
  });

  it('normalizes array parameters and handles empty arrays', () => {
    const fromArray = validatePageParameter(['3', '4'], 5);
    expect(fromArray.parsed).toBe(3);
    expect(fromArray.isValid).toBe(true);
    const fromEmpty = validatePageParameter([], 5);
    expect(fromEmpty.parsed).toBe(1);
  });
});

describe('generatePaginationLinks', () => {
  it('shows contiguous pages when within max visible links', () => {
    const result = generatePaginationLinks(2, 3, 5);

    expect(result.visiblePages).toEqual([1, 2, 3]);
    expect(result.showStartEllipsis).toBe(false);
    expect(result.showEndEllipsis).toBe(false);
  });

  it('centers current page when possible', () => {
    const result = generatePaginationLinks(5, 10, 3);

    expect(result.visiblePages).toEqual([4, 5, 6]);
    expect(result.showStartEllipsis).toBe(true);
    expect(result.showEndEllipsis).toBe(true);
  });

  it('shows ellipsis when a single page exists before the visible range', () => {
    const result = generatePaginationLinks(2, 4, 3);

    expect(result.visiblePages).toEqual([1, 2, 3]);
    expect(result.showStartEllipsis).toBe(false);
    expect(result.showEndEllipsis).toBe(true);
  });

  it('shows ellipsis when a single page exists after the visible range', () => {
    const result = generatePaginationLinks(3, 4, 3);

    expect(result.visiblePages).toEqual([2, 3, 4]);
    expect(result.showStartEllipsis).toBe(true);
    expect(result.showEndEllipsis).toBe(false);
  });

  it('clamps pages near the end of range', () => {
    const result = generatePaginationLinks(10, 10, 3);

    expect(result.visiblePages).toEqual([8, 9, 10]);
    expect(result.showStartEllipsis).toBe(true);
    expect(result.showEndEllipsis).toBe(false);
  });
});

describe('createPaginationState', () => {
  it('acts as a convenience wrapper around getPaginationData', () => {
    const posts = createPosts([], 6);
    const state = createPaginationState(posts, 2, { itemsPerPage: 3 });
    expect(state.currentPage).toBe(2);
    expect(state.pageItems).toHaveLength(3);
  });

  it('propagates pagination errors for invalid requests', () => {
    const posts = createPosts([], 2);
    expect(() => createPaginationState(posts, 99, { itemsPerPage: 1 })).toThrow(InvalidPageError);
  });
});

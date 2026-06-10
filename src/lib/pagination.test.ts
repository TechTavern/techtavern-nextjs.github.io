import { paginationSettings } from '@/lib/site';
import type { PaginationData } from '@/lib/pagination.types';
import {
  generatePaginationLinks,
  getPaginationData,
  InvalidConfigError,
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


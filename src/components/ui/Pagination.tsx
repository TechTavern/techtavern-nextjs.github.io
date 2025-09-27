'use client';

import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { StepBack, StepForward } from 'lucide-react';
import { paginationSettings } from '@/lib/site';
import { cn } from '@/lib/utils';
import { generatePaginationLinks } from '@/lib/pagination';
import type { PaginationConfig, PaginationData } from '@/lib/pagination.types';

interface PaginationProps<T = unknown> {
  data: PaginationData<T>;
  onPageChange: (page: number) => void;
  config?: Partial<PaginationConfig>;
  className?: string;
  'aria-label'?: string;
}

function mergeConfig(config?: Partial<PaginationConfig>): PaginationConfig {
  return {
    itemsPerPage: config?.itemsPerPage ?? paginationSettings.defaultItemsPerPage,
    maxVisiblePageLinks: config?.maxVisiblePageLinks ?? paginationSettings.maxVisiblePageLinks,
    showFirstLastButtons:
      config?.showFirstLastButtons ?? paginationSettings.showFirstLastButtons,
    showPreviousNextButtons:
      config?.showPreviousNextButtons ?? paginationSettings.showPreviousNextButtons,
    ellipsisThreshold: config?.ellipsisThreshold ?? paginationSettings.ellipsisThreshold,
  };
}

export function Pagination<T = unknown>({
  data,
  onPageChange,
  config,
  className,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps<T>) {
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);

  const links = useMemo(
    () =>
      generatePaginationLinks(
        data.currentPage,
        data.totalPages,
        mergedConfig.maxVisiblePageLinks,
        mergedConfig.ellipsisThreshold,
      ),
    [data.currentPage, data.totalPages, mergedConfig.maxVisiblePageLinks, mergedConfig.ellipsisThreshold],
  );

  const handleChange = useCallback(
    (targetPage: number) => {
      if (targetPage === data.currentPage) {
        return;
      }

      if (targetPage < 1 || targetPage > Math.max(1, data.totalPages)) {
        return;
      }

      onPageChange(targetPage);
    },
    [data.currentPage, data.totalPages, onPageChange],
  );

  const handleNavigationKey = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (data.hasNextPage) {
          handleChange(data.currentPage + 1);
        }
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (data.hasPreviousPage) {
          handleChange(data.currentPage - 1);
        }
      }
    },
    [data.currentPage, data.hasNextPage, data.hasPreviousPage, handleChange],
  );

  if (data.totalPages <= 0) {
    return null;
  }

  const renderEllipsis = (position: 'start' | 'end') => (
    <span
      key={`ellipsis-${position}`}
      aria-hidden
      className="hidden sm:inline-flex h-11 w-11 items-center justify-center text-sm text-dark/60"
    >
      …
    </span>
  );

  return (
    <nav
      data-pagination
      aria-label={ariaLabel}
      className={cn('mt-8 flex flex-col items-center gap-4', className)}
      onKeyDown={handleNavigationKey}
    >
      <div className="flex w-full items-center justify-between gap-4 sm:justify-center">
        {mergedConfig.showPreviousNextButtons ? (
          <button
            type="button"
            onClick={() => handleChange(data.currentPage - 1)}
            disabled={!data.hasPreviousPage}
            aria-disabled={!data.hasPreviousPage}
            aria-label="Previous page"
            data-touch-target
            className={cn(
              'touch-target inline-flex h-12 w-12 items-center justify-center rounded-md border border-dark/20 bg-white text-sm font-medium text-dark transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <StepBack className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}

        {data.totalPages > 1 ? (
          <span
            aria-hidden
            className="sm:hidden text-dark/60 text-sm"
          >
            …
          </span>
        ) : null}

        <div className="hidden items-center gap-2 sm:flex">
          {mergedConfig.showFirstLastButtons && links.firstPage !== links.visiblePages[0] ? (
            <button
              type="button"
              onClick={() => handleChange(links.firstPage)}
              data-touch-target
              className="touch-target hidden h-12 w-12 items-center justify-center rounded-md border border-dark/20 bg-white text-sm font-medium text-dark transition sm:inline-flex focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              1
            </button>
          ) : null}

          {links.showStartEllipsis ? renderEllipsis('start') : null}

          {links.visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handleChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === data.currentPage ? 'page' : undefined}
              data-touch-target
              className={cn(
                'touch-target inline-flex h-12 min-w-[3rem] items-center justify-center rounded-md border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                page === data.currentPage
                  ? 'border-primary bg-primary text-white shadow'
                  : 'border-dark/20 bg-white text-dark hover:bg-secondary/10',
                'sm:min-w-[3rem]',
              )}
            >
              {page}
            </button>
          ))}

          {links.showEndEllipsis ? renderEllipsis('end') : null}

          {mergedConfig.showFirstLastButtons &&
          links.lastPage !== links.visiblePages[links.visiblePages.length - 1] ? (
            <button
              type="button"
              onClick={() => handleChange(links.lastPage)}
              data-touch-target
              className="touch-target hidden h-12 w-12 items-center justify-center rounded-md border border-dark/20 bg-white text-sm font-medium text-dark transition sm:inline-flex focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {links.lastPage}
            </button>
          ) : null}
        </div>

        {mergedConfig.showPreviousNextButtons ? (
          <button
            type="button"
            onClick={() => handleChange(data.currentPage + 1)}
            disabled={!data.hasNextPage}
            aria-disabled={!data.hasNextPage}
            aria-label="Next page"
            data-touch-target
            className={cn(
              'touch-target inline-flex h-12 w-12 items-center justify-center rounded-md border border-dark/20 bg-white text-sm font-medium text-dark transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <StepForward className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <span className="text-xs text-dark/70 sm:text-sm" aria-live="polite">
        Page {data.currentPage} of {Math.max(1, data.totalPages)}
      </span>
    </nav>
  );
}

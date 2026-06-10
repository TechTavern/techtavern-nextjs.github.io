import Link from 'next/link';
import { cn } from '@/lib/utils';
import { generatePaginationLinks } from '@/lib/pagination';
import type { PaginationData } from '@/lib/pagination.types';

// Server component: pagination on a static export is plain navigation between
// pre-built routes, so it ships zero client JavaScript.

const itemClasses =
  'touch-target inline-flex h-12 min-w-[3rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
const inactiveClasses = 'border-dark/20 bg-white text-dark hover:bg-secondary/10';
const activeClasses = 'border-primary bg-primary text-white shadow';
const disabledClasses = 'border-dark/10 bg-white text-dark/30';

function pageHref(page: number): string {
  return page <= 1 ? '/articles/' : `/articles/page/${page}/`;
}

interface PaginationLinksProps {
  data: PaginationData;
  'aria-label'?: string;
}

export function PaginationLinks({
  data,
  'aria-label': ariaLabel = 'Articles pagination',
}: PaginationLinksProps) {
  if (data.totalPages <= 1) {
    return null;
  }

  const links = generatePaginationLinks(data.currentPage, data.totalPages);

  return (
    <nav
      data-pagination
      aria-label={`${ariaLabel}, page ${data.currentPage} of ${data.totalPages}`}
      className="mt-8 flex flex-col items-center gap-4"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {data.hasPreviousPage ? (
          <Link
            href={pageHref(data.currentPage - 1)}
            aria-label="Previous page"
            className={cn(itemClasses, inactiveClasses)}
          >
            Previous
          </Link>
        ) : (
          <span role="link" aria-disabled="true" className={cn(itemClasses, disabledClasses)}>
            Previous
          </span>
        )}

        {links.showStartEllipsis ? (
          <>
            <Link
              href={pageHref(1)}
              aria-label="Page 1"
              className={cn(itemClasses, inactiveClasses, 'hidden sm:inline-flex')}
            >
              1
            </Link>
            <span
              aria-hidden
              className="hidden h-11 w-6 items-center justify-center text-sm text-dark/60 sm:inline-flex"
            >
              …
            </span>
          </>
        ) : null}

        {links.visiblePages.map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            aria-label={`Page ${page}`}
            aria-current={page === data.currentPage ? 'page' : undefined}
            className={cn(
              itemClasses,
              page === data.currentPage ? activeClasses : inactiveClasses,
              'hidden sm:inline-flex',
            )}
          >
            {page}
          </Link>
        ))}

        {links.showEndEllipsis ? (
          <>
            <span
              aria-hidden
              className="hidden h-11 w-6 items-center justify-center text-sm text-dark/60 sm:inline-flex"
            >
              …
            </span>
            <Link
              href={pageHref(links.lastPage)}
              aria-label={`Page ${links.lastPage}`}
              className={cn(itemClasses, inactiveClasses, 'hidden sm:inline-flex')}
            >
              {links.lastPage}
            </Link>
          </>
        ) : null}

        {data.hasNextPage ? (
          <Link
            href={pageHref(data.currentPage + 1)}
            aria-label="Next page"
            className={cn(itemClasses, inactiveClasses)}
          >
            Next
          </Link>
        ) : (
          <span role="link" aria-disabled="true" className={cn(itemClasses, disabledClasses)}>
            Next
          </span>
        )}
      </div>

      <span className="text-xs text-dark/70 sm:text-sm">
        Page {data.currentPage} of {data.totalPages}
      </span>
    </nav>
  );
}

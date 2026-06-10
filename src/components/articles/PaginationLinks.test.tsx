import { render, screen } from '@testing-library/react';
import { PaginationLinks } from './PaginationLinks';
import type { PaginationData } from '@/lib/pagination.types';

function makeData(overrides: Partial<PaginationData> = {}): PaginationData {
  return {
    currentPage: 2,
    totalPages: 3,
    totalItems: 45,
    itemsPerPage: 15,
    startIndex: 15,
    endIndex: 30,
    hasNextPage: true,
    hasPreviousPage: true,
    pageItems: [],
    ...overrides,
  };
}

describe('PaginationLinks', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = render(<PaginationLinks data={makeData({ totalPages: 1 })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('marks the current page with aria-current', () => {
    render(<PaginationLinks data={makeData()} />);
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('links previous and next pages to the right URLs', () => {
    render(<PaginationLinks data={makeData()} />);
    const prevHref = screen.getByRole('link', { name: 'Previous page' }).getAttribute('href');
    const nextHref = screen.getByRole('link', { name: 'Next page' }).getAttribute('href');
    expect(prevHref).toMatch(/^\/articles\/?$/);
    expect(nextHref).toMatch(/^\/articles\/page\/3\/?$/);
  });

  it('exposes the pagination landmark', () => {
    render(<PaginationLinks data={makeData()} />);
    expect(screen.getByRole('navigation', { name: 'Articles pagination' })).toBeInTheDocument();
  });
});

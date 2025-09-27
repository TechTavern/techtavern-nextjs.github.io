import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';
import type { PaginationData } from '@/lib/pagination.types';
import { createPaginationConfig, createPaginationData } from '@/tests/test-utils';

function renderPagination(
  data: PaginationData,
  options: {
    onPageChange?: (page: number) => void;
    configOverrides?: Parameters<typeof createPaginationConfig>[0];
  } = {},
) {
  const onPageChange = options.onPageChange ?? jest.fn();
  const config = createPaginationConfig(options.configOverrides ?? {});

  render(<Pagination data={data} config={config} onPageChange={onPageChange} aria-label="Pagination" />);

  return { onPageChange };
}

describe('Pagination component (failing tests before implementation)', () => {
  it('renders navigation controls and numbered links', () => {
    const items = Array.from({ length: 40 }, (_, index) => index + 1);
    const data = createPaginationData(items, {
      currentPage: 2,
      totalItems: items.length,
    });

    renderPagination(data);

    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /page 2/i })).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when a user selects another page', async () => {
    const items = Array.from({ length: 45 }, (_, index) => index + 1);
    const data = createPaginationData(items, {
      currentPage: 1,
      totalItems: items.length,
    });
    const user = userEvent.setup();
    const { onPageChange } = renderPagination(data);

    await user.click(screen.getByRole('button', { name: /page 2/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables navigation controls when at the boundaries', async () => {
    const items = Array.from({ length: 15 }, (_, index) => index + 1);
    const data = createPaginationData(items, {
      currentPage: 1,
      totalItems: items.length,
    });
    const user = userEvent.setup();

    renderPagination(data);

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(nextButton).toBeDisabled();
  });

  it('provides accessible labels and keyboard focus management', async () => {
    const items = Array.from({ length: 60 }, (_, index) => index + 1);
    const data = createPaginationData(items, {
      currentPage: 3,
      totalItems: items.length,
    });
    const user = userEvent.setup();

    const { onPageChange } = renderPagination(data);

    const currentPageLink = screen.getByRole('button', { name: /page 3/i });
    expect(currentPageLink).toHaveAttribute('aria-current', 'page');

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('renders compact layout when maxVisiblePageLinks is restricted', () => {
    const items = Array.from({ length: 60 }, (_, index) => index + 1);
    const data = createPaginationData(items, {
      currentPage: 4,
      totalItems: items.length,
    });

    renderPagination(data, { configOverrides: { maxVisiblePageLinks: 1 } });

    const pageLinks = screen.getAllByRole('button', { name: /page \d+/i });
    expect(pageLinks.length).toBeLessThanOrEqual(1);
  });
});

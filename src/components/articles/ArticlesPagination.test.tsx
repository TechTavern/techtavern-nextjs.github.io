import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticlesPagination } from './ArticlesPagination';
import { createPaginationData, createPosts } from '@/tests/test-utils';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/components/ui/Pagination', () => ({
  Pagination: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <div>
      <button type="button" data-testid="go-first" onClick={() => onPageChange(1)}>
        First page
      </button>
      <button type="button" data-testid="go-third" onClick={() => onPageChange(3)}>
        Third page
      </button>
    </div>
  ),
}));

describe('ArticlesPagination', () => {
  const posts = createPosts([{ slug: 'one' }, { slug: 'two' }, { slug: 'three' }]);
  const pagination = createPaginationData(posts, {
    totalItems: posts.length,
    totalPages: 3,
    itemsPerPage: 1,
    pageItems: posts,
    hasNextPage: true,
    hasPreviousPage: true,
  });

  beforeEach(() => {
    pushMock.mockReset();
  });

  it('navigates to the canonical articles page when selecting page 1', async () => {
    const user = userEvent.setup();
    render(<ArticlesPagination data={pagination} />);

    await user.click(screen.getByTestId('go-first'));

    expect(pushMock).toHaveBeenCalledWith('/articles/');
  });

  it('navigates to a paginated route when selecting pages beyond 1', async () => {
    const user = userEvent.setup();
    render(<ArticlesPagination data={pagination} />);

    await user.click(screen.getByTestId('go-third'));

    expect(pushMock).toHaveBeenCalledWith('/articles/page/3/');
  });
});

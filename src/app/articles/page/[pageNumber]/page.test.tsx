import { render, screen } from '@testing-library/react';
import PaginatedArticlesPage, {
  generateMetadata,
  generateStaticParams,
} from './page';
import { createPaginationData, createPosts } from '@/tests/test-utils';
import { generatePaginationParams, getPaginatedPosts } from '@/lib/posts';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('@/lib/site.server', () => {
  const actual = jest.requireActual('@/lib/site.server');
  return {
    ...actual,
    getBaseUrl: jest.fn(),
  };
});

jest.mock('@/lib/posts', () => {
  const actual = jest.requireActual('@/lib/posts');
  return {
    ...actual,
    getPaginatedPosts: jest.fn(),
    generatePaginationParams: jest.fn(),
  };
});

jest.mock('@/app/articles/ArticlesPageSections', () => ({
  ArticlesPageSections: ({ pagination, posts }: { pagination: { currentPage: number }; posts: unknown[] }) => (
    <div data-testid="articles-section">
      <span data-testid="current-page">{pagination.currentPage}</span>
      <span data-testid="posts-count">{posts.length}</span>
    </div>
  ),
  ARTICLES_PAGE: {
    title: 'Articles',
    hero: { title: '', subtitle: '' },
    empty: { heading: '', subtext: '' },
    cta: { heading: '', subtext: '', buttonLabel: '' },
  },
}));

const getPaginatedPostsMock = getPaginatedPosts as jest.MockedFunction<typeof getPaginatedPosts>;
const generatePaginationParamsMock = generatePaginationParams as jest.MockedFunction<typeof generatePaginationParams>;
const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('Paginated articles page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBaseUrlMock.mockReturnValue('https://example.com');
  });

  it('returns static params from the posts helper', async () => {
    generatePaginationParamsMock.mockResolvedValue([{ pageNumber: '2' }, { pageNumber: '3' }]);

    const params = await generateStaticParams();

    expect(generatePaginationParamsMock).toHaveBeenCalledTimes(1);
    expect(params).toEqual([{ pageNumber: '2' }, { pageNumber: '3' }]);
  });

  it('generates canonical metadata for page 1', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: '1' }) });

    expect(metadata.title).toBe('Articles');
    expect(metadata.alternates?.canonical).toBe('https://example.com/articles/');
    expect(getPaginatedPostsMock).not.toHaveBeenCalled();
  });

  it('generates paginated metadata for subsequent pages', async () => {
    getPaginatedPostsMock.mockResolvedValue(
      createPaginationData([], {
        currentPage: 2,
        totalItems: 6,
        totalPages: 4,
        itemsPerPage: 3,
        startIndex: 3,
        endIndex: 6,
        pageItems: [],
        hasNextPage: true,
        hasPreviousPage: true,
      }),
    );

    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: '2' }) });

    expect(getPaginatedPostsMock).toHaveBeenCalledWith(2);
    expect(metadata.title).toBe('Articles – Page 2');
    expect(metadata.openGraph?.url).toBe('https://example.com/articles/page/2/');
  });

  it('renders the paginated articles section when data is available', async () => {
    const posts = createPosts([
      { title: 'Paginated article', slug: 'paginated-article' },
      { title: 'Another article', slug: 'another-article' },
      { title: 'Third article', slug: 'third-article' },
    ]);

    getPaginatedPostsMock.mockResolvedValue(
      createPaginationData(posts, {
        currentPage: 2,
        totalItems: posts.length,
        totalPages: 2,
        itemsPerPage: 3,
        startIndex: 0,
        endIndex: posts.length,
        pageItems: posts,
        hasNextPage: false,
        hasPreviousPage: true,
      }),
    );

    const Page = await PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: '2' }) });
    render(Page);

    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('posts-count')).toHaveTextContent('3');
  });
});

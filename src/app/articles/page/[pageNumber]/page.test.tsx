import { render, screen } from '@testing-library/react';
import PaginatedArticlesPage, {
  generateMetadata,
  generateStaticParams,
} from './page';
import { createPosts } from '@/tests/test-utils';
import { getAllPosts } from '@/lib/posts';
import { paginationSettings } from '@/lib/site';
import { getBaseUrl } from '@/lib/site.server';

jest.mock('next/navigation', () => ({
  notFound: () => {
    const error = new Error('NEXT_NOT_FOUND');
    // @ts-expect-error align with Next error structure
    error.digest = 'NEXT_NOT_FOUND';
    throw error;
  },
}));

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
    getAllPosts: jest.fn(),
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

const getAllPostsMock = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const perPage = paginationSettings.defaultItemsPerPage;
const getBaseUrlMock = getBaseUrl as jest.MockedFunction<typeof getBaseUrl>;

describe('Paginated articles page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBaseUrlMock.mockReturnValue('https://example.com');
    // Default: 4 pages exist so page-2 is valid and page-999 is out of range
    getAllPostsMock.mockResolvedValue(createPosts([], perPage * 4));
  });

  it('generates static params for pages 2..N only', async () => {
    expect(await generateStaticParams()).toEqual([
      { pageNumber: '2' },
      { pageNumber: '3' },
      { pageNumber: '4' },
    ]);
  });

  it('returns empty metadata for page 1 (page 1 lives at /articles/)', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: '1' }) });

    // /articles/page/1/ is never generated; no metadata needed.
    expect(metadata).toEqual({});
  });

  it('generates paginated metadata for subsequent pages', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: '2' }) });

    expect(metadata.title).toBe('Articles – Page 2');
    expect(metadata.openGraph?.url).toBe('https://example.com/articles/page/2/');
  });

  it('returns empty metadata when the requested page is missing', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: '999' }) });

    expect(metadata).toEqual({});
  });

  it('returns empty metadata when the page parameter is invalid', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ pageNumber: 'abc' }) });
    expect(metadata).toEqual({});
  });

  it('renders the paginated articles section when data is available', async () => {
    getAllPostsMock.mockResolvedValue(createPosts([], perPage + 3));

    const Page = await PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: '2' }) });
    render(Page);

    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('posts-count')).toHaveTextContent('3');
  });

  it('throws notFound for pages beyond the last page', async () => {
    await expect(
      PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: '5' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('throws notFound for non-numeric page parameters', async () => {
    await expect(
      PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: 'abc' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('throws notFound for page numbers less than one', async () => {
    await expect(
      PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: '0' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('throws notFound for page 1 (canonically served at /articles/)', async () => {
    await expect(
      PaginatedArticlesPage({ params: Promise.resolve({ pageNumber: '1' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

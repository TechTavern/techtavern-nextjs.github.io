/* @jest-environment node */
import { createPosts } from '@/tests/test-utils';
import { getAllPosts } from '@/lib/posts';
import { paginationSettings } from '@/lib/site';
import {
  articleIndexPath,
  getArticleIndexPage,
  getArticleIndexPages,
  getPagedRouteParams,
  parsePagedRouteParam,
} from './article-index';

jest.mock('@/lib/posts', () => {
  const actual = jest.requireActual('@/lib/posts');
  return { ...actual, getAllPosts: jest.fn() };
});

const getAllPostsMock = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const perPage = paginationSettings.defaultItemsPerPage;

function withArticleCount(count: number): void {
  getAllPostsMock.mockResolvedValue(
    createPosts(
      Array.from({ length: count }, (_, i) => ({ slug: `post-${i + 1}`, title: `Post ${i + 1}` })),
    ),
  );
}

describe('articleIndexPath', () => {
  it('addresses page 1 at /articles/, never /articles/page/1/', () => {
    expect(articleIndexPath(1)).toBe('/articles/');
  });

  it('addresses later pages at /articles/page/n/', () => {
    expect(articleIndexPath(2)).toBe('/articles/page/2/');
    expect(articleIndexPath(17)).toBe('/articles/page/17/');
  });
});

describe('getArticleIndexPages', () => {
  it('lists every page exactly once, page 1 at /articles/', async () => {
    withArticleCount(perPage * 2 + 1);

    const pages = await getArticleIndexPages();

    expect(pages).toEqual([
      { pageNumber: 1, path: '/articles/' },
      { pageNumber: 2, path: '/articles/page/2/' },
      { pageNumber: 3, path: '/articles/page/3/' },
    ]);
    expect(pages.some((p) => p.path === '/articles/page/1/')).toBe(false);
  });

  it('still lists the (empty) first page when there are no articles', async () => {
    withArticleCount(0);
    expect(await getArticleIndexPages()).toEqual([{ pageNumber: 1, path: '/articles/' }]);
  });

  it('uses paginationSettings.defaultItemsPerPage as the page size', async () => {
    withArticleCount(perPage);
    expect(await getArticleIndexPages()).toHaveLength(1);

    withArticleCount(perPage + 1);
    expect(await getArticleIndexPages()).toHaveLength(2);
  });
});

describe('getPagedRouteParams', () => {
  it('generates pages 2..N exactly once and never page 1', async () => {
    withArticleCount(perPage * 3);

    expect(await getPagedRouteParams()).toEqual([{ pageNumber: '2' }, { pageNumber: '3' }]);
  });

  it('generates nothing when everything fits on /articles/', async () => {
    withArticleCount(perPage);
    expect(await getPagedRouteParams()).toEqual([]);
  });
});

describe('parsePagedRouteParam', () => {
  beforeEach(() => withArticleCount(perPage * 3)); // 3 pages

  it.each(['abc', '', '2a', '-2', '2.0', ' 2', '0', '1', '01', '4', '999'])(
    'rejects %p as not a paged route',
    async (param) => {
      expect(await parsePagedRouteParam(param)).toBeNull();
    },
  );

  it.each([
    ['2', 2],
    ['3', 3],
  ])('accepts %p as page %p', async (param, expected) => {
    expect(await parsePagedRouteParam(param)).toBe(expected);
  });
});

describe('getArticleIndexPage', () => {
  it('returns the articles for a page using the configured page size', async () => {
    withArticleCount(perPage + 2);

    const first = await getArticleIndexPage(1);
    expect(first.currentPage).toBe(1);
    expect(first.itemsPerPage).toBe(perPage);
    expect(first.pageItems).toHaveLength(perPage);
    expect(first.totalPages).toBe(2);

    const second = await getArticleIndexPage(2);
    expect(second.pageItems.map((p) => p.slug)).toEqual([`post-${perPage + 1}`, `post-${perPage + 2}`]);
  });

  it('returns an empty first page when there are no articles', async () => {
    withArticleCount(0);
    const page = await getArticleIndexPage(1);
    expect(page.pageItems).toEqual([]);
    expect(page.totalPages).toBe(1);
  });
});

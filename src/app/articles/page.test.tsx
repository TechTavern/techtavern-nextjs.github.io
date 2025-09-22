import { render, screen } from '@testing-library/react';
import ArticlesIndexPage, { metadata } from './page';
import { createPosts } from '@/tests/test-utils';
import { getAllPosts } from '@/lib/posts';

jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;

describe('Articles index page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an empty state when no posts are available', async () => {
    mockGetAllPosts.mockResolvedValueOnce([]);

    const page = await ArticlesIndexPage();
    render(page);

    expect(
      screen.getByRole('heading', { level: 2, name: /coming soon/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /get in touch/i })
    ).toHaveAttribute('href', '/#Contact');
  });

  it('renders article cards with metadata when posts exist', async () => {
    const posts = createPosts([
      {
        title: 'Serverless Patterns',
        excerpt: 'Patterns for shipping resilient static sites.',
        tags: ['Architecture', 'Testing'],
        readingTimeMinutes: 7,
        slug: 'serverless-patterns',
      },
      {
        title: 'Observability for AI',
        excerpt: 'Instrumenting LLM products for reliability.',
        tags: ['AI'],
        readingTimeMinutes: 4,
        slug: 'observability-for-ai',
      },
    ]);
    mockGetAllPosts.mockResolvedValueOnce(posts);

    const page = await ArticlesIndexPage();
    render(page);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(posts.length);

    expect(
      screen.getByRole('link', { name: /read article: serverless patterns/i })
    ).toHaveAttribute('href', expect.stringContaining(posts[0].slug));

    expect(
      screen.getByText(/7 min/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText('Architecture')
    ).toBeInTheDocument();
  });
});

describe('Articles index metadata', () => {
  it('provides canonical, OpenGraph, and Twitter metadata pointing to the articles index', () => {
    expect(metadata.title).toBe('Articles');
    expect(metadata.openGraph?.url).toBe('http://localhost:3000/articles/');
    expect(metadata.openGraph?.images?.[0]?.url).toMatch(/tech-tavern-default-featured\.webp$/);
    expect(metadata.alternates?.canonical).toBe('http://localhost:3000/articles/');
  });
});

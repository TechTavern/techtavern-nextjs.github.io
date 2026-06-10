import path from 'node:path';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticlePage, { generateMetadata, generateStaticParams } from './page';
import { createPostMeta } from '@/tests/test-utils';
import { getAllPosts, getPostByParams } from '@/lib/posts';
import MDXImage from '@/components/ui/MDXImage';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }
  ) => {
    const { alt, ...rest } = props;
    const imgProps = { ...rest } as Record<string, unknown>;
    delete imgProps.fill;
    delete imgProps.priority;

    return React.createElement('img', {
      alt: alt ?? '',
      ...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>),
    });
  },
}));

jest.mock('@/lib/mdx-options', () => ({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
}));

const compileMDXMock = jest.fn(async () => ({
  content: (
    <div>
      <h1>Fixture Heading</h1>
      <p>Compiled paragraph from MDX.</p>
      <MDXImage src="/assets/img/compiled.png" alt="Diagram of coverage" width={640} height={360} />
      <blockquote>Insightful pull quote that should render inside a styled blockquote.</blockquote>
      <ul>
        <li>First list entry</li>
        <li>
          Second list entry with <a href="https://example.com">link</a>
        </li>
      </ul>
    </div>
  ),
}));

jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: (...args: Parameters<typeof compileMDXMock>) => compileMDXMock(...args),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(),
  getPostByParams: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const mockGetPostByParams = getPostByParams as jest.MockedFunction<typeof getPostByParams>;
const fixturePath = path.join(
  process.cwd(),
  'tests/fixtures/articles/2025-01-01-fixture-with-excerpt.mdx',
);

const post = createPostMeta({
  title: 'Fixture Article With Excerpt',
  slug: 'fixture-with-excerpt',
  date: '2025-01-01',
  excerpt:
    'This fixture exercises the article page rendering pipeline, including metadata extraction and MDX components.',
  tags: ['Testing', 'Coverage'],
  url: '/articles/2025/01/01/fixture-with-excerpt/',
  filePath: fixturePath,
  featuredImage: '/images/tech-tavern-default-featured.webp',
  readingTimeMinutes: 5,
});

describe('Article page route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    compileMDXMock.mockClear();
  });

  it('generates static params from published posts', async () => {
    mockGetAllPosts.mockResolvedValueOnce([post]);
    await expect(generateStaticParams()).resolves.toEqual([
      {
        year: '2025',
        month: '01',
        day: '01',
        slug: 'fixture-with-excerpt',
      },
    ]);
  });

  it('renders article content, metadata, and MDX pipeline output', async () => {
    mockGetPostByParams.mockResolvedValueOnce(post);

    const page = await ArticlePage({
      params: Promise.resolve({ year: '2025', month: '01', day: '01', slug: 'fixture-with-excerpt' }),
    });
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Fixture Article With Excerpt' }),
    ).toBeInTheDocument();

    expect(screen.getByText(/compiled paragraph from mdx/i)).toBeInTheDocument();

    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.getByText('Coverage')).toBeInTheDocument();
    expect(screen.getByText(/First list entry/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /diagram of coverage/i })).toBeInTheDocument();
  });

  it('renders Article JSON-LD structured data', async () => {
    mockGetPostByParams.mockResolvedValueOnce(post);

    const page = await ArticlePage({
      params: Promise.resolve({ year: '2025', month: '01', day: '01', slug: 'fixture-with-excerpt' }),
    });
    render(page);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const json = JSON.parse(script?.textContent ?? '{}');
    expect(json['@type']).toBe('Article');
    expect(json.headline).toBe('Fixture Article With Excerpt');
    expect(json.datePublished).toBeTruthy();
  });

  it('invokes notFound when an article cannot be located', async () => {
    mockGetPostByParams.mockResolvedValueOnce(null);

    await expect(
      ArticlePage({
        params: Promise.resolve({ year: '2024', month: '12', day: '31', slug: 'missing' }),
      }),
    ).rejects.toThrow('NOT_FOUND');
  });
});

describe('Article page metadata', () => {
  it('builds metadata using article details and defaults for missing OG fields', async () => {
    mockGetPostByParams.mockResolvedValueOnce({
      ...post,
      ogTitle: 'Custom OG Title',
      ogDescription: 'Custom OG Description',
      ogImage: '/images/custom-og.png',
    });

    const meta = await generateMetadata({
      params: Promise.resolve({ year: '2025', month: '01', day: '01', slug: 'fixture-with-excerpt' }),
    });

    expect(meta.title).toBe('Custom OG Title');

    const images = meta.openGraph?.images;
    let imageUrl: string | undefined;
    if (Array.isArray(images)) {
      const [first] = images;
      if (typeof first === 'string') {
        imageUrl = first;
      } else if (first instanceof URL) {
        imageUrl = first.toString();
      } else if (first) {
        imageUrl = first.url instanceof URL ? first.url.toString() : first.url;
      }
    } else if (typeof images === 'string') {
      imageUrl = images;
    } else if (images instanceof URL) {
      imageUrl = images.toString();
    } else if (images) {
      imageUrl = images.url instanceof URL ? images.url.toString() : images.url;
    }

    expect(imageUrl).toBe('http://localhost:3000/images/custom-og.png');

    const tags = Array.isArray((meta.openGraph as { tags?: string[] } | undefined)?.tags)
      ? (meta.openGraph as { tags: string[] }).tags
      : undefined;

    expect(tags).toEqual(expect.arrayContaining(['Testing', 'Coverage']));
    expect(meta.alternates?.canonical).toBe('http://localhost:3000/articles/2025/01/01/fixture-with-excerpt/');
  });

  it('prefers canonical URLs and absolute OG images when provided', async () => {
    mockGetPostByParams.mockResolvedValueOnce({
      ...post,
      canonicalUrl: 'https://example.com/custom-canonical',
      ogImage: 'https://cdn.example.com/og.png',
    });

    const meta = await generateMetadata({
      params: Promise.resolve({ year: '2025', month: '01', day: '01', slug: 'fixture-with-excerpt' }),
    });

    expect(meta.alternates?.canonical).toBe('https://example.com/custom-canonical');

    const images = meta.openGraph?.images;
    let ogImageUrl: string | undefined;
    if (Array.isArray(images)) {
      const first = images[0];
      if (typeof first === 'string' || first instanceof URL) {
        ogImageUrl = first.toString();
      } else if (first) {
        ogImageUrl = first.url instanceof URL ? first.url.toString() : first.url;
      }
    } else if (images) {
      if (typeof images === 'string' || images instanceof URL) {
        ogImageUrl = images.toString();
      } else if ('url' in images) {
        ogImageUrl = images.url instanceof URL ? images.url.toString() : images.url;
      }
    }

    expect(ogImageUrl).toBe('https://cdn.example.com/og.png');
    expect(meta.twitter?.images).toEqual(['https://cdn.example.com/og.png']);
  });

  it('returns empty metadata when the article cannot be found', async () => {
    mockGetPostByParams.mockResolvedValueOnce(null);

    const meta = await generateMetadata({
      params: Promise.resolve({ year: '2024', month: '12', day: '31', slug: 'missing' }),
    });

    expect(meta).toEqual({});
  });
});

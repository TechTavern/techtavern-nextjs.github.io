/* @jest-environment node */

import fg from 'fast-glob';
import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';

import { getAllPosts } from './posts';
import { withBasePath } from '@/lib/site.server';
import { DEFAULT_FEATURED_IMAGE } from '@/lib/site';

jest.mock('fast-glob', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('node:fs/promises', () => {
  const readFileMock = jest.fn();
  return {
    __esModule: true,
    default: { readFile: readFileMock },
    readFile: readFileMock,
  };
});

jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/site.server', () => ({
  withBasePath: jest.fn((path: string | undefined) =>
    path ? `__base${path}` : undefined,
  ),
}));

const fgMock = fg as unknown as jest.MockedFunction<typeof fg>;
const readFileFn = readFile as jest.MockedFunction<typeof readFile>;
const matterMock = matter as unknown as jest.Mock<
  { data: Record<string, unknown>; content: string },
  [string]
>;
const withBasePathMock = withBasePath as jest.MockedFunction<typeof withBasePath>;

let matterQueue: Array<{ data: Record<string, unknown>; content: string }> = [];

function queueMatter(entries: Array<{ data: Record<string, unknown>; content: string }>) {
  matterQueue = entries.slice();
}

describe('getAllPosts edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    matterQueue = [];
    fgMock.mockResolvedValue([]);
    readFileFn.mockResolvedValue('---mdx---');
    matterMock.mockImplementation(() => {
      if (!matterQueue.length) {
        throw new Error('matter queue exhausted');
      }
      return matterQueue.shift()!;
    });
    withBasePathMock.mockImplementation((path) => (path ? `__base${path}` : undefined));
  });

  it('filters drafts and sorts posts descending by date', async () => {
    fgMock.mockResolvedValue([
      '/content/draft.mdx',
      '/content/older.mdx',
      '/content/newer.mdx',
    ]);

    queueMatter([
      {
        data: {
          title: 'Draft Post',
          date: '2024-01-10',
          slug: 'draft-post',
          draft: true,
        },
        content: 'word '.repeat(50),
      },
      {
        data: {
          title: 'Older Published',
          date: '2024-03-05',
          slug: 'older',
        },
        content: 'word '.repeat(220),
      },
      {
        data: {
          title: 'Newest Published',
          date: '2024-05-12',
          slug: 'newest',
        },
        content: 'word '.repeat(400),
      },
    ]);

    const posts = await getAllPosts();

    expect(posts).toHaveLength(2);
    expect(posts.map((p) => p.slug)).toEqual(['newest', 'older']);
    expect(posts.every((p) => p.draft === false)).toBe(true);
    expect(posts[0].readingTimeMinutes).toBeGreaterThanOrEqual(2);
    expect(posts[1].readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it('returns an empty array when no MDX files are present', async () => {
    fgMock.mockResolvedValue([]);

    const posts = await getAllPosts();

    expect(posts).toEqual([]);
    expect(readFileFn).not.toHaveBeenCalled();
    expect(matterMock).not.toHaveBeenCalled();
  });

  it('throws descriptive errors when frontmatter fails validation', async () => {
    fgMock.mockResolvedValue(['/content/broken.mdx']);
    queueMatter([
      {
        data: {
          title: 'Missing Slug',
          date: '2024-06-01',
          // slug intentionally omitted
        },
        content: 'body',
      },
    ]);

    await expect(getAllPosts()).rejects.toThrow(/Invalid frontmatter.*slug: Required/);
  });

  it('aggregates validation errors for malformed frontmatter data', async () => {
    fgMock.mockResolvedValue(['/content/invalid.mdx']);
    queueMatter([
      {
        data: {
          title: '',
          date: '2024/06/01',
          slug: '',
        },
        content: 'body',
      },
    ]);

    await expect(async () => {
      try {
        await getAllPosts();
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toContain('title: title is required');
        expect(message).toContain('date: date must be yyyy-mm-dd');
        expect(message).toContain('slug: slug is required');
        throw error;
      }
    }).rejects.toThrow(/Invalid frontmatter/);
  });

  it('normalizes asset paths via withBasePath and preserves canonical URL overrides', async () => {
    fgMock.mockResolvedValue(['/content/with-assets.mdx']);
    queueMatter([
      {
        data: {
          title: 'SEO Rich',
          date: '2025-01-17',
          slug: 'seo-rich',
          ogImage: '/og-image.png',
          canonicalUrl: 'https://canonical.example/seo-rich',
        },
        content: 'word '.repeat(210),
      },
    ]);

    const [post] = await getAllPosts();
    expect(withBasePathMock).toHaveBeenCalledWith('/og-image.png');
    expect(withBasePathMock).toHaveBeenCalledWith(DEFAULT_FEATURED_IMAGE);
    expect(post.featuredImage).toBe(`__base${DEFAULT_FEATURED_IMAGE}`);
    expect(post.ogImage).toBe('__base/og-image.png');
    expect(post.canonicalUrl).toBe('https://canonical.example/seo-rich');
    expect(post.url).toBe('/articles/2025/01/17/seo-rich/');
    expect(post.lastModified).toBe('2025-01-17');
  });
});

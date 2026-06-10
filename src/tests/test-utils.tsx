import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { PostMeta } from '@/lib/posts';
import type { PaginationData } from '@/lib/pagination.types';

const BASE_POST: PostMeta = {
  title: 'Sample Post',
  date: '2025-01-01',
  lastModified: '2025-01-01',
  slug: 'sample-post',
  excerpt: 'Default excerpt for testing scenarios.',
  tags: ['Testing'],
  featuredImage: '/images/tech-tavern-default-featured.webp',
  ogTitle: undefined,
  ogDescription: undefined,
  ogImage: undefined,
  canonicalUrl: undefined,
  draft: false,
  readingTimeMinutes: 3,
  year: '2025',
  month: '01',
  day: '01',
  url: '/articles/2025/01/01/sample-post/',
  filePath: '/virtual/content/articles/2025-01-01-sample-post.mdx',
};

/**
 * Render helper that can be extended with app-wide providers when needed.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions,
): RenderResult {
  return render(ui, options);
}

export function createPostMeta(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    ...BASE_POST,
    ...overrides,
    tags: overrides.tags ?? BASE_POST.tags,
  };
}

export function createPosts(
  list: Array<Partial<PostMeta>> = [],
  totalCount?: number,
): PostMeta[] {
  const targetCount = typeof totalCount === 'number' ? totalCount : list.length;
  if (targetCount === 0) {
    return [];
  }

  return Array.from({ length: targetCount }, (_, index) => {
    const item = list[index] ?? {};
    const date = item.date ?? `2025-01-${String(index + 1).padStart(2, '0')}`;
    const [year, month, day] = date.split('-');
    const slug = item.slug ?? `post-${index + 1}`;
    return createPostMeta({
      date,
      lastModified: item.lastModified ?? date,
      year,
      month,
      day,
      slug,
      url: item.url ?? `/articles/${year}/${month}/${day}/${slug}/`,
      ...item,
    });
  });
}

export function createPaginationData<T>(
  items: T[],
  overrides: Partial<PaginationData<T>> = {},
): PaginationData<T> {
  const totalItems = overrides.totalItems ?? items.length;
  const itemsPerPage = overrides.itemsPerPage ?? 15;
  const totalPages = overrides.totalPages ?? Math.ceil(totalItems / itemsPerPage);
  const currentPage = overrides.currentPage ?? 1;
  const startIndex = overrides.startIndex ?? (currentPage - 1) * itemsPerPage;
  const endIndex = overrides.endIndex ?? Math.min(startIndex + itemsPerPage, totalItems);
  const pageItems = overrides.pageItems ?? items.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage: overrides.hasNextPage ?? currentPage < totalPages,
    hasPreviousPage: overrides.hasPreviousPage ?? currentPage > 1,
    pageItems,
  };
}


import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { PostMeta } from '@/lib/posts';

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

export function createPosts(list: Array<Partial<PostMeta>> = []): PostMeta[] {
  return list.map((item, index) => {
    const date = item.date ?? `2025-01-${String(index + 1).padStart(2, '0')}`;
    const [year, month, day] = date.split('-');
    return createPostMeta({
      date,
      lastModified: item.lastModified ?? date,
      year,
      month,
      day,
      slug: item.slug ?? `post-${index + 1}`,
      url:
        item.url ?? `/articles/${year}/${month}/${day}/${item.slug ?? `post-${index + 1}`}/`,
      ...item,
    });
  });
}

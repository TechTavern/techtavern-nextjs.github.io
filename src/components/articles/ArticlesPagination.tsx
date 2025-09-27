'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PaginationConfig, PaginationData } from '@/lib/pagination.types';
import { Pagination } from '@/components/ui/Pagination';

interface ArticlesPaginationProps<T = unknown> {
  data: PaginationData<T>;
  config?: Partial<PaginationConfig>;
}

export function ArticlesPagination<T = unknown>({ data, config }: ArticlesPaginationProps<T>) {
  const router = useRouter();

  const handlePageChange = useCallback(
    (page: number) => {
      if (page <= 1) {
        router.push('/articles/');
        return;
      }

      router.push(`/articles/page/${page}/`);
    },
    [router],
  );

  return <Pagination data={data} config={config} onPageChange={handlePageChange} aria-label="Articles pagination" />;
}

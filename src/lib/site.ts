import { env } from './env';

export function getBaseUrlWith(e: { SITE_URL?: string; NEXT_PUBLIC_BASE_PATH?: string }) {
  const base = (e.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const basePath = (e.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return `${base}${basePath}`;
}

export function getBaseUrl() {
  return getBaseUrlWith(env);
}

export const siteMeta = {
  title: 'Tech Tavern',
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC.",
};

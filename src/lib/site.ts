import { env } from './env';

export function getBaseUrl() {
  const base = (env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const basePath = (env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return `${base}${basePath}`;
}

export const siteMeta = {
  title: 'Tech Tavern',
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC.",
};

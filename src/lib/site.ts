export function getBaseUrl() {
  const base = process.env.SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return `${base}${basePath}`;
}

export const siteMeta = {
  title: 'Tech Tavern',
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC.",
};


/* @jest-environment node */
// Exercises the real site-address helpers, real content, and real page
// metadata with a NON-EMPTY basePath (as the staging deploy uses).

jest.mock('@/lib/mdx-options', () => ({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
}));
jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(async () => ({ content: null })),
}));

const BASE_PATH = '/techtavern-nextjs.github.io';
const SITE_URL = 'https://example.github.io';

type Loaded = {
  posts: typeof import('@/lib/posts');
  articlePage: typeof import('@/app/articles/[year]/[month]/[day]/[slug]/page');
  consultingPage: typeof import('@/app/consulting/[slug]/page');
  profiles: typeof import('@/lib/profiles');
  sitemap: typeof import('@/app/sitemap');
};

function loadWithEnv(siteUrl: string, basePath: string): Loaded {
  const prev = { SITE_URL: process.env.SITE_URL, NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH };
  process.env.SITE_URL = siteUrl;
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    loaded = {
      posts: require('@/lib/posts'),
      articlePage: require('@/app/articles/[year]/[month]/[day]/[slug]/page'),
      consultingPage: require('@/app/consulting/[slug]/page'),
      profiles: require('@/lib/profiles'),
      sitemap: require('@/app/sitemap'),
    };
  });
  process.env.SITE_URL = prev.SITE_URL;
  process.env.NEXT_PUBLIC_BASE_PATH = prev.NEXT_PUBLIC_BASE_PATH;
  return loaded as Loaded;
}

function collectUrls(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    if (/^https?:\/\//.test(value)) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUrls(v, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectUrls(v, out));
  } else if (value instanceof URL) {
    out.push(value.toString());
  }
  return out;
}

describe.each([
  ['SITE_URL is the origin', SITE_URL],
  ['SITE_URL already includes the basePath (staging deploy)', `${SITE_URL}${BASE_PATH}`],
])('with a non-empty basePath (%s)', (_label, siteUrl) => {
  const m = loadWithEnv(siteUrl, BASE_PATH);
  const doubled = `${BASE_PATH}${BASE_PATH}`;

  it('Article Social Preview images and URLs contain the basePath exactly once', async () => {
    const [post] = await m.posts.getAllPosts();
    expect(post).toBeDefined();
    const meta = await m.articlePage.generateMetadata({
      params: Promise.resolve({ year: post.year, month: post.month, day: post.day, slug: post.slug }),
    });
    const urls = collectUrls({ og: meta.openGraph, tw: meta.twitter, alt: meta.alternates });
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      if (url.startsWith(SITE_URL)) {
        expect(url).not.toContain(doubled);
        expect(url.startsWith(`${SITE_URL}${BASE_PATH}/`)).toBe(true);
      }
    }
    const og = meta.openGraph as { images?: Array<{ url: string }>; url?: string };
    expect(og.url).toBe(`${SITE_URL}${BASE_PATH}${post.url}`);
  });

  it('Consultant Profile Canonical URL has the basePath once and a trailing slash', async () => {
    const [profile] = await m.profiles.getAllProfiles();
    const meta = await m.consultingPage.generateMetadata({ params: Promise.resolve({ slug: profile.slug }) });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}${BASE_PATH}/consulting/${profile.slug}/`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${SITE_URL}${BASE_PATH}/consulting/${profile.slug}/`);
  });

  it('sitemap entries contain the basePath exactly once', async () => {
    const entries = await m.sitemap.default();
    for (const entry of entries) {
      expect(entry.url.startsWith(`${SITE_URL}${BASE_PATH}/`)).toBe(true);
      expect(entry.url).not.toContain(doubled);
      expect(entry.url.endsWith('/')).toBe(true);
    }
  });
});

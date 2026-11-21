/* @jest-environment node */
// Exercises the real site-address helpers, real content, and real page
// metadata with a NON-EMPTY basePath (as the staging deploy uses).

jest.mock('@/lib/mdx-options', () => ({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
}));
// The build sets images.unoptimized, so next/image renders `src` unchanged.
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) =>
    jest.requireActual('react').createElement('img', { src, alt }),
}));
// Render the home variant of the header as the home route would.
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: () => '/',
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
  renderAssets: () => string;
  renderHomeNav: () => string;
  renderToStaticMarkup: (element: unknown) => string;
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
      renderToStaticMarkup: require('react-dom/server').renderToStaticMarkup,
      renderHomeNav: (() => {
        const { createElement } = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const Header = require('@/components/ui/Header').default;
        return () => renderToStaticMarkup(createElement(Header, { variant: 'home' }));
      })(),
      renderAssets: (() => {
        const { createElement } = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const RootLayout = require('@/app/layout').default;
        const mdx = require('@/mdx-components').getMDXComponents();
        const sections = [
          require('@/components/sections/Profile').default,
          require('@/components/sections/Services').default,
          require('@/components/sections/Info').default,
          require('@/components/sections/Contact').default,
          require('@/components/ui/Header').default,
        ];
        return () =>
          [
            RootLayout({ children: null }),
            ...sections.map((C) => createElement(C, {})),
            mdx.img({ src: '/images/mdx-sample.webp', alt: '', width: 10, height: 10 }),
            mdx.img({ src: 'https://cdn.example.com/remote.webp', alt: '' }),
          ]
            .map((element) => renderToStaticMarkup(element))
            .join('\n');
      })(),
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

  it('public-folder asset hrefs (favicons, preloads, next/image src) carry the basePath once', () => {
    const html = m.renderAssets();
    const assetUrls = [...html.matchAll(/(?:href|src)="([^"]+\.(?:ico|png|webp|svg|jpg|webmanifest))"/g)].map(
      ([, url]) => url,
    );
    expect(assetUrls).toEqual(expect.arrayContaining([`${BASE_PATH}/favicons/favicon.ico`]));
    expect(assetUrls.some((u) => u.includes('/images/badges/'))).toBe(true);
    expect(assetUrls.some((u) => u.includes('/assets/img/logos/'))).toBe(true);
    expect(assetUrls).toContain(`${BASE_PATH}/images/mdx-sample.webp`);
    expect(assetUrls).toContain('https://cdn.example.com/remote.webp');
    for (const url of assetUrls.filter((u) => u.startsWith('/'))) {
      expect(url.startsWith(`${BASE_PATH}/`)).toBe(true);
      expect(url).not.toContain(doubled);
    }
  });

  it('home Navigation logo (client component) carries the basePath once', () => {
    const srcs = [...m.renderHomeNav().matchAll(/src="([^"]+)"/g)].map(([, src]) => src);
    expect(srcs).toEqual([`${BASE_PATH}/assets/img/logos/TechTavern_Logo_Inverted_Horizontal_X.svg`]);
  });

  it('Consultant Profile page images carry the basePath once', async () => {
    const [profile] = await m.profiles.getAllProfiles();
    const page = await m.consultingPage.default({ params: Promise.resolve({ slug: profile.slug }) });
    const srcs = [...m.renderToStaticMarkup(page).matchAll(/src="([^"]+)"/g)].map(([, src]) => src);
    expect(srcs).toContain(`${BASE_PATH}${profile.image}`);
    for (const src of srcs.filter((u) => u.startsWith('/'))) {
      expect(src.startsWith(`${BASE_PATH}/`)).toBe(true);
      expect(src).not.toContain(doubled);
    }
  });
});

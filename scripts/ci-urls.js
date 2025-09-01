#!/usr/bin/env node
/**
 * Generate representative URLs for CI accessibility checks against the local static server.
 * Output: newline-separated absolute URLs (http://localhost:4173/...)
 * Includes: Home (/), Articles index (/articles/), and one article (latest by date) if present.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const BASE = 'http://localhost:4173';

function listArticles() {
  try {
    const files = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => path.join(CONTENT_DIR, f));

    const parsed = files
      .map((file) => {
        try {
          const raw = fs.readFileSync(file, 'utf8');
          const { data } = matter(raw);
          const date = typeof data.date === 'string' ? data.date : null; // yyyy-mm-dd
          const slug = typeof data.slug === 'string' ? data.slug : null;
          if (!date || !slug) return null;
          return { file, date, slug };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // Sort desc by date
    parsed.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return parsed;
  } catch {
    return [];
  }
}

function articleUrlFromFrontmatter({ date, slug }) {
  // date: yyyy-mm-dd -> /articles/yyyy/mm/dd/slug/
  const [y, m, d] = date.split('-');
  const p = `/articles/${y}/${m}/${d}/${slug}/`;
  return `${BASE}${p}`;
}

function main() {
  const urls = new Set();
  urls.add(`${BASE}/`);
  urls.add(`${BASE}/articles/`);

  const list = listArticles();
  if (list.length > 0) {
    urls.add(articleUrlFromFrontmatter(list[0]));
  }

  // Print newline-separated
  for (const u of urls) {
    process.stdout.write(`${u}\n`);
  }
}

main();


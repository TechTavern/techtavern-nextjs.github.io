#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    console.warn(`Warning: failed to read ${file}: ${err && err.message ? err.message : String(err)}`);
    return null;
  }
}

function main() {
  const outDir = path.resolve(process.cwd(), 'out');
  const robotsPath = path.join(outDir, 'robots.txt');
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  const rssPath = path.join(outDir, 'rss.xml');

  const robots = read(robotsPath);
  const sitemap = read(sitemapPath);
  const rss = read(rssPath);

  const problems = [];

  // Presence checks with actionable tips
  if (!robots) {
    problems.push(
      `robots.txt not found in out/. Tip: Ensure 'src/app/robots.ts' is present and static export includes metadata routes.`
    );
  }
  if (!sitemap) {
    problems.push(
      `sitemap.xml not found in out/. Tip: Check 'src/app/sitemap.ts' (export default function sitemap) and that it uses 'export const dynamic = \"force-static\"'.`
    );
  }
  if (!rss) {
    problems.push(
      `rss.xml not found in out/. Tip: Check 'src/app/rss.xml/route.ts' and that it sets 'export const dynamic = \"force-static\"'.`
    );
  }

  // Basic structure checks
  if (robots && !/Sitemap:/i.test(robots)) {
    problems.push(
      `robots.txt missing 'Sitemap' directive. Tip: In 'src/app/robots.ts', ensure 'sitemap' points to \"${require('os').EOL}  ${"${base}/sitemap.xml"}\".`
    );
  }
  if (sitemap && !/<\s*urlset[\s>]/i.test(sitemap)) {
    problems.push(
      `sitemap.xml missing <urlset> root. Tip: Return a valid MetadataRoute.Sitemap array from 'src/app/sitemap.ts'.`
    );
  }
  if (sitemap && !/<\s*url[\s>]/i.test(sitemap)) {
    problems.push(
      `sitemap.xml contains no <url> entries. Tip: Ensure posts are returned by getAllPosts() and mapped to absolute URLs.`
    );
  }
  if (rss && !/<\s*rss[\s>]/i.test(rss)) {
    problems.push(`rss.xml missing <rss> root. Tip: Verify XML header and <rss version=\"2.0\"> in 'rss.xml/route.ts'.`);
  }
  if (rss && !/<\s*channel[\s>]/i.test(rss)) {
    problems.push(`rss.xml missing <channel>. Tip: Ensure channel metadata and items are wrapped in a <channel> element.`);
  }

  if (problems.length) {
    console.error('Output validation failed:\n- ' + problems.join('\n- '));
    process.exit(1);
  }

  console.log('Sitemap, RSS, and robots.txt validation passed.');
}

try {
  main();
} catch (err) {
  console.error(err && err.message ? err.message : String(err));
  process.exit(1);
}

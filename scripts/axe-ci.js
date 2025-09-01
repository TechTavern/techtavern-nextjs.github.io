#!/usr/bin/env node
/**
 * Run axe-core accessibility checks against a list of URLs using Puppeteer.
 * Usage: node scripts/axe-ci.js [urls-file]
 * - URLs file: newline-separated absolute URLs (default: ci-urls.txt)
 * - Fails (exit 1) on any WCAG 2.0/2.1 A/AA violations.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const urlsFile = process.argv[2] || 'ci-urls.txt';

function readUrls(file) {
  const content = fs.readFileSync(path.resolve(file), 'utf8');
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function logViolation(v) {
  console.log(`- [${v.impact || 'minor'}] ${v.id}: ${v.help} (${v.helpUrl})`);
  if (v.nodes) {
    v.nodes.slice(0, 5).forEach((n, idx) => {
      const sel = (n && n.target && n.target[0]) || 'unknown';
      console.log(`    ${idx + 1}. ${sel}`);
    });
    if (v.nodes.length > 5) {
      console.log(`    …and ${v.nodes.length - 5} more nodes`);
    }
  }
}

async function run() {
  const urls = readUrls(urlsFile);
  if (urls.length === 0) {
    console.error(`No URLs found in ${urlsFile}`);
    process.exit(1);
  }

  console.log('axe-ci: testing URLs:');
  urls.forEach((u) => console.log(`  - ${u}`));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--window-size=1280,960',
    ],
    defaultViewport: { width: 1280, height: 960 },
  });

  let totalViolations = 0;
  try {
    for (const url of urls) {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);
      console.log(`\n[axe] Navigating to ${url}`);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      // Small extra delay to settle just in case (Puppeteer v23: no page.waitForTimeout)
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      const results = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const violations = results.violations || [];
      if (violations.length) {
        console.log(`[axe] ${url} — ${violations.length} violations`);
        violations.forEach(logViolation);
        totalViolations += violations.length;
      } else {
        console.log(`[axe] ${url} — no violations`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  if (totalViolations > 0) {
    console.error(`\naxe-ci: Found ${totalViolations} total violations.`);
    process.exit(1);
  } else {
    console.log('\naxe-ci: No violations found.');
  }
}

run().catch((err) => {
  console.error('axe-ci: fatal error');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});

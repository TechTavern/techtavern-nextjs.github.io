#!/usr/bin/env node

/**
 * Verify that sufficient test data exists for Playwright tests
 * This script checks for the minimum number of articles needed for pagination testing
 */

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');
const MIN_ARTICLES_FOR_PAGINATION = 16; // With 15 items per page, need 16 for 2 pages

async function verifyTestData() {
  console.log('Verifying test data for Playwright tests...\n');

  // Check if articles directory exists
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ Articles directory not found: ${ARTICLES_DIR}`);
    process.exit(1);
  }

  // Count MDX articles
  const articles = await fg('*.mdx', {
    cwd: ARTICLES_DIR,
    absolute: false,
  });

  const articleCount = articles.length;

  console.log(`📄 Found ${articleCount} article(s) in ${ARTICLES_DIR}`);

  // Check if we have enough articles for pagination
  if (articleCount < MIN_ARTICLES_FOR_PAGINATION) {
    console.warn(
      `\n⚠️  Warning: Only ${articleCount} articles found.`
    );
    console.warn(
      `   Pagination tests require at least ${MIN_ARTICLES_FOR_PAGINATION} articles (with 15 items/page setting).`
    );
    console.warn(
      `   These tests will be automatically skipped.\n`
    );
  } else {
    console.log(
      `\n✅ Sufficient articles for pagination testing (${articleCount} >= ${MIN_ARTICLES_FOR_PAGINATION})\n`
    );
  }

  // List first few articles for verification
  if (articleCount > 0) {
    console.log('Sample articles:');
    articles.slice(0, 5).forEach((article) => {
      console.log(`  - ${article}`);
    });
    if (articleCount > 5) {
      console.log(`  ... and ${articleCount - 5} more`);
    }
    console.log('');
  }

  // Check pagination settings
  const siteConfigPath = path.join(__dirname, '..', 'src', 'lib', 'site.ts');
  if (fs.existsSync(siteConfigPath)) {
    const siteConfig = fs.readFileSync(siteConfigPath, 'utf-8');
    const itemsPerPageMatch = siteConfig.match(/defaultItemsPerPage:\s*(\d+)/);

    if (itemsPerPageMatch) {
      const itemsPerPage = parseInt(itemsPerPageMatch[1], 10);
      const totalPages = Math.ceil(articleCount / itemsPerPage);

      console.log(`⚙️  Pagination configuration:`);
      console.log(`   Items per page: ${itemsPerPage}`);
      console.log(`   Total pages: ${totalPages}`);
      console.log(`   Pagination will ${totalPages > 1 ? 'render' : 'NOT render'}\n`);
    }
  }

  return articleCount;
}

// Run verification
verifyTestData()
  .then(() => {
    console.log('✅ Test data verification complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error verifying test data:', error);
    process.exit(1);
  });

#!/usr/bin/env node

/**
 * Accessibility Test using Static Analysis
 * Tests built output for WCAG compliance without requiring browser automation
 */

const fs = require('fs');
const path = require('path');

// Check if the build output exists
const outDir = path.join(__dirname, 'out');

if (!fs.existsSync(outDir)) {
  console.log('📦 Build output not found. Please run "npm run build" first.');
  process.exit(1);
}

console.log('🔍 Static Accessibility Analysis');
console.log('================================\n');

// Read and analyze HTML files
function analyzeHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for missing lang attribute
  if (!/<html[^>]*\slang=/i.test(content)) {
    issues.push('Missing lang attribute on <html> element');
  }

  // Check for images without alt attributes
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  imgMatches.forEach((img, index) => {
    if (!img.includes('alt=')) {
      issues.push(`Image ${index + 1} missing alt attribute: ${img.substring(0, 50)}...`);
    }
  });

  // Check for form inputs without labels
  const inputMatches = content.match(/<input[^>]*>/gi) || [];
  inputMatches.forEach((input, index) => {
    if (input.includes('type="text"') || input.includes('type="email"')) {
      // Simple check - this is basic, real tools would be more sophisticated
      const hasAriaLabel = input.includes('aria-label=');
      const hasId = input.match(/id="([^"]+)"/);
      let hasLabel = false;

      if (hasId) {
        const id = hasId[1];
        hasLabel = content.includes(`for="${id}"`);
      }

      if (!hasAriaLabel && !hasLabel) {
        issues.push(`Input ${index + 1} missing accessible label: ${input.substring(0, 50)}...`);
      }
    }
  });

  // Check for headings hierarchy
  const headingMatches = content.match(/<h[1-6][^>]*>/gi) || [];
  const headingLevels = headingMatches.map(h => parseInt(h.match(/h([1-6])/i)?.[1] || '1'));

  let previousLevel = 0;
  headingLevels.forEach((level, index) => {
    if (index > 0 && level > previousLevel + 1) {
      issues.push(`Heading hierarchy skip: H${previousLevel} followed by H${level}`);
    }
    previousLevel = level;
  });

  // Check for buttons/links with meaningful text
  const buttonMatches = content.match(/<button[^>]*>.*?<\/button>/gi) || [];
  buttonMatches.forEach((button, index) => {
    const text = button.replace(/<[^>]*>/g, '').trim();
    if (!text || text.length < 2) {
      const hasAriaLabel = button.includes('aria-label=');
      if (!hasAriaLabel) {
        issues.push(`Button ${index + 1} has no accessible text`);
      }
    }
  });

  const linkMatches = content.match(/<a[^>]*>.*?<\/a>/gi) || [];
  linkMatches.forEach((link, index) => {
    const text = link.replace(/<[^>]*>/g, '').trim();
    if (!text || text.length < 2) {
      const hasAriaLabel = link.includes('aria-label=');
      if (!hasAriaLabel) {
        issues.push(`Link ${index + 1} has no accessible text`);
      }
    }
  });

  return issues;
}

// Function to scan all HTML files
function scanDirectory(dir, baseDir = dir) {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...scanDirectory(fullPath, baseDir));
    } else if (item.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath);
      const issues = analyzeHTML(fullPath);
      results.push({ file: relativePath, issues });
    }
  }

  return results;
}

// Perform the scan
console.log('Analyzing HTML files for accessibility issues...\n');

const results = scanDirectory(outDir);
let totalIssues = 0;

results.forEach(({ file, issues }) => {
  console.log(`📄 ${file}`);

  if (issues.length === 0) {
    console.log('   ✅ No accessibility issues detected');
  } else {
    issues.forEach(issue => {
      console.log(`   ❌ ${issue}`);
      totalIssues++;
    });
  }
  console.log();
});

// Summary
console.log('📊 Summary');
console.log('==========');
console.log(`Files analyzed: ${results.length}`);
console.log(`Total issues found: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('🎉 Static analysis passed! No obvious accessibility issues detected.');
  console.log('\n💡 Note: This is a basic static analysis. For comprehensive testing, use:');
  console.log('   - axe DevTools browser extension');
  console.log('   - WAVE Web Accessibility Evaluator');
  console.log('   - Manual keyboard navigation testing');
  console.log('   - Screen reader testing');
} else {
  console.log('\n🚨 Issues detected. Please review and fix the accessibility problems listed above.');
  console.log('\n💡 Additional testing recommendations:');
  console.log('   - Test with keyboard navigation');
  console.log('   - Test with screen readers');
  console.log('   - Verify color contrast in browser');
  console.log('   - Use axe DevTools for comprehensive analysis');
}

process.exit(totalIssues > 0 ? 1 : 0);
#!/usr/bin/env node
/*
  new-article.js
  Prompts for a title and date (default today), creates a new MDX file
  in content/articles with frontmatter. Contentlayer will pick it up automatically.
*/

const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline');

const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

function rlQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (answer) => { rl.close(); resolve(answer); }));
}

function formatToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isValidDateString(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function slugify(title) {
  const base = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return base || 'post';
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function uniqueFilename(date, slug) {
  let name = `${date}-${slug}.mdx`;
  let i = 2;
  while (await fileExists(path.join(articlesDir, name))) {
    name = `${date}-${slug}-${i}.mdx`;
    i += 1;
  }
  return name;
}

async function main() {
  // Ensure target directory exists
  await fs.mkdir(articlesDir, { recursive: true });

  // Title prompt (require non-empty)
  let title = '';
  while (!title) {
    title = (await rlQuestion('Article title: ')).trim();
    if (!title) console.log('Title cannot be empty.');
  }

  const today = formatToday();
  let dateStr = (await rlQuestion(`Date [${today}]: `)).trim();
  if (!dateStr) dateStr = today;
  while (!isValidDateString(dateStr)) {
    dateStr = (await rlQuestion('Please enter a valid date (YYYY-MM-DD): ')).trim();
  }

  const baseSlug = slugify(title);
  const filename = await uniqueFilename(dateStr, baseSlug);
  const slug = filename.replace(/\.mdx$/i, '').split('-').slice(3).join('-'); // final slug (may include numeric suffix)

  const filePath = path.join(articlesDir, filename);

  function yq(s) {
    return '"' + String(s).replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + '"';
  }

  // Generate all frontmatter fields with boilerplate data
  const fm = [
    '---',
    `title: ${yq(title)}`,
    `date: ${yq(dateStr)}`,
    `slug: ${yq(slug)}`,
    `excerpt: ${yq('A brief description of this article.')}`,
    `tags: ["technology", "programming"]`,
    `featuredImage: ${yq('/images/tech-tavern-default-featured.webp')}`,
    `ogTitle: ${yq(title)}`,
    `ogDescription: ${yq('A brief description of this article for social media sharing.')}`,
    `ogImage: ${yq('/images/tech-tavern-default-featured.webp')}`,
    `canonicalUrl: ${yq('https://techtavern.com/articles/' + dateStr.replace(/-/g, '/') + '/' + slug + '/')}`,
    `draft: false`,
    '---',
    ''
  ];

  const frontmatter = fm.join('\n');

  const body = [
    'This is a comprehensive article with various markdown examples to demonstrate formatting capabilities.',
    '',
    '## Introduction',
    '',
    'This section introduces the topic and provides context for the reader.',
    '',
    '## Main Content',
    '',
    '### Code Examples',
    '',
    'Here\'s a JavaScript code block:',
    '',
    '```javascript',
    'function greet(name) {',
    '  return `Hello, ${name}!`;',
    '}',
    '',
    'console.log(greet("World"));',
    '```',
    '',
    '### Lists and Formatting',
    '',
    'Unordered list:',
    '- First item',
    '- Second item with **bold text**',
    '- Third item with *italic text*',
    '- Fourth item with `inline code`',
    '',
    'Ordered list:',
    '1. First step',
    '2. Second step',
    '3. Third step',
    '',
    '### Links and Images',
    '',
    'Here\'s a [link to Google](https://google.com) and an image:',
    '',
    '![Alt text](/images/example.jpg)',
    '',
    '### Tables',
    '',
    '| Feature | Description | Status |',
    '|---------|-------------|--------|',
    '| Feature A | Does something cool | ✅ Complete |',
    '| Feature B | Does something else | 🚧 In Progress |',
    '| Feature C | Future enhancement | 📋 Planned |',
    '',
    '### Blockquotes',
    '',
    '> This is an important quote or callout that stands out from the rest of the content.',
    '>',
    '> It can span multiple lines and provide additional context or emphasis.',
    '',
    '### Technical Details',
    '',
    'Sometimes you need to show command line examples:',
    '',
    '```bash',
    'npm install package-name',
    'npm run build',
    'npm start',
    '```',
    '',
    'Or configuration files:',
    '',
    '```json',
    '{',
    '  "name": "example-project",',
    '  "version": "1.0.0",',
    '  "scripts": {',
    '    "start": "node index.js"',
    '  }',
    '}',
    '```',
    '',
    '## Conclusion',
    '',
    'This section wraps up the article and provides key takeaways or next steps.',
    '',
    '### Key Points',
    '',
    '- Point one summarizing important information',
    '- Point two with actionable advice',
    '- Point three looking toward the future',
    '',
    '---',
    '',
    '*Replace this content with your actual article. This template provides examples of common markdown formatting you might use.*',
    '',
  ].join('\n');

  await fs.writeFile(filePath, `${frontmatter}${body}`, 'utf8');
  console.log(`\nCreated: ${path.relative(rootDir, filePath)}`);
  console.log('Contentlayer will automatically include this file on the next build/dev refresh.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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
  // Extra metadata prompts
  const excerpt = (await rlQuestion('Excerpt (optional): ')).trim();
  const tagsInput = (await rlQuestion('Tags (comma-separated, optional): ')).trim();
  const featuredImage = (await rlQuestion('Featured image path (optional): ')).trim();

  function yq(s) {
    return '"' + String(s).replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + '"';
  }

  const tags = tagsInput
    ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const fm = [
    '---',
    `title: ${yq(title)}`,
    `date: ${dateStr}`,
    `slug: ${yq(slug)}`,
  ];
  if (excerpt) fm.push(`excerpt: ${yq(excerpt)}`);
  if (tags.length) fm.push(`tags: [${tags.map((t) => yq(t)).join(', ')}]`);
  if (featuredImage) fm.push(`featuredImage: ${yq(featuredImage)}`);
  fm.push('---', '');

  const frontmatter = fm.join('\n');

  const body = [
    `# ${title}`,
    '',
    'Write your article here. Replace this with your content.',
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

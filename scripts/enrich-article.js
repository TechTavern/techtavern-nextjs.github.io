#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const OpenAI = require('openai');

const projectRoot = path.resolve(__dirname, '..');
const defaultModel = 'gpt-5-mini';

function parseArgs(argv) {
  const args = argv.slice(2);
  let targetPath;
  let dryRun = false;

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown flag: ${arg}`);
    }

    if (targetPath) {
      throw new Error('Only one path argument is supported.');
    }

    targetPath = arg;
  }

  if (process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true') {
    dryRun = true;
  }

  return { targetPath, dryRun };
}

function loadEnvConfig(rootDir) {
  const env = { ...process.env };
  const envFilePath = path.join(rootDir, '.env.local');

  if (fs.existsSync(envFilePath)) {
    const lines = fs.readFileSync(envFilePath, 'utf8').split('\n');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const idx = line.indexOf('=');
      if (idx === -1) {
        continue;
      }

      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (!key) {
        continue;
      }

      env[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY. Add it to your environment or .env.local.');
  }

  return {
    apiKey,
    model: env.OPENAI_MODEL || defaultModel,
  };
}

async function resolveTargets(targetPath) {
  const defaultDir = path.join(projectRoot, 'content', 'articles');
  const resolvedPath = path.resolve(projectRoot, targetPath || defaultDir);
  let stats;

  try {
    stats = await fs.promises.stat(resolvedPath);
  } catch (error) {
    throw new Error(`Path not found: ${resolvedPath}`, { cause: error });
  }

  if (stats.isDirectory()) {
    const entries = await fs.promises.readdir(resolvedPath);
    const mdxFiles = entries
      .filter((entry) => entry.endsWith('.mdx'))
      .map((entry) => path.join(resolvedPath, entry));

    return mdxFiles.sort();
  }

  if (stats.isFile()) {
    if (!resolvedPath.endsWith('.mdx')) {
      throw new Error('Only .mdx files are supported.');
    }

    return [resolvedPath];
  }

  throw new Error('Target path must be a file or directory containing .mdx files.');
}

function needsEnrichment(data) {
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt.trim() : '';
  const tags = Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === 'string' && tag.trim()) : [];

  return {
    needsExcerpt: excerpt.length === 0,
    needsTags: tags.length === 0,
  };
}

function toTitleCaseWord(word) {
  if (word.length === 0) {
    return false;
  }
  return /^[A-Z][a-z0-9]*$/.test(word);
}

function validateTags(tags) {
  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array.');
  }

  const cleaned = tags.map((tag) => (typeof tag === 'string' ? tag.trim() : ''));

  if (cleaned.some((tag) => !tag)) {
    throw new Error('Tags must be non-empty strings.');
  }

  if (cleaned.length < 2 || cleaned.length > 5) {
    throw new Error('Tags must contain between 2 and 5 items.');
  }

  for (const tag of cleaned) {
    const words = tag.split(' ');
    if (!words.every(toTitleCaseWord)) {
      throw new Error(`Tag "${tag}" must use Title Case.`);
    }
  }

  return cleaned;
}

function validateExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error('Excerpt must be a string.');
  }

  const trimmed = excerpt.trim();

  if (trimmed.length < 100 || trimmed.length > 160) {
    throw new Error('Excerpt must be between 100 and 160 characters.');
  }

  if (/\r|\n/.test(trimmed)) {
    throw new Error('Excerpt must be a single paragraph without newlines.');
  }

  return trimmed;
}

function buildSystemPrompt() {
  return [
    'You enhance blog frontmatter with an excerpt and tags.',
    'Rules for excerpt:',
    '- 100-160 characters after trimming.',
    '- Single paragraph, no newlines.',
    '- First sentence highlights primary keywords.',
    '- Use active voice, specific numbers or benefits when possible.',
    '- Address a clear pain point and end with a curiosity-driven value proposition.',
    'Rules for tags:',
    '- Array of 2-5 Title Case strings.',
    '- Each tag is trimmed, non-empty, and capitalized (first letter upper, rest lower).',
    'Return a JSON object { "excerpt": string, "tags": string[] } in plain text without extra commentary.',
  ].join('\n');
}

function buildUserPrompt(frontmatter, body) {
  const title = typeof frontmatter.title === 'string' ? frontmatter.title : 'Untitled Article';
  return `Title: ${title}\n\nBody:\n${body}`;
}

function extractJsonPayload(response) {
  if (response && typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  if (Array.isArray(response?.output)) {
    for (const item of response.output) {
      if (item?.type === 'message' && Array.isArray(item.content)) {
        for (const block of item.content) {
          if (block?.type === 'text' && typeof block.text === 'string' && block.text.trim()) {
            return block.text.trim();
          }
        }
      }

      if (item?.type === 'output_text' && typeof item.text === 'string' && item.text.trim()) {
        return item.text.trim();
      }
    }
  }

  throw new Error('No textual output received from OpenAI response.');
}

function parseGeneratedPayload(rawText) {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Response did not include a JSON object.');
  }

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    throw new Error('Failed to parse JSON payload from OpenAI response.', { cause: error });
  }
}

async function callOpenAI(client, model, systemPrompt, userPrompt) {
  const response = await client.responses.create({
    model,
    instructions: systemPrompt,
    input: userPrompt,
  });

  const rawText = extractJsonPayload(response);
  const parsed = parseGeneratedPayload(rawText);
  const excerpt = validateExcerpt(parsed.excerpt);
  const tags = validateTags(parsed.tags);

  return { excerpt, tags };
}

async function processFile(filePath, context) {
  const relativePath = path.relative(projectRoot, filePath);
  const source = await fs.promises.readFile(filePath, 'utf8');
  const parsed = matter(source);
  const { needsExcerpt, needsTags } = needsEnrichment(parsed.data);

  if (!needsExcerpt && !needsTags) {
    context.logger(`Skipping ${relativePath} (excerpt and tags already present).`);
    return { status: 'skipped' };
  }

  if (context.dryRun) {
    context.logger(`[dry-run] Would enrich ${relativePath}`);
    return { status: 'planned' };
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(parsed.data, parsed.content);
  const enrichment = await callOpenAI(context.client, context.model, systemPrompt, userPrompt);

  const updatedData = { ...parsed.data };
  if (needsExcerpt) {
    updatedData.excerpt = enrichment.excerpt;
  }
  if (needsTags) {
    updatedData.tags = enrichment.tags;
  }

  const output = matter.stringify(parsed.content, updatedData, { lineWidth: 120 });
  await fs.promises.writeFile(filePath, output, 'utf8');

  context.logger(`Enriched ${relativePath}`);
  return { status: 'updated' };
}

async function main() {
  const { targetPath, dryRun } = parseArgs(process.argv);
  const config = loadEnvConfig(projectRoot);
  const targets = await resolveTargets(targetPath);

  if (targets.length === 0) {
    console.log('No .mdx files found to process.');
    return;
  }

  const client = new OpenAI({ apiKey: config.apiKey });
  const context = {
    client,
    model: config.model,
    dryRun,
    logger: (message) => console.log(message),
  };

  const totals = { updated: 0, skipped: 0, planned: 0, errors: 0 };

  for (const filePath of targets) {
    try {
      const result = await processFile(filePath, context);
      if (result.status === 'updated') {
        totals.updated += 1;
      } else if (result.status === 'skipped') {
        totals.skipped += 1;
      } else if (result.status === 'planned') {
        totals.planned += 1;
      }
    } catch (error) {
      totals.errors += 1;
      console.error(`Error processing ${path.relative(projectRoot, filePath)}: ${error.message}`);
    }
  }

  if (dryRun) {
    console.log(`Summary: planned ${totals.planned}, skipped ${totals.skipped}, errors ${totals.errors}`);
  } else {
    console.log(`Summary: updated ${totals.updated}, skipped ${totals.skipped}, errors ${totals.errors}`);
  }

  if (totals.errors > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

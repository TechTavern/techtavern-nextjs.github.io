# Development Plan

This fill will contain development plan information for the application.

## AI excerpt and tagging script

Below is a prompt to use for the creation of a script.  For some reason ChatGPT-5 can't create an error free script for it's own API.  

```markdown
You are a senior Node.js engineer. Generate a single-file script named `scripts/enrich-article.js` for a Next.js content repo.

Environment / dependencies:
- CommonJS module syntax, Node 18+ (global `fetch` available).
- Use only core modules plus `gray-matter` (assume it is installed).
- Do not introduce extra packages or helper files.

Functional requirements:
1. If supplied with an `.mdx` file, act only on that file.  If supplied with a directory discover every `.mdx` file under `content/articles/` (non-recursive).
2. Parse each file’s frontmatter and body with `gray-matter`.
3. Determine whether the frontmatter needs enrichment:
   - `excerpt`: string, trimmed length between 100 and 160 characters inclusive, single paragraph (no newlines).
   - `tags`: array of 2–5 strings; every entry trimmed, non-empty, and Title Case (first letter capitalized, remaining lower except interior spaces).
   - Skip a file entirely when both fields already satisfy these rules.
4. For files needing enrichment, call OpenAI’s Responses API (`POST https://api.openai.com/v1/responses`) with:
   - `model`: value from `OPENAI_MODEL` env var or `.env.local`, default `'gpt-4.1-mini'`.
   - `input`: a list containing one `role: "system"` instruction (restate the excerpt/tag rules) and one `role: "user"` message with article title plus full Markdown body.
   - `max_output_tokens`: 1000.
   - `temperature`: 0.5.
   - Authorization header using `OPENAI_API_KEY`.
5. Expect the model to return a JSON object `{ "excerpt": "...", "tags": ["..."] }` in its first text segment. Parse it defensively, re-validate the excerpt/tag rules, and bail on that file with a clear error if parsing or validation fails.
6. When enrichment succeeds, update the frontmatter in place while preserving markdown body formatting.
7. Add a CLI `--dry-run` flag (or `DRY_RUN=1`) that skips API calls and file writes but prints which files would be processed.
8. Log progress with concise, human-friendly messages and print a summary totals line (updated / skipped / errors) when finished.
9. Exit with status code 1 if any unexpected error bubbles out.

Implementation notes:
- Provide a small helper to read `.env.local` (key=value, `#` comments) and merge with `process.env`. Throw a descriptive error if the API key is missing after merge.
- Wrap the main loop in `async function main()` and call it at the end with `.catch`.
- Keep the script well-structured (helpers like `needsEnrichment`, `callOpenAI`, `updateFrontmatter`). Use early returns instead of deep nesting. Add minimal inline comments only where logic is non-obvious.
```
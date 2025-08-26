# Pull Request Checklist

## Summary
- Briefly describe the change and its purpose.
- Note any user-facing impact or deployment considerations.

## Screenshots (UI changes)
- Before:
- After:

## Checklist
- [ ] Linked issue(s): Closes #<id>
- [ ] Type of change: feat | fix | docs | chore | refactor | perf | test
- [ ] Scope is focused (small, single-topic PR)
- [ ] Ran locally:
  - [ ] `win-npm run dev` (or `npm run dev`)
  - [ ] `win-npm run build` (or `npm run build`)
  - [ ] `win-npm run lint` and `win-npm run typecheck`
- [ ] Content updates (if applicable):
  - [ ] MDX added/changed in `content/articles/` with filename `YYYY-MM-DD-slug.mdx`
  - [ ] Frontmatter includes `title`, `date` (yyyy-mm-dd), `slug`
  - [ ] `src/lib/mdx-imports.ts` updated and route verified at `/articles/YYYY/MM/DD/slug/`
- [ ] Code quality: ESLint clean; follows component (PascalCase) and route (lowercase) naming
- [ ] Accessibility: images have `alt`; interactive elements are keyboard-accessible
- [ ] Security/CSP: assets load under current CSP; no unsafe inline scripts/styles
- [ ] Base path awareness: respects `NEXT_PUBLIC_BASE_PATH` where relevant
- [ ] Docs updated (README/AGENTS) if behavior or commands changed
- [ ] CI checks passing

## Notes for Reviewers
- Architecture and naming align with `src/app`, `src/components`, `src/lib` conventions
- No unnecessary `any`; TS types are explicit
- Consider test impact/needs (when test stack is introduced)

## Additional Notes
- Include migration/config notes (env vars, Pages settings) if needed.

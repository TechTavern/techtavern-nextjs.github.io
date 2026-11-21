# Turbopack builds in agent worktrees

On 2026-11-21, agents in `.claude/worktrees/*` that symlinked `node_modules` from the main checkout could not run `npm run build`: Turbopack rejects a `node_modules` outside the workspace root. Workarounds used: `next build --webpack`, or `cp -al <main>/node_modules ./node_modules` (hardlinked copy, cheap). The hardlink copy keeps the real build command, so prefer it in agent briefs.

---
'@rolling-dice-app/core': major
---

Rename package from `@rolling-dice-app/types` to `@rolling-dice-app/core` and
reposition it as the shared **domain core** (types + pure DND rules) consumed
by frontend and backend.

Restructure:

- All existing types moved under `src/types/` (`character/`, `dnd/`,
  `combat.ts`, `spell.ts`, `plan-limits.ts`). No type contents changed.
- New empty `src/rules/` introduced as the home for pure SRD-baseline
  derivation functions; rules will land in follow-up PRs.
- `src/index.ts` now re-exports `./types` and `./rules` — root imports stay
  flat for consumers.

This is a hard break: no alias package is published. Consumers must update
both `package.json` and import specifiers from `@rolling-dice-app/types` to
`@rolling-dice-app/core`. Re-export surface is unchanged for existing types.

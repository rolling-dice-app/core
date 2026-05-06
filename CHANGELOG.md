# @rolling-dice-app/types

## 1.1.0

### Minor Changes

- e87f049: Spell type spec adjustment: add `engName: string`, `source: SourceKey`,
  `classes: ProfessionKey[]` to `SpellDto`. New `SourceKey` union enumerates
  the 11 sourcebook codes currently present in shipped spell data
  (PHB / XGE / TCE / FTD / EGW / GGR / SCC / TDCSR / AAG / AI / BMT).

  Additive change for consumers — existing `SpellDto` consumers continue to
  compile, but constructing a `SpellDto` literal now requires the three new
  fields.

## 1.0.0

### Major Changes

- b5c1322: Rename package from `@rolling-dice-app/types` to `@rolling-dice-app/core` and
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

## 0.2.0

### Minor Changes

- 3a84155: Add `PlanLimits` type and `FREE_PLAN_LIMITS` constant to define per-account usage caps (characters, items, campaign records, attacks, features, custom spells, plus content length limits). Used by backend for enforcement and frontend for UX gating.

### Patch Changes

- 5abfb19: Add Prettier with shared config aligned to backend/frontend, plus `.editorconfig`. New `format` / `format:check` scripts; CI Release workflow now gates on `pnpm format:check`. No public API change.

## 0.1.0

### Minor Changes

- e6ab592: initial release: extract shared persistent types from frontend (character / combat / dnd / spell)

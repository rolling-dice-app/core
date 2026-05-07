# @rolling-dice-app/types

## 2.1.1

### Patch Changes

- 7443830: Extract `DieType` and `DamageDieType` from `dnd/misc.ts` into a dedicated
  `dnd/dice.ts`. Dice are a core DND mechanic, not a "miscellaneous" concept,
  and deserve their own file alongside `ability-key`, `class`, `skill`, etc.

  Internal-only refactor. Both types continue to be re-exported from the
  root barrel (`@rolling-dice-app/core`), so consumer imports do not change.

- fd2ee3d: Switch build to `moduleResolution: NodeNext` and add explicit `.js`
  extensions to all relative imports / re-exports in source.

  Previously `core` built with `moduleResolution: Bundler`, which produced
  `dist/**/*.js` containing extensionless imports like
  `export * from './types'`. Bundler-based consumers (Vite / Nuxt / webpack)
  handle this fine, but Node's native ESM resolver is strict and throws
  `ERR_UNSUPPORTED_DIR_IMPORT`, making the package unusable from a plain
  Node runtime — including the backend (Fastify under `tsx` / `node`).

  No public API changes. Consumers continue to write
  `import { ... } from '@rolling-dice-app/core'` exactly as before; only the
  internal dist resolution paths now satisfy the NodeNext spec.

## 2.1.0

### Minor Changes

- fe855ba: Add `UserDTO` — the shared public user contract consumed directly by both
  frontend and backend (auth/profile responses, character ownership, …).

  Fields: `id`, `email`, `displayName`, `avatarUrl: string | null`,
  `createdAt` (ISO 8601 string).

  Also pin the `DTO` suffix naming convention via a TODO in
  `src/types/index.ts`: only top-level HTTP request/response shapes get the
  suffix; sub-shapes (`AbilityScoreEntry`, `ArmorClassConfig`, `SpellLevel`, …)
  do not. Existing `Character` / `CombatState` are left unrenamed for now and
  will be migrated when those areas next change, to avoid a rename-only major
  release.

## 2.0.0

### Major Changes

- 7dd0578: Rename `profession` → `class` to align with DND 5e official terminology.

  Renamed types: `ProfessionKey` → `ClassKey`,
  `SubprofessionKey` → `SubclassKey`, `ProfessionData` → `ClassData`,
  `ProfessionEntry` → `ClassEntry`, `CharacterProfessions` → `CharacterClasses`.

  Renamed properties: `CharacterClasses.professions` → `classes`,
  `ClassEntry.profession` → `classKey` (avoids TS reserved word `class`),
  `ClassEntry.subprofession` → `subclass`.

  String literal members (`'fighter'`, `'wizard'`, `'champion'`,
  `'wildMagicSorcerer'`, …) are unchanged.

  Migration: rename imports / property accesses 1:1. Frontend and backend
  should upgrade in lockstep.

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

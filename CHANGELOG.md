# @rolling-dice-app/types

## 3.0.0

### Major Changes

- 9a9309e: Remove the `ClassData` interface. The three fields are split by ownership:
  - `label` (Chinese display string) — leaves `core` entirely; how to
    store / source class labels (hardcoded mapping, i18n, etc.) is the
    consumer's concern.
  - `hitDie` and `savingThrowProficiencies` — kept as SRD facts but
    unbundled into two parallel runtime constants:
    - `CLASS_HIT_DICE: Readonly<Record<ClassKey, DieType>>`
    - `CLASS_SAVING_THROW_PROFICIENCIES: Readonly<Record<ClassKey, readonly AbilityKey[]>>`

  Rationale: the original `ClassData` had cross-concerns — `label` is UI,
  the other two are SRD rule facts. The two SRD fields also have no
  shared consumer (different future `derive*` rules will use one or the
  other), so bundling them was artificial cohesion. Splitting now also
  avoids the pattern becoming a god-object as more SRD per-class data
  (spellcaster type, primary ability, etc.) lands.

  Migration: replace `CLASS_CONFIG[key].hitDie` →
  `CLASS_HIT_DICE[key]` and `CLASS_CONFIG[key].savingThrowProficiencies` →
  `CLASS_SAVING_THROW_PROFICIENCIES[key]`. Build any local label table in
  the consumer.

- bb34349: `DieType` and `DamageDieType` now use numeric face counts instead of
  `'d4' | 'd6' | ...` string literals.

  ```ts
  // before
  type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
  type DamageDieType = Extract<DieType, 'd4' | 'd6' | 'd8' | 'd10' | 'd12'>

  // after
  type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100
  type DamageDieType = Extract<DieType, 4 | 6 | 8 | 10 | 12>
  ```

  Rationale: the `'d'` prefix is a written / display notation, not the die's
  identity. A die is identified by its face count; rendering as `"d10"` /
  `"10-sided"` / icon is a presentation choice that belongs to the consumer.

  Migration: persisted / passed values change from `'d6'` to `6`. Consumers
  that need to render the `"d"` prefix can format inline (`` `d${value}` ``).

- 38651fd: Remove `CharacterTier` (`'common' | 'elite' | 'master' | 'legendary'`).

  This was a UI-flavor classification — gacha-style rarity grading rather
  than a SRD concept (DND 5e's "tier of play" uses 1/2/3/4 with no such
  labels). No `Character` field referenced it; the value was always derived
  from level by a frontend helper (`getCharacterTier(level)`).

  Such product-specific UI grading belongs in the consumer that displays
  it. Both the type and any `level → tier` mapping should live in the
  frontend.

- df4e1a1: Remove the `Spell` type alias. `SpellDto` is now the single name for the
  spell contract.

  The two names had identical shapes but unclear semantic distinction
  (the JSDoc claimed `Spell` was "normalized for UI" but no normalization
  existed). The DTO suffix matches the convention pinned in `2.0.0`'s
  `UserDTO` introduction.

  Migration: replace `import type { Spell } from '@rolling-dice-app/core'`
  with `import type { SpellDto }` and rename references accordingly.

### Patch Changes

- 0c15168: Remove JSDoc comments that prescribed UI behavior or referenced
  frontend file paths:
  - `combat.ts` `CombatHp.current` no longer suggests "UI 應顯示
    effectiveMaxHp" — display fallback is the consumer's choice.
  - `spell.ts` `SpellSchool` no longer mentions "中文僅為顯示 label"
    (no labels live in this file).
  - `spell.ts` `SpellDto` no longer references `public/json/spells.json`
    (a frontend asset path that should not appear in `core`).

  Pure documentation cleanup; no shape changes.

- ca97be3: Split the catch-all `dnd/misc.ts` into one file per concept, matching
  the existing `dnd/` convention (`ability-key.ts`, `dice.ts`, `skill.ts`,
  etc.):
  - `dnd/size.ts` — `SizeKey`
  - `dnd/gender.ts` — `GenderKey`
  - `dnd/armor-type.ts` — `ArmorType`
  - `dnd/weapon-type.ts` — `WeaponType`
  - `dnd/damage-type.ts` — `DamageTypeKey`

  `dnd/misc.ts` is removed. Public API is unchanged — the root barrel
  continues to re-export every type, so consumer imports
  (`import type { SizeKey } from '@rolling-dice-app/core'`) work as before.

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

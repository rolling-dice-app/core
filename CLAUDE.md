# CLAUDE.md

Highest-priority instructions for working inside the `rolling-dice-app/core`
repository. When this file conflicts with any local instruction, this file
wins.

This repo publishes `@rolling-dice-app/core` to GitHub Packages — the shared
**domain core** consumed by `frontend` and (future) `backend`. It is the
upgrade of what used to be `@rolling-dice-app/types`: same boundary discipline,
broader responsibility (types + pure DND rules).

## Required Reading: Org-Level Guidelines

Before any non-trivial change, read the org-level constitution documents:

- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/product-architecture.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/core-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/frontend-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/backend-skills.md>

## Mental model

`core` defines the shared **domain language**. Three layers:

| Layer       | Purpose                                                  | Lives in       |
| ----------- | -------------------------------------------------------- | -------------- |
| `types/`    | What the shared domain data is                           | `src/types`    |
| `rules/`    | How stable domain values are derived                     | `src/rules`    |
| `defaults/` | Published-baseline starting values and default factories | `src/defaults` |

`defaults/` follows the same pure / published-baseline contract as `rules/`
(no framework imports, no I/O, no time/RNG, deterministic). The split is
semantic: `rules/` answers "how is this value computed", `defaults/`
answers "what is the published-baseline starting value when none is
provided".

In one sentence:

> `core` defines what the shared domain data is, how stable domain values
> are derived, and what their published-baseline starting values look like.
> `frontend` defines how the data is presented and interacted with.
> `backend` defines who can access or persist the data.

## Allowed in `core`

**`types/`**

- Domain entity types: `Character`, `CharacterProfile`, `CharacterCombatState`,
  `Spell`, `Item`, `Feature`, `CampaignRecord`, …
- Domain key unions: `AbilityKey`, `SkillKey`, `ClassKey`, `ArmorType`, …
- API DTOs **only when they are stable public contracts consumed directly by
  both frontend and backend**. Backend-owned validation schemas, DB rows,
  route-local request shapes, and implementation-specific response mappers
  stay in backend. If only one side needs the shape, it does not belong here.
- Stable domain contracts that change in lockstep across the product.

**`rules/`**

- Pure derivation functions for published-baseline values:
  `deriveAbilityModifier`, `deriveProficiencyBonus`,
  `deriveSavingThrowModifier`, `deriveSkillModifier`, `deriveArmorClass`,
  `deriveMaxHitPoints`, `derivePassivePerception`, `deriveInitiative`, …
- Internal lookup data (e.g. proficiency-bonus-by-level table) **only when a
  rule needs it as an implementation detail**, colocated with the rule.

**`defaults/`**

- Published-baseline starting constants (e.g. `UNARMORED_AC_BASE`,
  `DEFAULT_CURRENCY`) and pure factories that build the initial state of a
  `core` entity (e.g. `createDefaultArmorClass`, `createDefaultInventory`,
  `buildCharacterCreateDefaults`).
- Layout: one file per domain (`character.ts`, future `combat.ts`,
  `spell.ts`, …); the barrel `defaults/index.ts` re-exports each.
- Same purity contract as `rules/`. Factories must return a fresh object
  per call (do not leak shared references) and must not encode house-rule
  policy without a published source — they construct the published-baseline
  starting shape, nothing more.

## Forbidden in `core`

- Vue / Nuxt composables, plugins, or anything `<script setup>`
- Fastify routes, plugins, request lifecycle code
- Drizzle / Prisma / any database schema
- Runtime validation schemas (Zod, Valibot, Yup, …) — these belong in the
  consumer that owns the boundary
- Backend request/response schemas, frontend form schemas, frontend view
  models
- UI labels, i18n keys, Chinese/English display strings, select options, form
  sections, display order, page-level config
- Anything that touches `localStorage`, cookies, sessions, HTTP clients, or
  `process.env`
- Anything that imports a runtime framework or browser/Node-only API

## The pure-rules contract

A function added under `src/rules/` MUST:

- have no dependency on Vue, Nuxt, Fastify, Drizzle, browser, or Node runtime
  APIs
- not read or write `localStorage`, `cookie`, `sessionStorage`, `fetch`,
  `process.env`, or any global mutable state
- return the **same output for the same input** every time (deterministic,
  no `Date.now()`, no `Math.random()`, no I/O)
- only know about types defined in `core` itself or primitive TypeScript
  types

A rule answers **"how is this value computed"**. It does **not** answer "when
should it run", "how should it be displayed", or "where should it be stored".

When the first real `derive*` lands, it MUST land with unit tests. Vitest
will be added to `devDependencies` at that point — not before.

## Content sources and published-baseline rules

`core` is **not** restricted to the SRD 5.1 subset. As of 2026-05-27 (D3
decision in `docs/review/README.md`), `core` accepts D&D 5e content from
the following published sources:

- **PHB** — Player's Handbook
- **XGE** — Xanathar's Guide to Everything
- **TCE** — Tasha's Cauldron of Everything
- **TDCSR / EGW / CR-related** — Critical Role's official 5e publications
- additional sources listed in `SPELL_SOURCES` (and a future
  `SUBCLASS_SOURCES`) as they are added

Domain enums (`CLASS_KEYS`, `SUBCLASS_KEYS`, `SPELL_SOURCES`,
`DAMAGE_TYPE_KEYS`, …) may include any entry that originates from these
sources. When `SUBCLASS_KEYS` grows beyond a handful of entries per class,
add a `SUBCLASS_SOURCES` lookup table (mirroring `SPELL_SOURCES`) so
consumers can filter by source set if they ever need to.

Mechanic rules under `rules/` and `defaults/` ship the **published
baseline** from the same source set:

- Base mechanics from PHB (ability modifier, proficiency bonus, spell-slot
  tables, attunement limit, etc.)
- Errata and rule corrections published by WotC — most notably Tasha's
  rulings such as _artificer multiclass = round-up half-caster_
- Subclass / spell / item mechanics published in XGE / TCE / CR books

What `core` rules and defaults must **not** encode is a house-rule policy
with **no published source**. The decision rule is "can you cite the book
and page?" — if not, it does not go into a `core` constant or `derive*`
default. Examples:

- Raising the attunement limit above the PHB baseline of 3 with a flat
  invented bonus (e.g. `BASE + EXTRA = 6` with no source). Character-level
  effects that raise the cap (Artificer's Magic Item Adept / Savant /
  Master) belong in the rule logic because they have a published source;
  flat product-wide raises do not and belong in character data fields or
  DM tool layers.
- "Always grant +1 AC for shields" or "use average HP per level as the
  default" — fictitious or DM-preference policies with no published source.

User-provided overrides may flow through as **rule inputs** when they are
part of the shared domain type — fields like `customBonus`, `override`,
`manualAdjustment`, `spellSlotsDelta` on a `Character` or `CombatState`
are legitimate inputs to a `derive*` function and let DM rulings, player
customizations, and in-story rewards flow through. The rule defines the
published computation; the data carries variance that has no fixed source.

### Permissive exceptions

`rolling-dice-app` is a character-sheet tool, not a RAW enforcer. In two
narrow scenarios `core` may deliberately ship a value or interpretation
that is **more permissive than the strictest RAW baseline**:

1. **Permissive caps** — limit upper bounds (e.g. attunement, prepared
   spell count) shipped looser than RAW.
2. **Permissive interpretations** — when published text is genuinely
   ambiguous and multiple readings are defensible, pick the one that
   gives the player more headroom (or saves dev cost) rather than the
   strictest one.

Both forms share the same justifications and gates:

**Allowed reasons:**

- **Avoid implementing complex progressive published rules** when the
  product judges the dev cost outweighs the benefit. The cap or
  interpretation should match the maximum reachable value under the
  published rule set so a character that _would_ reach it under RAW is
  never restricted.
- **Accommodate the player's table house-rules** so a DM who has granted
  the player more headroom is not blocked by the system.

**Required conditions (all three):**

- The value is an **upper bound or generous interpretation** — players can
  stay below / pick the stricter outcome freely; nothing is forced.
- It does not silently overwrite a tighter published default that the
  player expects (UI / docs surface the chosen value where relevant).
- It is **recorded in one of the catalogues below** with reason cited.

#### Catalogue of permissive caps

| Cap              | Constant / function                                                         | RAW baseline                                                            | Permissive value           | Reason                                                                                               |
| ---------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Attunement limit | `attunement.computeAttunedLimit` (`BASE_ATTUNED_SLOT + EXTRA_ATTUNED_SLOT`) | PHB = 3; Tasha lets Artificer 10/14/18 progressively raise to 4 / 5 / 6 | flat 6 for every character | Skip artificer-level mapping (dev cost); also accommodate DM house-rules that grant extra attunement |

#### Catalogue of permissive interpretations

| Rule                                                        | Location                                                                                                 | Stricter reading                                                                                                                                  | Permissive reading shipped                                                                                                                                                                                                                                         | Reason                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Multiclass effective-level rounding (primary vs multiclass) | `rules/spell-slots.ts` `getSuggestedRegularSpellSlots` (the per-class `index === 0 ? ceil : floor` step) | PHB p.165 reads as "all classes rounded down" (only artificer rounds up per Tasha). D&D Beyond / Roll20 round every multiclass caster level down. | Round the **primary class** (`classes[0]`, consistent with `rules/hp.ts`) spellcasting level **up (ceil)**, and every **multiclass (non-primary) class down (floor)** — artificer included (its category no longer forces round-up when it is a multiclass entry). | PHB does not unambiguously fix the rounding direction per class position; this follows the common character-sheet-tool convention and is more generous for a primary half/third caster (consistent with the permissive philosophy). It also makes single-class EK/AT (which route through this path) round up, matching the PHB single-class third-caster table exactly. |

When adding a new permissive cap or interpretation, extend the relevant
table and cite the reason. Reviewers must check both catalogues before
flagging "exceeds RAW" or "wrong ruling" as an issue.

## Why `schemas/` is not in `core`

- Backend runtime schemas track DB shape and HTTP boundary, and change with
  routes / services / repositories.
- Frontend form schemas track form flow and UX, and change with the UI.
- Both have a faster change cadence than shared domain contracts; folding
  them into `core` would force unrelated version churn on every consumer.

`core` keeps the shared **types** and the shared **derivations**. Each
consumer brings its own runtime validation.

## Repo Layout

```txt
core/
├─ src/
│  ├─ types/
│  │  ├─ character/        # CharacterProfile, abilities, attacks, features, …
│  │  ├─ dnd/              # AbilityKey, SkillKey, ClassKey, …
│  │  ├─ combat.ts
│  │  ├─ spell.ts
│  │  ├─ plan-limits.ts
│  │  └─ index.ts
│  ├─ rules/
│  │  └─ index.ts          # barrel; derive* functions land here
│  ├─ defaults/
│  │  ├─ character.ts      # published-baseline constants + default factories
│  │  └─ index.ts          # barrel
│  └─ index.ts             # root barrel
├─ .changeset/
├─ .github/workflows/
├─ dist/                   # build output, gitignored
├─ package.json            # name: @rolling-dice-app/core
├─ tsconfig.json
└─ README.md
```

## Common Commands

```sh
pnpm install
pnpm build             # tsc → dist/ (.d.ts + .js + sourcemaps)
pnpm clean             # rm -rf dist
pnpm type-check        # tsc --noEmit
pnpm format            # prettier --write .
pnpm format:check      # prettier --check . (CI gate)
pnpm changeset         # record release notes (interactive prompt)
```

Versioning and publishing run **only** in CI — see "Release Workflow" below.
Do not invoke `pnpm changeset version` or `pnpm changeset publish` locally.

## TypeScript / Module config

- `verbatimModuleSyntax: true` — all cross-file type re-exports use
  `import type` / `export type`.
- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`,
  `noFallthroughCasesInSwitch: true`.
- `declaration: true`, `declarationMap: true`, `sourceMap: true` — consumers
  navigate to source.
- ESM only (`"type": "module"`). No CommonJS.
- Each file is a module; barrels use `export *`.

## Adding a new type

1. Apply the responsibility checklist below.
2. Pick the file under `src/types/<area>/`.
3. Use `interface` for object shapes; `type` for unions / aliases.
4. Add a JSDoc one-liner — what it is, not why.
5. Re-export through the local `index.ts` barrel.
6. `pnpm format && pnpm type-check && pnpm build`.
7. `pnpm changeset` (patch / minor / major).
8. Commit source change + changeset together.

## Adding a new rule

1. Confirm it implements a mechanic from one of the accepted published
   sources (see "Content sources and published-baseline rules") and is
   stable across product surfaces. Cite the book and page in the JSDoc or
   PR description.
2. Place it under `src/rules/<topic>.ts` as a pure function (see contract
   above). No imports from Vue / Nuxt / Fastify / Drizzle / browser / Node.
3. Land it with unit tests in the same PR. (If Vitest is not yet wired up,
   that PR also adds Vitest to `devDependencies` and a `test` script.)
4. Re-export through `src/rules/index.ts`.
5. Changeset + commit.

## Adding a new default

1. Confirm the value is the published-baseline starting value (cite source)
   and is consumed across product surfaces (i.e. both frontend and backend
   would otherwise duplicate it).
2. Place it in `src/defaults/<domain>.ts` as a pure constant or pure
   factory. Same purity contract as rules.
3. Factories must return a fresh object per call — spread / clone any
   `Readonly` constants they reference so callers can mutate safely.
4. Re-export through `src/defaults/index.ts`.
5. Changeset + commit.

## Responsibility checklist

For any file you are about to add or move, run through these gates **in
order**. The first "no" tells you it does not belong in `core`.

1. **Shared domain concern?** Does this represent a stable domain contract
   or pure domain rule that may be consumed across product surfaces? If it
   only exists for one consumer's implementation detail, send it to that
   consumer. The test is not "is frontend/backend importing it today" but
   "is this a shared domain concern, or a consumer-local implementation
   detail".
2. **Free of framework/runtime imports?** Any `vue`, `nuxt`, `fastify`,
   `drizzle`, `pinia`, browser/Node API, `process.env`, `fetch`, storage, or
   network usage disqualifies it.
3. **Stable contract or pure derivation?** If it is a runtime validation
   schema, a request/response shape that one side owns, or UI form state, it
   does not belong here.
4. **Free of presentation concerns?** No display labels, i18n keys, select
   options, display order, form sections, page config, theming.
5. **For rules / defaults only — pure?** Same input → same output, no
   mutable state, no side effects, no `Date.now()` / `Math.random()`.
6. **For rules / defaults only — published-source baseline?** The value
   or computation must trace back to PHB / XGE / TCE / CR-official or
   another accepted published source. House-rule policies with no
   published source stay in consumers (frontend toggles, DM tools, or
   character-data fields).

If all six are "yes" → it belongs in `core`. Otherwise → it belongs to a
consumer.

## Anti-patterns

1. Adding a type or rule that only one consumer needs.
2. Importing a framework, runtime library, browser/Node API, or env access.
3. Adding a Zod / Valibot / Yup schema to `core`.
4. Adding `i18n` keys, display labels, or UI options to `core`.
5. Adding a side-effecting "rule" (reads time, RNG, storage, or network).
6. Skipping `pnpm changeset` on a public-surface change.
7. Manually editing `package.json#version` or `CHANGELOG.md`, **or running
   `pnpm changeset version` / `pnpm changeset publish` locally**. All version
   bumps and publishes go through the CI release flow.
8. Force-pushing to `main`.

## Release Workflow

Release is fully automated by `.github/workflows/release.yml` +
`changesets/action`. Local clones only **author** changesets; they never
**consume** them.

### What you do locally

1. Make the source change.
2. `pnpm changeset` — pick `patch` / `minor` / `major` and write the summary.
   This produces a new file under `.changeset/`.
3. Commit the source change **and** the changeset file together. Push to
   `main`.

### What CI does

1. On every push to `main`, the Release workflow runs.
2. If there are pending changesets, `changesets/action` opens (or updates) a
   PR titled `chore: version packages` on branch `changeset-release/main`.
   That PR consumes all pending changesets, bumps `package.json#version`,
   and writes `CHANGELOG.md`.
3. Reviewer merges the PR.
4. The next workflow run on `main` finds no pending changesets but a
   version ahead of the published one, so it publishes to GitHub Packages
   and tags `vX.Y.Z`.

### Do not

- **Never run `pnpm changeset version`** locally. It bumps version and
  consumes changesets — exactly what the bot's PR will do. If both happen,
  your local `main` diverges from the bot's `changeset-release/main`
  branch and you have to rebase / drop commits to recover.
- **Never run `pnpm changeset publish`** locally. Publishing is CI's job
  (it has the registry token and the audit trail).
- **Never hand-edit `package.json#version`** or `CHANGELOG.md`.

### Why this matters

The bot pattern produces a clean audit trail: every published version has
a corresponding `changeset-release/main` PR you can review, comment on, and
merge with intent. Local `pnpm changeset version` writes the same files
but with no PR, no review, and races the bot. The first symptom is
non-fast-forward push errors; the recovery cost grows with how many
unrelated changesets were in flight.

### If you genuinely need an emergency manual publish

Disable or branch the bot run, set `GITHUB_PACKAGES_TOKEN` in
your shell, run `pnpm build` then `pnpm exec changeset publish`. Open an
issue documenting why CI was bypassed. This path should be rare and
reviewed; treat it as breaking the workflow, not as a routine option.

## Versioning

- **Patch** — JSDoc edits, internal organization, sourcemap-only adjustments.
- **Minor** — new types, new optional fields, new rules, new union members
  consumers can ignore safely.
- **Major** — removed types/rules, renamed types, narrowed unions,
  restructured shapes, changed rule semantics. Coordinate with frontend and
  backend.

`package.json#version` is managed by changesets — do not edit it manually.

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
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/types-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/frontend-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/backend-skills.md>

## Mental model

`core` defines the shared **domain language**. Two layers:

| Layer    | Purpose                              | Lives in    |
| -------- | ------------------------------------ | ----------- |
| `types/` | What the shared domain data is       | `src/types` |
| `rules/` | How stable domain values are derived | `src/rules` |

In one sentence:

> `core` defines what the shared domain data is and how stable domain values
> are derived. `frontend` defines how the data is presented and interacted
> with. `backend` defines who can access or persist the data.

## Allowed in `core`

**`types/`**

- Domain entity types: `Character`, `CharacterProfile`, `CharacterCombatState`,
  `Spell`, `Item`, `Feature`, `CampaignRecord`, …
- Domain key unions: `AbilityKey`, `SkillKey`, `ProfessionKey`, `ArmorType`, …
- API DTOs **only when they are stable public contracts consumed directly by
  both frontend and backend**. Backend-owned validation schemas, DB rows,
  route-local request shapes, and implementation-specific response mappers
  stay in backend. If only one side needs the shape, it does not belong here.
- Stable domain contracts that change in lockstep across the product.

**`rules/`**

- Pure derivation functions for SRD-baseline values:
  `deriveAbilityModifier`, `deriveProficiencyBonus`,
  `deriveSavingThrowModifier`, `deriveSkillModifier`, `deriveArmorClass`,
  `deriveMaxHitPoints`, `derivePassivePerception`, `deriveInitiative`, …
- Internal lookup data (e.g. proficiency-bonus-by-level table) **only when a
  rule needs it as an implementation detail**, colocated with the rule.

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

## SRD baseline only

Rules in `core` ship **SRD-baseline DND 5e** semantics. House rules,
homebrew variants, and edition forks do **not** belong here unless they are
added as an explicit, opt-in extension layer agreed at the org level. When in
doubt: leave it in the consumer.

User-provided overrides may be accepted as rule inputs when they are part of
the shared domain type — fields like `customBonus`, `override`,
`manualAdjustment` on a `Character` or `CombatState` are legitimate inputs
to a `derive*` function and let DM rulings, player customizations, and
in-story rewards flow through. What core rules must **not** do is encode a
specific house-rule **policy** (e.g. "always grant +1 AC for shields", "use
average HP per level"). The rule defines the SRD computation; the data
carries the variance.

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
│  │  ├─ dnd/              # AbilityKey, SkillKey, ProfessionKey, …
│  │  ├─ combat.ts
│  │  ├─ spell.ts
│  │  ├─ plan-limits.ts
│  │  └─ index.ts
│  ├─ rules/
│  │  └─ index.ts          # barrel; derive* functions land here
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
pnpm changeset         # record release notes
pnpm release           # build + changeset publish (CI)
```

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

1. Confirm it is SRD-baseline and stable across product surfaces.
2. Place it under `src/rules/<topic>.ts` as a pure function (see contract
   above). No imports from Vue / Nuxt / Fastify / Drizzle / browser / Node.
3. Land it with unit tests in the same PR. (If Vitest is not yet wired up,
   that PR also adds Vitest to `devDependencies` and a `test` script.)
4. Re-export through `src/rules/index.ts`.
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
5. **For rules only — pure?** Same input → same output, no mutable state,
   no side effects, no `Date.now()` / `Math.random()`.
6. **For rules only — SRD baseline?** Homebrew / house-rule variants stay
   in consumers.

If all six are "yes" → it belongs in `core`. Otherwise → it belongs to a
consumer.

## Anti-patterns

1. Adding a type or rule that only one consumer needs.
2. Importing a framework, runtime library, browser/Node API, or env access.
3. Adding a Zod / Valibot / Yup schema to `core`.
4. Adding `i18n` keys, display labels, or UI options to `core`.
5. Adding a side-effecting "rule" (reads time, RNG, storage, or network).
6. Skipping `pnpm changeset` on a public-surface change.
7. Manually editing `package.json#version` or `CHANGELOG.md`.
8. Force-pushing to `main`.

## Versioning

- **Patch** — JSDoc edits, internal organization, sourcemap-only adjustments.
- **Minor** — new types, new optional fields, new rules, new union members
  consumers can ignore safely.
- **Major** — removed types/rules, renamed types, narrowed unions,
  restructured shapes, changed rule semantics. Coordinate with frontend and
  backend.

`package.json#version` is managed by changesets — do not edit it manually.

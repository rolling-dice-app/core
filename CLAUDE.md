# CLAUDE.md

This file gives Claude Code the highest-priority instructions for working inside the `rolling-dice-app/types` repository.

This is the **types** repo of a multi-repo product. It publishes `@rolling-dice-app/types` to GitHub Packages — the shared TypeScript contract consumed by `frontend` and (future) `backend`.

This repository intentionally does not use a large sub-skill system. This file is the primary working guideline for Claude inside the `types` repo. When this file conflicts with any local instruction, this file wins.

## Required Reading: Org-Level Guidelines

Before any non-trivial change, read the four org-level constitution documents. They define the cross-repo product architecture, what belongs here vs. in consumers, and the boundary protocol. The rest of this file is **types-internal repo convention only**.

- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/product-architecture.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/types-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/frontend-skills.md>
- <https://raw.githubusercontent.com/rolling-dice-app/guideline/main/backend-skills.md>

In short: this repo is the **single source of truth for shared shapes**. Frontend consumes; backend implements; types declares. Anything framework-specific does not belong here.

## Common Commands

```sh
pnpm install           # install deps
pnpm build             # tsc → dist/ (emits .d.ts + .js + sourcemaps)
pnpm clean             # rm -rf dist
pnpm type-check        # tsc --noEmit
pnpm changeset         # create a release note for the next publish
pnpm release           # build + changeset publish (CI runs this; manual use rare)
```

Single-command workflow for a typical change:

```sh
# 1. edit types under src/
# 2. verify
pnpm type-check
pnpm build
# 3. record the change for release
pnpm changeset
# 4. commit (changeset file + source change together)
git add . && git commit -m "feat: …"
git push origin main
# 5. CI opens "Version Packages" PR; merging publishes to GitHub Packages
```

## Architecture

### Repo Layout

```txt
types/
├─ src/
│  ├─ character/              # character data section types
│  │  ├─ ability.ts           # AbilityScoreInput, AbilityScoreEntry, CharacterAbilityScores
│  │  ├─ attack.ts            # ArmorClassConfig, DamageDieEntry, AttackEntry
│  │  ├─ feature.ts           # CharacterFeature, FeatureSource, FeatureUsage(Recovery)
│  │  ├─ inventory.ts         # InventoryItem, CharacterCurrency, CharacterInventory
│  │  ├─ profile.ts           # CharacterProfile, CharacterProfessions, CharacterStats
│  │  ├─ spell-entry.ts       # SpellEntry, SpellLevel, SpellSlots, SpellSlotsDelta
│  │  ├─ tier.ts              # CharacterTier
│  │  └─ index.ts             # Character, CharacterCapabilities + barrel
│  ├─ combat.ts               # CombatHp, DeathSaves, CombatState
│  ├─ dnd/                    # rule-aligned enums
│  │  ├─ ability-key.ts       # AbilityKey
│  │  ├─ alignment.ts         # MoralityKey, OrderKey, AlignmentKey
│  │  ├─ misc.ts              # SizeKey, GenderKey, ArmorType, WeaponType, DieType, DamageDieType, DamageTypeKey
│  │  ├─ profession.ts        # ProfessionKey, SubprofessionKey, ProfessionData, ProfessionEntry
│  │  ├─ skill.ts             # SkillKey, ProficiencyLevel, SkillProficiencies
│  │  └─ index.ts             # barrel
│  ├─ spell.ts                # SpellSchool, SpellDto, Spell
│  └─ index.ts                # root barrel
├─ .changeset/                # changesets config + pending changeset files
├─ .github/workflows/         # release.yml (changesets/action publish pipeline)
├─ dist/                      # build output (emitted, gitignored)
├─ package.json               # name: @rolling-dice-app/types
├─ tsconfig.json
└─ README.md
```

### TypeScript Configuration

- `verbatimModuleSyntax: true` — every cross-file type re-export uses `import type` / `export type`. Plain `import {}` for types is rejected.
- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `noFallthroughCasesInSwitch: true`.
- `declaration: true` + `declarationMap: true` + `sourceMap: true` — consumers get full IDE navigation back to source.
- Output: `outDir: dist`, `rootDir: src`. `dist/` ships in the published package; `src/` ships too (for `declarationMap` source navigation).

### Module System

- ESM only (`"type": "module"`). No CommonJS.
- Each file is its own module; cross-file imports use relative paths (`'./profile'`, `'../dnd/ability-key'`).
- Barrel files use `export *` (TS resolves the wildcard correctly under `verbatimModuleSyntax`).

## Adding a New Type

1. **Decide if it belongs here.** Apply the test from `types-skills.md`: would *both* frontend and backend need this exact thing? If no, it doesn't belong. If the type exists only because a page, form, database table, or API implementation currently needs it, it probably does not belong here.
2. **Pick the file.** Use the existing layout: character section types under `src/character/<section>.ts`; rule enums under `src/dnd/<topic>.ts`; cross-cutting persistent types at the `src/` root (like `combat.ts`, `spell.ts`).
3. **Declare with intent.** Use `interface` for object shapes; `type` for unions / aliases / mapped types. Add a JSDoc one-liner stating *what it is*, not *why it was added*.
4. **Re-export.** If the file is new, add it to its sibling `index.ts` barrel (and to `src/index.ts` if it's at the root). Use `export *`.
5. **Verify.** `pnpm type-check && pnpm build`.
6. **Record the release.** `pnpm changeset` — choose `patch` (docs / internal-only changes), `minor` (new types or new optional fields), or `major` (breaking changes). Write a one-line summary.
7. **Commit both** the source change *and* the changeset file together.

## Release Workflow

1. Push to `main` triggers `release.yml`.
2. `changesets/action` reads pending `.changeset/*.md` files, opens (or updates) a "Version Packages" PR that bumps `package.json` version, generates `CHANGELOG.md`, and removes the consumed changeset files.
3. Merging the Version Packages PR triggers another workflow run; this time `pnpm release` (= `pnpm build && changeset publish`) publishes to GitHub Packages.
4. `package.json` `publishConfig.registry` points to `https://npm.pkg.github.com`; access is `restricted` (org members only).
5. CI uses `secrets.GITHUB_TOKEN` for both PR creation and publish; org-level "Allow GitHub Actions to create and approve pull requests" must be enabled.

If publish fails, do not amend an old commit and force-push. Investigate, fix forward, push a new commit.

## Boundaries

- **Framework-agnostic.** Do not import or depend on Vue, Nuxt, Pinia, Tailwind, Fastify, Drizzle, Prisma, or any framework. Devtime tooling (`@changesets/cli`, `typescript`) lives in `devDependencies` and is the only allowed tree.
- **No runtime side effects.** Files declare types only. `sideEffects: false` is set in `package.json`; do not break this.
- **No environment-specific globals.** No `window`, `document`, `process`, Node-only built-ins.
- **No runtime business logic.** Type-level utilities are allowed when they support shared contracts. Runtime functions, mappers, calculators, validators with side effects, and rule engines are not allowed.
- **No runtime validation schemas yet.** Runtime schemas (e.g., Zod) may be added only after the org-level types guideline explicitly approves schemas as part of the shared contract package. Do not introduce a runtime schema dependency on your own.
- **No frontend-only or backend-only shapes.** UI form state lives in frontend; DB schema lives in backend; neither belongs here.

## Naming

- Domain entities: `Foo` (`Character`, `CombatState`, `InventoryItem`).
- DTOs (when added): `FooDto`, `FooRequest`, `FooResponse` — distinguish input from output explicitly.
- Enums: prefer string-literal unions (`type ProfessionKey = 'fighter' | …`).
- Sub-section interfaces composed into a parent: `CharacterProfile`, `CharacterStats`, etc.
- Constants (when added): `SCREAMING_SNAKE_CASE`.

## Versioning

- **Patch** — JSDoc edits, internal organization, sourcemap-only adjustments. No public-API change.
- **Minor** — new types, new optional fields, new union members consumers can ignore safely.
- **Major** — removed types or fields, renamed types, narrowed unions, restructured shapes. Coordinate with frontend and backend before merging.

`package.json.version` is managed by changesets — do not edit it manually.

## Anti-patterns

1. Adding a type that only one consumer needs.
2. Importing a framework or runtime library.
3. Adding a function, class, or value-producing export without an approved shared-schema or contract reason.
4. Skipping `pnpm changeset` on a PR that changes the public surface.
5. Manually editing `package.json` version or `CHANGELOG.md`.
6. Force-pushing to `main`.
7. Adding runtime object manipulation to a package that should remain declaration-focused.
8. Collapsing request and response into one optional-everything blob.

## Scope Control

Unless explicitly requested, do not:

- Add new top-level folders under `src/`.
- Add a runtime dependency (anything outside `devDependencies`).
- Modify the `release.yml` workflow.
- Break backward compatibility in a "patch" or "minor" changeset; if a change is breaking, mark it `major`.
- Author types describing UI form state, view models, or DB column shapes.

## Default Output Expectations

When asked to **add or change a type**, typically output:

1. Statement of which existing file the change lives in (or proposed new file with rationale).
2. The diff.
3. The accompanying changeset entry.
4. Verification step (`pnpm type-check`).

When asked to **review** a type change:

1. Boundary check (does this belong in `types`?).
2. Naming / layering check.
3. Versioning impact (patch / minor / major).
4. Suggested simplifications.

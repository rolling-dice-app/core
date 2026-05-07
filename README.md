# @rolling-dice-app/core

Shared domain core for the rolling-dice-app project. Single source of truth
for the **shared domain language** that both `frontend` (Nuxt SPA) and
`backend` (Fastify API) speak.

`core` contains:

- **`src/types/`** — TypeScript types for persistent domain entities and the
  small number of API DTOs that are truly shared by frontend and backend.
- **`src/rules/`** — pure, framework-agnostic derivation functions for stable
  DND values (ability modifiers, proficiency bonus, AC, max HP, passive
  perception, initiative, …). Currently empty; rules land here in follow-up
  PRs.

`core` does NOT contain runtime validation schemas, UI labels / i18n /
options, framework code, or anything that touches storage / network / env.
See `CLAUDE.md` for the full responsibility checklist.

## Install

需要含 `read:packages` 權限的 GitHub PAT。在 consumer repo 根目錄放 `.npmrc`：

```ini
@rolling-dice-app:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

```sh
pnpm add @rolling-dice-app/core
```

## Develop

```sh
pnpm install
pnpm build         # tsc → dist/
pnpm type-check    # tsc --noEmit
pnpm format        # prettier --write .
```

## Release

走 [changesets](https://github.com/changesets/changesets)，**版本號與 publish 全部由 CI 處理**，本地只負責記錄變更。

### Do

```sh
pnpm changeset           # 記錄變更（patch / minor / major + 摘要）
# 把 source 改動 + .changeset/<file>.md 一起 commit
git add . && git commit -m "feat(types): ..."
git push origin main
```

之後：

1. CI 偵測 pending changeset → 開 `chore: version packages` PR（branch `changeset-release/main`）
2. Review + merge 該 PR → CI 自動 publish 並打 `vX.Y.Z` tag

### Don't

- ❌ `pnpm changeset version` — 本地消化 changeset，會與 bot 的 release PR 撞車造成 non-fast-forward push
- ❌ `pnpm changeset publish` — publish 是 CI 的事
- ❌ 手改 `package.json#version` 或 `CHANGELOG.md`

詳細失敗模式與緊急手動 publish 流程見 `CLAUDE.md` 的 Release Workflow 段落。

## Layout

```
src/
├─ types/      # shared domain types (Character, Spell, AbilityKey, …)
├─ rules/      # pure derivation functions (deriveAbilityModifier, …)
└─ index.ts    # root barrel
```

## Boundary in one paragraph

> `core` defines **what** the shared domain data is and **how** stable domain
> values are derived. `frontend` defines **how** the data is presented and
> interacted with. `backend` defines **who** can access or persist the data,
> and what the runtime contract on the wire looks like.

## Migration from `@rolling-dice-app/types`

This package was renamed from `@rolling-dice-app/types` to
`@rolling-dice-app/core`. Consumers must:

1. `pnpm remove @rolling-dice-app/types && pnpm add @rolling-dice-app/core`.
2. Replace `from '@rolling-dice-app/types'` with `from '@rolling-dice-app/core'`
   — re-exports remain flat at the root, so no import-path changes are needed
   for existing types.

This is a hard break — there is no alias package.

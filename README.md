# @rolling-dice-app/types

Shared TypeScript types for the rolling-dice-app project. Consumed by:

- [`rolling-dice-app/frontend`](https://github.com/rolling-dice-app/frontend) — Nuxt 4 SPA
- `rolling-dice-app/backend` — Fastify API（建立中）

Published to GitHub Packages under the `@rolling-dice-app` scope.

## Install

需要含 `read:packages` 權限的 GitHub PAT。在 consumer repo 根目錄放 `.npmrc`：

```ini
@rolling-dice-app:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

本機 export `GITHUB_PACKAGES_TOKEN`，CI 用 `secrets.GITHUB_TOKEN`，然後：

```sh
pnpm add @rolling-dice-app/types
```

## Develop

```sh
pnpm install
pnpm build         # tsc → dist/
pnpm type-check    # tsc --noEmit
```

## Release

走 [changesets](https://github.com/changesets/changesets)：

```sh
pnpm changeset           # 記錄這次變更（patch / minor / major + 摘要）
git add .changeset && git commit -m "chore: changeset"
git push origin main     # CI 開「Version Packages」PR，merge 後自動 publish
```

第一次發版：選 `minor`（0.0.0 → 0.1.0），summary 寫 `initial release`。

## Layout

```
src/
├─ character/   # 角色資料模型（profile / ability / inventory / spell-entry / attack / feature / tier）
├─ combat.ts    # CombatHp / DeathSaves / CombatState
├─ spell.ts     # Spell / SpellDto / SpellSchool
├─ dnd/         # 規則 enum（profession / ability-key / skill / alignment / misc）
└─ index.ts     # barrel
```

## Scope

- 持久化型別 only — UI form state、dice roll history、adventure log 留在 frontend
- 不含 Zod runtime schema（後端 spike 啟動再加）
- 不含資料表（職業數值表等）— 那些屬於前端 static asset

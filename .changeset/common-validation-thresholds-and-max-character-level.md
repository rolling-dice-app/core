---
'@rolling-dice-app/core': minor
---

新增共用驗證閾值與 D&D 5e 角色等級上限，避免前後端各自硬編碼。

**`types/validation-limits.ts` 新增 sibling 常數**

- `COMMON_STRING_LENGTH_LIMIT = 100` — 一般字串欄位字數上限（name / race / 短欄位），純防 JSONB 塞爆。
- `LONG_STRING_LENGTH_LIMIT = 2000` — 長字串欄位字數上限（story / appearance / 列舉類），純防 JSONB 塞爆。
- `COMMON_INT_MAX_LIMIT = 999` — 一般 int 欄位防爆絕對值（applies as ±cap），純防 JSONB 塞爆。

不塞進 `ValidationLimits` interface — 這三個是「通用防爆閾值」，不會隨 plan tier 或實例化目標變動。

**`rules/character-level.ts`（新檔）**

- `MAX_CHARACTER_LEVEL = 20` — D&D 5e：單一角色跨多職業的總等級上限。

同時將 `rules/index.ts` 由 `export {}` 改為 `export * from './character-level.js'`。

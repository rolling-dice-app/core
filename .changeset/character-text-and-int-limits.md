---
'@rolling-dice-app/core': minor
---

`validation-limits.ts` 新增分層常數，舊扁平 const 標 `@deprecated`，下一個 major 移除。

**新增**

- `CHARACTER_TEXT_LIMITS = { TINY: 30, SHORT: 100, MEDIUM: 500, LONG: 2000 } as const` — 角色文字欄位字數上限分層（TINY: tag / SHORT: name·race / MEDIUM: item·feature / LONG: story·appearance）。
- `CHARACTER_INT_LIMITS = { MAX: 999 } as const` — 角色 int 欄位防爆絕對值（applies as ±cap）。

**Deprecated（仍可用，建議遷移）**

- `COMMON_STRING_LENGTH_LIMIT` → `CHARACTER_TEXT_LIMITS.SHORT`
- `LONG_STRING_LENGTH_LIMIT` → `CHARACTER_TEXT_LIMITS.LONG`
- `COMMON_INT_MAX_LIMIT` → `CHARACTER_INT_LIMITS.MAX`

分層命名讓 consumer 表達意圖更清楚（`SHORT`/`MEDIUM`/`LONG` vs 三個獨立 const 名），並補上原本缺的 `TINY` / `MEDIUM` 段位。

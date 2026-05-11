---
'@rolling-dice-app/core': minor
---

新增 CombatState 相關共享型別、defaults 與 overflow guard 常數，並把死亡豁免門檻搬進 `rules/`：

- `CombatStateBody`（`types/combat.ts`）：`Omit<CombatStateDTO, 'characterId' | 'updatedAt'>`，給 frontend mock / backend POST·PATCH handler 共用。
- `buildCombatStateBodyDefaults()`（`defaults/combat.ts`）：純工廠，回傳 SRD-baseline 初始 body；每次呼叫回傳獨立物件。
- `COMBAT_STATE_LIMITS`（`types/combat-limits.ts`）：純防 JSONB 塞爆的欄位絕對值上限，量級沿用 `CHARACTER_INT_LIMITS`；不含 `deathSaves`、不含可推導的 `hp.current`。
- `DEATH_SAVE_THRESHOLD`（`rules/death-saves.ts`）：SRD 死亡豁免成功 / 失敗計數的判定門檻常數。

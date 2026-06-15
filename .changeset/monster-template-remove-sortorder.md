---
'@rolling-dice-app/core': minor
---

怪物模板（m7.1）契約收尾：移除 sortOrder、補 error codes

- `types/monster.ts`：`MonsterTemplateDTO` 與 `MonsterTemplateSummaryDTO` 移除 `sortOrder`。怪物模板為頂層 owner-scoped 資源，比照 characters / inventory 以時間排序，產品無「使用者手動排序」模型，故不保留 sort 欄位。修正剛 publish 的 11.1.0 monster 契約（尚無消費者）。
- `types/api-error.ts`：`API_ERROR_CODES` 新增 `MONSTER_TEMPLATE_NOT_FOUND`、`STALE_MONSTER_TEMPLATE_VERSION`、`MONSTER_TEMPLATE_LIMIT_REACHED`；後者納入 `PlanLimitErrorCode` union，供 backend `PlanLimitExceededError` 使用。
- `defaults/monster.ts`：`buildMonsterTemplateCreateDefaults` 的 `Omit` 同步移除 `sortOrder`。

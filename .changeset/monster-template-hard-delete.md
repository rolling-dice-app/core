---
'@rolling-dice-app/core': minor
---

怪物模板改 hard-delete：移除 MonsterTemplateDTO 的 deletedAt

怪物模板為靜態素材、無 restore，後端 DELETE 改為實刪（hard-delete），不再保留軟刪除欄位。`MonsterTemplateDTO` 移除 `deletedAt`，`buildMonsterTemplateCreateDefaults` 的 `Omit` 同步移除。修正尚無消費者的 11.2.0 monster 契約。

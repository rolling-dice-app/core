---
'@rolling-dice-app/core': minor
---

新增 `CombatStateUpdateDTO`（`types/combat.ts`）：CombatState PATCH 時 client 提交的 patch payload。

- 帶 `updatedAt`（required）作樂觀鎖；其餘欄位 optional。
- Nested object/array 必須整個帶完整值，與 character section partial 一致（JSONB `||` 是 shallow merge）。

---
'@rolling-dice-app/core': minor
---

戰場還原契約與戰鬥段落語意補登

- 新增 `BattlefieldRestoreBody`：`POST /battlefields/:id/restore` 的 body（樂觀鎖 token），把戰場還原至本場次起始快照
- `battleSequence` JSDoc 補上「不可回退、遞增即觸發 backend 拍照」
- `inProgress` 標記 `@deprecated`（結束戰鬥即進入下一場，中間態不存在）
- `sortOrder` JSDoc 改寫：先攻值變動不再觸發自動重排，順序只由拖曳與「依先攻重排」更新
- 怪物 `savingThrows` / `skills` 補上 fallback 規則：未列出者用屬性調整值，明確的 `0` 與未列出語意不同

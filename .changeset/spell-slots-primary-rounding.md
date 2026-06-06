---
'@rolling-dice-app/core': major
---

多職法術環位取整改為依主／兼職位置決定，並移除既有 deprecated 型別

- `getSuggestedRegularSpellSlots`：多職 effective-level 改為逐 class 依位置取整再加總——主職業（`classes[0]`，與 `rules/hp.ts` 一致）施法等級向上取整（ceil），其餘兼職向下取整（floor）；artificer 作為兼職時亦改為 floor，不再永遠 round-up。full caster 除數為 1 不受影響。已取代原先 paladin+ranger「sum-then-halve」的 permissive 解讀（見 CLAUDE.md catalogue）。
- 連帶修正：單職 eldritchKnight / arcaneTrickster 因走多職公式且為主職，改用 `ceil(level/3)`，現與 PHB 單職三階施法者表一致（例：EK lv7 由 `{1:3}` 修正為 `{1:4,2:2}`）。
- 單職 paladin / ranger / artificer 各等級輸出不變（含第 1 級無環位）。
- 移除「待下次 major」的 deprecated 型別：`TeammatePreviewDTO`、`ValidateTeammatesBody`、`ValidateTeammatesResponse`（整個 `teammate.ts`）與 `UserAvatarUpdateDTO`。

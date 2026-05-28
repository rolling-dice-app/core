---
'@rolling-dice-app/core': minor
---

feat(rules): 新增 computeHpMax 與 getClassHitPoints

把 frontend 原本 local 的 HP 公式（`calculateTotalHp` / `getClassHitPoints`）抽到 core。
兩端 consumer 對「角色 base HP 上限」必須有單一一致的真值，frontend 用於 UI 顯示，
backend 用於 PATCH /combat-state 的 `hp.current ≥ -hpMax` invariant 驗證。

- `getClassHitPoints(hitDie, level, isPrimary)`：單一職業條目貢獻的 base HP；
  主職業第 1 級取滿，其餘用平均（PHB p.15）
- `computeHpMax(character: HpMaxInput)`：完整 base HP 上限；含 CON 修正 / Tough /
  customHpBonus。輸入採 `Pick<SharedCharacterProfileDTO, 'classes'|'abilities'|
  'isTough'|'customHpBonus'>`，DTO / form-state 結構相容皆可傳入。
- 不含 combat-state 的 `hp.maxAdjustment` 臨時調整 —— 屬戰鬥當下值，由 caller 自行套上

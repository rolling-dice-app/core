---
'@rolling-dice-app/core': major
---

怪物模板 speed 改為數字並移除已棄用欄位（breaking）：

- `MonsterTemplateDTO.speed`：`string`（自由文字）→ `number`（呎；單一絕對數值，預設 30，新增 `MONSTER_DEFAULT_SPEED`）；多模式速度（飛行、攀爬等）改寫 remark
- 移除 `CharacterSummaryDTO.level`（前端由 classes 自行加總）
- 移除怪物模板四個已棄用自由文字欄位：`damageVulnerabilities` / `damageResistances` / `damageImmunities` / `conditionImmunities`（由 `damageModifiers` / `conditionImmunityKeys` 取代）

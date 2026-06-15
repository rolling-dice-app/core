---
'@rolling-dice-app/core': minor
---

新增怪物模板（m7.1）契約型別、limits 與 defaults

- `types/monster.ts`：新增 `MonsterTemplateDTO`、`MonsterTemplateSummaryDTO`、`MonsterTemplateCreateBody`、`MonsterTemplateUpdateBody`，與子結構 `MonsterAttackEntry`、`MonsterFeature`。數值全走 flat 絕對值（怪物無等級成長），重用 `AbilityKey` / `SkillKey` / `SizeKey` / `AlignmentKey` enum 與 `DamageDieEntry` 結構；不重用角色的 `AttackEntry` / `CharacterFeature` / `ArmorClassConfig` / `AbilityScoreEntry`。無 restore，故 DTO 不含 `restoredAt`。
- `PlanLimits`：新增 `maxMonsterTemplates`（值由 backend 拍板，計未刪除列）。
- `VALIDATION_LIMITS`：新增 `maxAttacksPerMonsterTemplate`（10）、`maxFeaturesPerMonsterTemplate`（10）、`maxDamageDicePerAttack`（10，角色與怪物攻擊共用）。
- `defaults/monster.ts`：新增 `buildMonsterTemplateCreateDefaults`（abilities 預設 10、ac 10 / hp 1、free-text 與陣列空）。

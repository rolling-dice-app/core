---
'@rolling-dice-app/core': minor
---

m7.3 戰場契約：新增 Battlefield 型別家族（BattlefieldDTO / BattlefieldUnit / BattlefieldUnitHp / BattlefieldAttackEntry / BattlefieldCondition / BattlefieldSessionOption / BattlefieldCreateBody / BattlefieldUpdateBody 與 BattlefieldUnitKind / BattlefieldFaction union）、BATTLEFIELD_LIMITS 數值範圍常數、VALIDATION_LIMITS 三鍵（maxUnitsPerBattlefield: 50 / maxConditionsPerBattlefieldUnit: 15 / maxAttacksPerBattlefieldUnit: 20）、三個 error codes（BATTLEFIELD_NOT_FOUND / STALE_BATTLEFIELD_VERSION / BATTLEFIELD_ALREADY_EXISTS）與 buildBattlefieldCreateDefaults()。單位 HP/AC 比照 combat-state 調整值模型（快照基準＋adjustment，前端計算有效值）；攻擊快照供前端擲骰取數（傷害復用 DamageDieEntry）；技能加值快照（BattlefieldUnit.skills，flat 總值 Partial&lt;Record&lt;SkillKey, number&gt;&gt;，±cap UNIT_SKILL_BONUS_ABS_MAX）；速度為數值快照（number | null，建立時定格）＋ speedAdjustment 調整值（比照 HP/AC 模型）；死亡豁免復用 DeathSaves

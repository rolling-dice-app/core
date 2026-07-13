---
'@rolling-dice-app/core': minor
---

新增 CONDITION_KEYS / ConditionKey 與 DAMAGE_MODIFIER_KEYS / DamageModifierKey enum；MonsterTemplateDTO 新增結構化欄位 damageModifiers（每傷害類型單一互斥狀態）、conditionImmunityKeys、remark（含 defaults 與 update body）；原四個 free-text 抗性欄位標記 @deprecated，下個 major 移除

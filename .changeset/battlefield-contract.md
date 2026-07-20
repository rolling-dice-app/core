---
'@rolling-dice-app/core': minor
---

m7.3 戰場契約：新增 Battlefield 型別家族（BattlefieldDTO / BattlefieldUnit / BattlefieldCondition / BattlefieldSessionOption / BattlefieldCreateBody / BattlefieldUpdateBody 與 BattlefieldUnitKind / BattlefieldFaction union）、BATTLEFIELD_LIMITS 數值範圍常數、VALIDATION_LIMITS 兩鍵（maxUnitsPerBattlefield: 50 / maxConditionsPerBattlefieldUnit: 15）、三個 error codes（BATTLEFIELD_NOT_FOUND / STALE_BATTLEFIELD_VERSION / BATTLEFIELD_ALREADY_EXISTS）與 buildBattlefieldCreateDefaults()

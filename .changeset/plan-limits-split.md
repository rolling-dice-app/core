---
'@rolling-dice-app/core': major
---

refactor(types): 拆分 `PlanLimits` 為純方案上限 shape，並新增 `ValidationLimits` 與 `MeResponseDTO`。

- 新增 `ValidationLimits` 介面與 `VALIDATION_LIMITS` 常數，承接通用輸入驗證上限（物品 / 攻擊 / 特性 / 自訂法術數，以及描述字數），值對齊原 `FREE_PLAN_LIMITS` 同名欄位。
- `PlanLimits` 改為純 shape；values 由 backend 拍板，透過 `/auth/me` 回應送給前端。欄位重組：保留 `maxCharacters`、`maxCampaignRecordsPerCharacter`；新增 `maxActiveCharacters`、`softDeleteRetentionDays`、`deleteCooldownAfterRestoreDays`；移除 7 個驗證類欄位。
- **語意變更**：`PlanLimits.maxCharacters` 由「active 角色卡上限」改為「總 row 上限（active + soft-deleted）」；UI「尚可新建的卡數」應改用 `maxActiveCharacters`。
- 移除 `FREE_PLAN_LIMITS` const — 前端不再 import 任何 `*_PLAN_LIMITS`。
- 新增 `MeResponseDTO` (`{ user: UserDTO, limits: PlanLimits }`)，作為 `GET /auth/me` 的標準回應 shape。

Frontend / backend 須同步調整：字數限制改讀 `VALIDATION_LIMITS.*`；方案限制改讀 `meResponse.limits.*`；`/auth/me` 回應從扁平 `UserDTO` 改為 `MeResponseDTO`。

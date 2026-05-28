---
'@rolling-dice-app/core': minor
---

types(api-error): 新增 `PlanLimitErrorCode` narrow union

對應 backend Group 4 U2-N9 — 讓 `PlanLimitExceededError(code)` 不再吃任意字串、限制只能傳 plan-quota 相關 code（`ACTIVE_CHARACTER_LIMIT_REACHED` / `CHARACTER_TOTAL_LIMIT_REACHED` / `CAMPAIGN_RECORD_LIMIT_REACHED`）。

以 `Extract<ApiErrorCode, ...>` 顯式列出三個成員，若 `API_ERROR_CODES` 中任一被移除、`PlanLimitErrorCode` 會自動縮窄，backend 拋出端會直接 TS error。

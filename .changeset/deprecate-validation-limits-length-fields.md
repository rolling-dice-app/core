---
'@rolling-dice-app/core': patch
---

標記 `VALIDATION_LIMITS` 三個 length 欄位為 `@deprecated`，下一個 major 一併移除。改用 `CHARACTER_TEXT_LIMITS` 分層常數：

- `maxCampaignRecordContentLength`（原 1000）
- `maxItemDescriptionLength`（原 500）
- `maxFeatureDescriptionLength`（原 800）

新欄位字數上限請依語意挑 `CHARACTER_TEXT_LIMITS.MEDIUM` (500) 或 `CHARACTER_TEXT_LIMITS.LONG` (2000)。

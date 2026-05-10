---
'@rolling-dice-app/core': major
---

refactor(types)!: `PlanLimits` 移除 `softDeleteRetentionDays` 與 `deleteCooldownAfterRestoreDays`。

兩者為系統級保留政策，不隨 plan tier 變動，語意上不屬 plan-tier limits。Backend 已將兩者集中於 `src/lib/retention.ts`；frontend 若需顯示倒數，未來由 API 另外暴露而非塞進 `PlanLimits`。

備註：這兩欄位在 5.0.0 短暫存在過，未經實際消費就移除。Frontend / backend 不需特別動作（沒人應該已開始讀這兩欄位）。

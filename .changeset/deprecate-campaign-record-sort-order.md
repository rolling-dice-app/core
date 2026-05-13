---
'@rolling-dice-app/core': minor
---

`CampaignRecordDTO.sortOrder` 標註 `@deprecated`，下個 major 版本移除；MVP 排序持續以 `createdAt` 為準，consumer 請改用 `createdAt`。

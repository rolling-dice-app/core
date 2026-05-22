---
'@rolling-dice-app/core': minor
---

feat(types): 戰役紀錄 teammates 由純人名升級為 cross-user 角色卡連結。`CampaignRecordDTO.teammates` 讀取形改為 `TeammatePreviewDTO[]`（含 available 旗標與 shareLink，失效者欄位為 null）；`CampaignRecordCreateBody`/`CampaignRecordUpdateBody` 的 teammates 寫入形為 shareId 陣列。新增 `TeammatePreviewDTO`、`ValidateTeammatesBody`、`ValidateTeammatesResponse` 供 POST /share/characters/validate-teammates 使用。

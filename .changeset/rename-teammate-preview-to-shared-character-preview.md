---
'@rolling-dice-app/core': minor
---

新增 `SharedCharacterPreviewDTO` 與 `ResolveSharedCharactersBody` / `ResolveSharedCharactersResponse`，作為 `POST /share/characters/resolve` 的中性型別。原 `TeammatePreviewDTO` / `ValidateTeammatesBody` / `ValidateTeammatesResponse` 改為 `@deprecated` 別名（`TeammatePreviewDTO` 轉為 `SharedCharacterPreviewDTO` 的 type alias），下次 major 一併移除。

caller 用例命名（如 `CampaignRecordDTO.teammates` 欄位、`maxTeammatesPerCampaignRecord` 上限）保留不動。

---
"@rolling-dice-app/core": minor
---

Add `CampaignRecordDTO` / `CampaignRecordCreateBody` / `CampaignRecordUpdateBody` and the shared `CurrencyAmount` sub-shape under `character/`. `CharacterCurrencyDTO` and `CharacterCurrencyUpdateBody` are refactored to compose `CurrencyAmount`; wire shape is unchanged. `VALIDATION_LIMITS` gains `maxCampaignRecordsPerCharacter` (200), `maxCampaignRecordContentLength` (2000), and `maxTeammatesPerCampaignRecord` (20).

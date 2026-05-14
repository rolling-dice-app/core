---
'@rolling-dice-app/core': major
---

Move `applyMoneyToCurrency` from per-request campaign record body to user preference, and drop two deprecated contracts.

**Breaking changes**

- `CampaignRecordCreateBody.applyMoneyToCurrency` removed. The decision to credit `moneyEarning` to character currency is now controlled by `UserPreference.applyMoneyToCurrency` on the authed user, read server-side at insert time.
- `CampaignRecordDTO.sortOrder` removed. Records have always been ordered by `createdAt` at the MVP level; consumers must use `createdAt` directly.
- `OAUTH_ERROR_CODES`, `OAuthErrorCode`, and `isOAuthErrorCode` removed from `@rolling-dice-app/core`. OAuth redirect error handling now lives in the backend; the frontend treats the `?error=` query as an opaque log value behind a generic message.

**Additions**

- `UserPreference.applyMoneyToCurrency?: boolean` — optional so existing persisted preference rows without the key remain valid; consumers should treat a missing value as `true`.

---
'@rolling-dice-app/core': minor
---

新增 `ApiErrorCode` 契約：`API_ERROR_CODES` const tuple、`ApiErrorCode` union 型別、`isApiErrorCode` runtime guard。涵蓋 backend 目前所有會出現在 HTTP error response body 的 code（含 race / cooldown / plan-limit / validation / 5xx fallback / OAuth 內部）。consumer 後續會把 backend `AppError.code` 與 frontend `ERROR_MESSAGE_MAP` key 改吃此型別。

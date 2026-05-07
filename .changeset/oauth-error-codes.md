---
'@rolling-dice-app/core': minor
---

新增 OAuth redirect error code wire contract：

- `OAUTH_ERROR_CODES`：7 個 code 的 `as const` tuple（6 個 OAuth flow code + `OAUTH_UNEXPECTED_ERROR` fallback）
- `OAuthErrorCode`：對應的 union type
- `isOAuthErrorCode`：narrow guard

範圍限定為「OAuth redirect URL `?error=` 通道」。HTTP API response body 的
error code（VALIDATION_ERROR / UNAUTHORIZED_ERROR / RATE_LIMITED 等）屬於
另一條 contract，待後續 milestone 視需要再收。

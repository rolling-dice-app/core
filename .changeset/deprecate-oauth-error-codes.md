---
"@rolling-dice-app/core": patch
---

Deprecate the OAuth redirect channel error-code contract: `OAUTH_ERROR_CODES`, `OAuthErrorCode`, and `isOAuthErrorCode` are now marked `@deprecated` and will be removed in the next major. Frontend error handling is moving to a unified policy where OAuth redirect errors are logged with the raw `?error=` value and the UI shows a single generic "please try again later" message instead of branching per code. No runtime or type-shape changes in this release.

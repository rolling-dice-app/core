/**
 * OAuth 登入流程結束後，後端會以 `?error=<code>` 將以下其中一個 code
 * 帶回前端 `/login` 頁。前端依 code 顯示對應人話訊息。
 *
 * 範圍限定為「OAuth redirect 通道」；HTTP API response body 的 error code
 * （VALIDATION_ERROR / UNAUTHORIZED_ERROR / RATE_LIMITED 等）屬於另一條
 * contract，不在此 union。
 */
export const OAUTH_ERROR_CODES = [
  'OAUTH_USER_DENIED',
  'OAUTH_STATE_MISMATCH',
  'OAUTH_CODE_EXCHANGE_FAILED',
  'OAUTH_USERINFO_FAILED',
  'OAUTH_EMAIL_UNVERIFIED',
  'OAUTH_EMAIL_ALREADY_LINKED',
  'OAUTH_UNEXPECTED_ERROR',
] as const

export type OAuthErrorCode = (typeof OAUTH_ERROR_CODES)[number]

/** 收窄外部字串為已知 OAuth error code */
export const isOAuthErrorCode = (code: string): code is OAuthErrorCode =>
  (OAUTH_ERROR_CODES as readonly string[]).includes(code)

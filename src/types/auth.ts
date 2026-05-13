/**
 * OAuth redirect 通道的 error code union（後端以 `?error=<code>` 帶回前端）。
 * HTTP body error code（VALIDATION_ERROR 等）屬另一條 contract，不在此 union。
 *
 * @deprecated 將於下個 major 移除
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

/** @deprecated 將於下個 major 移除 */
export type OAuthErrorCode = (typeof OAUTH_ERROR_CODES)[number]

/** @deprecated 將於下個 major 移除 */
export const isOAuthErrorCode = (code: string): code is OAuthErrorCode =>
  (OAUTH_ERROR_CODES as readonly string[]).includes(code)

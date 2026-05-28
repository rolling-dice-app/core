/**
 * Backend error codes that may appear in the HTTP error response body
 * (`{ error: code, message, details? }`).
 *
 * Covers both wire-level codes the frontend may branch on (race / cooldown /
 * plan-limit / validation) and backend-internal invariant violations (5xx).
 * Frontend does not branch on the internal ones — they fall through to the
 * generic toast — but they're listed here so any new code thrown from
 * backend forces a core changeset, keeping the contract honest.
 *
 * The OAuth callback-flow user-facing codes (rendered as `?error=` query
 * param after redirect) live on a separate union; the OAUTH_* entries below
 * are the *internal* failures during the OAuth handler, caught at the route
 * boundary and translated before redirect.
 */
export const API_ERROR_CODES = [
  // Generic 4xx
  'VALIDATION_ERROR',
  'EMPTY_PATCH',
  'UNAUTHORIZED_ERROR',
  'FORBIDDEN_ERROR',
  'NOT_FOUND_ERROR',
  'CONFLICT_ERROR',
  'PAYLOAD_TOO_LARGE',
  'RATE_LIMITED',
  'CLIENT_ERROR',
  // 5xx fallback
  'INTERNAL_ERROR',
  // Specific 404
  'USER_NOT_FOUND',
  'CHARACTER_NOT_FOUND',
  'CAMPAIGN_RECORD_NOT_FOUND',
  'SPELL_NOT_FOUND',
  // Optimistic-lock failures (race)
  'STALE_CHARACTER_VERSION',
  'STALE_COMBAT_STATE_VERSION',
  'STALE_CAMPAIGN_RECORD_VERSION',
  'STALE_USER_VERSION',
  'STALE_CURRENCY_VERSION',
  // Race (optimistic lock) — sub-resources
  'STALE_SPELL_ENTRY_VERSION',
  'STALE_INVENTORY_ITEM_VERSION',
  // Cooldown / plan limit
  'RESTORE_COOLDOWN_ACTIVE',
  'ACTIVE_CHARACTER_LIMIT_REACHED',
  'CHARACTER_TOTAL_LIMIT_REACHED',
  'CAMPAIGN_RECORD_LIMIT_REACHED',
  'CAMPAIGN_RECORD_VALIDATION_LIMIT_REACHED',
  // Sub-resource quotas / business rules
  'ITEM_LIMIT_EXCEEDED',
  'LEARNED_SPELLS_LIMIT_EXCEEDED',
  'ATTUNED_LIMIT_EXCEEDED',
  'SPELL_ALREADY_LEARNED',
  'CURRENCY_OVERFLOW',
  // Avatar 400
  'AVATAR_FILE_MISSING',
  'AVATAR_TOO_LARGE',
  'AVATAR_URL_NOT_OWNED',
  'AVATAR_INVALID_MIME',
  'AVATAR_MAGIC_BYTE_MISMATCH',
  // 422 (UnprocessableEntityError carry-over)
  'TEAMMATE_SHARE_ID_INVALID',
  'SPELL_SLOTS_USED_EXCEEDS_MAX',
  // Backend-internal invariants (5xx)
  'COMBAT_STATE_MISSING',
  'CHARACTER_CURRENCY_MISSING',
  'INSERT_RETURNING_EMPTY',
  'OWNERSHIP_NOT_RUN',
  // Infra 502
  'AVATAR_UPLOAD_FAILED',
  'AVATAR_DELETE_FAILED',
  // OAuth internal (caught and translated at route boundary)
  'OAUTH_STATE_MISMATCH',
  'OAUTH_CODE_EXCHANGE_FAILED',
  'OAUTH_USERINFO_FAILED',
  'OAUTH_EMAIL_UNVERIFIED',
  'OAUTH_EMAIL_ALREADY_LINKED',
  'OAUTH_USER_UPSERT_FAILED',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

export const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === 'string' && (API_ERROR_CODES as readonly string[]).includes(value)

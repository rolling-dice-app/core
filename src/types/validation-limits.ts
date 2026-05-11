/** 通用輸入驗證上限；前後端共用值（zod schema 與 UI form 都用此值） */
export interface ValidationLimits {
  /** 單一角色可持有的物品數 */
  maxItemsPerCharacter: number
  /** 單一角色可建立的攻擊條目數 */
  maxAttacksPerCharacter: number
  /** 單一角色可建立的特性條目數 */
  maxFeaturesPerCharacter: number
  /** 單一角色可建立的自訂法術數 */
  maxCustomSpellsPerCharacter: number

  /** 單筆冒險紀錄內容字數上限 */
  maxCampaignRecordContentLength: number
  /** 單筆物品描述字數上限 */
  maxItemDescriptionLength: number
  /** 單筆特性描述字數上限 */
  maxFeatureDescriptionLength: number
}

export const VALIDATION_LIMITS: ValidationLimits = {
  maxItemsPerCharacter: 50,
  maxAttacksPerCharacter: 20,
  maxFeaturesPerCharacter: 40,
  maxCustomSpellsPerCharacter: 20,

  maxCampaignRecordContentLength: 1000,
  maxItemDescriptionLength: 500,
  maxFeatureDescriptionLength: 800,
}

/** 角色文字欄位字數上限分層（TINY: tag / SHORT: name·race / MEDIUM: item·feature / LONG: story·appearance）；純防 JSONB 塞爆 */
export const CHARACTER_TEXT_LIMITS = {
  TINY: 30,
  SHORT: 100,
  MEDIUM: 500,
  LONG: 2000,
} as const

/** 角色 int 欄位防爆絕對值（applies as ±cap）；純防 JSONB 塞爆 */
export const CHARACTER_INT_LIMITS = {
  /** 小數值欄位絕對值上限 */
  SMALL_INT_MAX: 99,
  /** 一般數值欄位絕對值上限 */
  GENERAL_INT_MAX: 999,
  /** 大數值欄位絕對值上限 */
  LARGE_INT_MAX: 999_999,
} as const

/** @deprecated 改用 `CHARACTER_TEXT_LIMITS.SHORT`；下一個 major 移除。 */
export const COMMON_STRING_LENGTH_LIMIT = 100
/** @deprecated 改用 `CHARACTER_TEXT_LIMITS.LONG`；下一個 major 移除。 */
export const LONG_STRING_LENGTH_LIMIT = 2000
/** @deprecated 改用 `CHARACTER_INT_LIMITS.GENERAL_INT_MAX`；下一個 major 移除。 */
export const COMMON_INT_MAX_LIMIT = 999

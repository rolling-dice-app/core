/** 通用輸入驗證上限；前後端共用值（zod schema 與 UI form 都用此值） */
export interface ValidationLimits {
  /** 單一角色可持有的物品數 */
  maxItemsPerCharacter: number
  /** 單一角色可建立的攻擊條目數 */
  maxAttacksPerCharacter: number
  /** 單一角色可建立的特性條目數 */
  maxFeaturesPerCharacter: number
  /** 單一角色可學習的法術數 */
  maxLearnedSpellsPerCharacter: number
  /** 單一角色可建立的自訂法術數 */
  maxCustomSpellsPerCharacter: number
  /** 單一角色可建立的戰役紀錄數 */
  maxCampaignRecordsPerCharacter: number
  /** 戰役紀錄 content 字數上限 */
  maxCampaignRecordContentLength: number
  /** 單筆戰役紀錄 teammates 陣列長度上限 */
  maxTeammatesPerCampaignRecord: number
}

export const VALIDATION_LIMITS: ValidationLimits = {
  maxItemsPerCharacter: 100,
  maxAttacksPerCharacter: 20,
  maxFeaturesPerCharacter: 40,
  maxLearnedSpellsPerCharacter: 200,
  maxCustomSpellsPerCharacter: 20,
  maxCampaignRecordsPerCharacter: 20,
  maxCampaignRecordContentLength: 2000,
  maxTeammatesPerCampaignRecord: 20,
}

/** 角色文字欄位字數上限分層（TINY: tag / SHORT: name·race / MEDIUM: item·feature / LONG: story·appearance）；純防 JSONB 塞爆 */
export const CHARACTER_TEXT_LIMITS = {
  TINY: 30,
  SHORT: 100,
  MEDIUM: 500,
  LONG: 2000,
} as const

/** 小數欄位允許的小數位數上限 */
export const MAX_DECIMAL_PRECISION = 1

/** 角色 int 欄位防爆絕對值（applies as ±cap）；純防 JSONB 塞爆 */
export const CHARACTER_INT_LIMITS = {
  /** 小數值欄位絕對值上限 */
  SMALL_INT_MAX: 99,
  /** 一般數值欄位絕對值上限 */
  GENERAL_INT_MAX: 999,
  /** 大數值欄位絕對值上限 */
  LARGE_INT_MAX: 999_999,
} as const

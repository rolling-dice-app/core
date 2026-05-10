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

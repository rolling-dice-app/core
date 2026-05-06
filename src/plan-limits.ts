/** 單一使用者帳號在當前方案下可使用的資源上限 */
export interface PlanLimits {
  /** 帳號可建立的角色總數 */
  maxCharacters: number
  /** 單一角色可持有的物品數 */
  maxItemsPerCharacter: number
  /** 單一角色可保存的冒險紀錄筆數 */
  maxCampaignRecordsPerCharacter: number
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

/** 免費方案使用量天花板；前後端共同遵守 */
export const FREE_PLAN_LIMITS: PlanLimits = {
  maxCharacters: 1,
  maxItemsPerCharacter: 50,
  maxCampaignRecordsPerCharacter: 20,
  maxAttacksPerCharacter: 20,
  maxFeaturesPerCharacter: 40,
  maxCustomSpellsPerCharacter: 20,

  maxCampaignRecordContentLength: 1000,
  maxItemDescriptionLength: 500,
  maxFeatureDescriptionLength: 800,
}

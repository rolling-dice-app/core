// cspell:words COOLDOWN
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
  /** 單筆戰役紀錄 teammates 陣列長度上限 */
  maxTeammatesPerCampaignRecord: number
  /** 使用者暱稱字數上限 */
  maxNicknameLength: number
  /** 單一怪物模板可建立的攻擊條目數 */
  maxAttacksPerMonsterTemplate: number
  /** 單一怪物模板可建立的特性條目數 */
  maxFeaturesPerMonsterTemplate: number
  /** 單一攻擊內傷害條目（damageDice）行數上限；角色／怪物／戰場單位攻擊共用 */
  maxDamageDicePerAttack: number
  /** 單一團務容器 members（常駐名單）陣列長度上限 */
  maxMembersPerDmSessionContainer: number
  /** 單筆團務紀錄 members（出席名單）陣列長度上限 */
  maxMembersPerDmSessionLog: number
  /** 單筆團務紀錄 itemRewards 陣列長度上限 */
  maxItemRewardsPerDmSessionLog: number
  /** 單一戰場 units 陣列長度上限 */
  maxUnitsPerBattlefield: number
  /** 單一戰場單位 conditions 陣列長度上限（= ConditionKey 全集數，一 key 一條的天然上限） */
  maxConditionsPerBattlefieldUnit: number
  /** 單一戰場單位 attacks 陣列長度上限（= 角色攻擊 cap，快照不截斷） */
  maxAttacksPerBattlefieldUnit: number
}

export const VALIDATION_LIMITS: ValidationLimits = {
  maxItemsPerCharacter: 100,
  maxAttacksPerCharacter: 20,
  maxFeaturesPerCharacter: 40,
  maxLearnedSpellsPerCharacter: 200,
  maxCustomSpellsPerCharacter: 20,
  maxTeammatesPerCampaignRecord: 20,
  maxNicknameLength: 10,
  maxAttacksPerMonsterTemplate: 10,
  maxFeaturesPerMonsterTemplate: 10,
  maxDamageDicePerAttack: 10,
  maxMembersPerDmSessionContainer: 10,
  maxMembersPerDmSessionLog: 10,
  maxItemRewardsPerDmSessionLog: 100,
  maxUnitsPerBattlefield: 50,
  maxConditionsPerBattlefieldUnit: 15,
  maxAttacksPerBattlefieldUnit: 20,
}

/** 角色文字欄位字數上限分層（TINY: tag / SHORT: name·race / MEDIUM: feature / ITEM: item / LONG: story·appearance / HUGE: 超長文字欄位）；純防 JSONB 塞爆 */
export const CHARACTER_TEXT_LIMITS = {
  TINY: 30,
  SHORT: 100,
  MEDIUM: 500,
  ITEM: 800,
  LONG: 2000,
  HUGE: 5000,
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

/** 軟刪除後進入 trash 至 GC 永久刪除的保留天數 */
export const TRASH_RETENTION_DAYS = 7

/** 軟刪除還原後，再次軟刪除的冷卻天數 */
export const RESTORE_COOLDOWN_DAYS = 7

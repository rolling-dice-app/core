/** 特性來源分類 */
export const FEATURE_SOURCES = ['feat', 'class', 'race', 'background', 'other'] as const

/** 特性來源分類 */
export type FeatureSource = (typeof FEATURE_SOURCES)[number]

/** 特性次數恢復時機 */
export const FEATURE_USAGE_RECOVERIES = ['shortRest', 'longRest', 'manual'] as const

/** 特性次數恢復時機 */
export type FeatureUsageRecovery = (typeof FEATURE_USAGE_RECOVERIES)[number]

/** 特性使用次數設定（discriminated union） */
export type FeatureUsage =
  | { hasUses: false }
  | { hasUses: true; max: number; recovery: FeatureUsageRecovery }

/** 角色特性條目（專長、職業能力等） */
export interface CharacterFeature {
  id: string
  name: string
  description: string | null
  source: FeatureSource
  usage: FeatureUsage
}

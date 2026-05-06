/** 特性來源分類 */
export type FeatureSource = 'feat' | 'class' | 'race' | 'background' | 'other'

/** 特性次數恢復時機 */
export type FeatureUsageRecovery = 'shortRest' | 'longRest' | 'manual'

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

import type { SpellLevel } from './character/spell-entry'
import type { AbilityKey } from './dnd/ability-key'
import type { ClassKey } from './dnd/class'

/** 戰鬥當下的 HP 子結構：當前生命 / 臨時生命 / 最大生命臨時加減 */
export interface CombatHp {
  /** 目前生命值；null 表示未開始追蹤，UI 應顯示 effectiveMaxHp */
  current: number | null
  /** 臨時生命值，受傷時優先扣 */
  tempHp: number
  /** 最大生命臨時調整（疊加於 baseMaxHp） */
  maxAdjustment: number
}

/** 死亡豁免計數；HP=0 時生效，HP≥1 自動歸零 */
export interface DeathSaves {
  /** 0..3 */
  successes: number
  /** 0..3 */
  failures: number
}

/** 戰況追蹤資料；獨立於 Character 主資料，與 Character 1:1 */
export interface CombatState {
  characterId: string
  hp: CombatHp
  /** 護甲等級臨時調整（疊加於基礎 AC） */
  acAdjustment: number
  /** 移動速度臨時調整 */
  speedAdjustment: number
  /** 各項豁免的臨時調整 */
  savingThrowAdjustments: Partial<Record<AbilityKey, number>>
  /** 各特性已使用次數（key = feature.id）；未出現的 key 視為 0（未消耗） */
  featureUsesSpent: Partial<Record<string, number>>
  /** 各職業已使用生命骰數（key = ClassKey）；未出現的 key 視為 0 */
  hitDiceUsed: Partial<Record<ClassKey, number>>
  /** 各環級已使用一般法術位數（key = SpellLevel）；未出現的 key 視為 0 */
  spellSlotsUsed: Partial<Record<SpellLevel, number>>
  /** 各環級已使用契術環位數（key = SpellLevel）；未出現的 key 視為 0 */
  pactSlotsUsed: Partial<Record<SpellLevel, number>>
  deathSaves: DeathSaves
  updatedAt: string
}

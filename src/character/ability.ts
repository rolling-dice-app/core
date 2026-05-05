import type { AbilityKey } from '../dnd/ability-key'

/** 屬性原始輸入（origin + 種族加值；亦為 AbilityScoreEntry 的基底） */
export interface AbilityScoreInput {
  /** 玩家自己分配 / 擲骰得到的純基礎值 */
  origin: number
  /** 種族加值（建立時填入） */
  race: number
}

/** 持久化於 Character 的屬性結構：origin + race + 後天 bonusScore */
export interface AbilityScoreEntry extends AbilityScoreInput {
  /** 升級或冒險途中獲得的屬性提升 */
  bonusScore: number
}

/** 角色六項屬性完整資料，以 AbilityKey 為鍵 */
export type CharacterAbilityScores = Record<AbilityKey, AbilityScoreEntry>

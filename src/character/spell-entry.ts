/** 法術環級（1-9，戲法不計） */
export type SpellLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** 各環級最大環位數；只記錄非 0 項 */
export type SpellSlots = Partial<Record<SpellLevel, number>>

/** 各環級環位的使用者調整量（相對於系統依職業 / 等級計算的 base，可正可負）；只記錄非 0 項 */
export type SpellSlotsDelta = Partial<Record<SpellLevel, number>>

/** 角色與單一法術的關係條目；存在於 spells 陣列即代表已掌握 */
export interface SpellEntry {
  /** 法術 UUID */
  id: string
  /** 今日是否已準備 */
  isPrepared: boolean
  /** 是否被玩家標記為常用 */
  isFavorite: boolean
}

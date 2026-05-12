import type { ClassKey } from '../dnd/class.js'

/** 法術環級（1-9，戲法不計） */
export const SPELL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

/** 法術環級（1-9，戲法不計） */
export type SpellLevel = (typeof SPELL_LEVELS)[number]

/** 各環級最大環位數；只記錄非 0 項 */
export type SpellSlots = Partial<Record<SpellLevel, number>>

/** 各環級環位的使用者調整量（相對於系統依職業 / 等級計算的 base，可正可負）；只記錄非 0 項 */
export type SpellSlotsDelta = Partial<Record<SpellLevel, number>>

/** 角色與單一法術的關係條目；sub-endpoint 的唯一 wire shape */
export interface SpellEntryDTO {
  /** entry row PK */
  id: string
  /** 對應 spells catalog 的 spell id */
  spellId: string
  /** 今日是否已準備 */
  isPrepared: boolean
  /** 是否被玩家標記為常用 */
  isFavorite: boolean
  /** 法術來源職業；多職業情境標記由哪個施法職業學得 */
  sourceClass?: ClassKey
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** POST /characters/:id/spells body */
export type SpellEntryCreateBody = Pick<SpellEntryDTO, 'spellId'>

/** PATCH /characters/:id/spells/:spellId body；updatedAt 樂觀鎖必填、其餘可選 */
export type SpellEntryUpdateBody = Pick<SpellEntryDTO, 'updatedAt'> & {
  isPrepared?: boolean
  isFavorite?: boolean
  sourceClass?: ClassKey | null
}

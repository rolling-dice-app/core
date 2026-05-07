import type { AbilityKey } from '../dnd/ability-key.js'
import type { AttackEntry } from './attack.js'
import type { CharacterFeature } from './feature.js'
import type { CharacterInventory } from './inventory.js'
import type { CharacterClasses, CharacterProfile, CharacterStats } from './profile.js'
import type { SpellEntry, SpellSlotsDelta } from './spell-entry.js'

/** 角色能力 section（攻擊、施法、特性） */
export interface CharacterCapabilities {
  attacks: AttackEntry[]
  /** 施法主屬性列表（兼職施法者可有多個來源） */
  spellcastingAbilities: AbilityKey[]
  /** 各施法主屬性的自定義調整值；只記錄非 0 項 */
  customSpellcastingBonuses: Partial<Record<AbilityKey, number>>
  /** 角色掌握的法術；以 SpellEntry 形式同時記錄準備 / 常用狀態 */
  spells: SpellEntry[]
  /** 一般施法者環位的使用者調整量；顯示值為 base + delta（base 由職業 / 等級推算） */
  spellSlotsDelta: SpellSlotsDelta
  /** 契術師 pact magic 環位的使用者調整量；獨立保留短休恢復語意 */
  pactSlotsDelta: SpellSlotsDelta
  features: CharacterFeature[]
}

/** 完整角色資料；五個 section 的組合，加上識別與時間戳 */
export interface Character
  extends
    CharacterProfile,
    CharacterClasses,
    CharacterStats,
    CharacterCapabilities,
    CharacterInventory {
  id: string
  createdAt: string
}

export * from './ability.js'
export * from './attack.js'
export * from './feature.js'
export * from './inventory.js'
export * from './profile.js'
export * from './spell-entry.js'

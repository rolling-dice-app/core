import type { AbilityKey } from '../dnd/ability-key.js'
import type { AttackEntry } from './attack.js'
import type { CharacterFeature } from './feature.js'
import type { SpellSlotsDelta } from './spell-entry.js'

/** 角色能力 section（攻擊、施法、特性）；spells 拆出獨立 sub-resource，不再嵌入此 section */
export interface CharacterCapabilities {
  attacks: AttackEntry[]
  /** 施法主屬性列表（兼職施法者可有多個來源） */
  spellcastingAbilities: AbilityKey[]
  /** 各施法主屬性的自定義調整值；只記錄非 0 項 */
  customSpellcastingBonuses: Partial<Record<AbilityKey, number>>
  /** 一般施法者環位的使用者調整量；顯示值為 base + delta（base 由職業 / 等級推算） */
  spellSlotsDelta: SpellSlotsDelta
  /** 契術師 pact magic 環位的使用者調整量；獨立保留短休恢復語意 */
  pactSlotsDelta: SpellSlotsDelta
  features: CharacterFeature[]
}

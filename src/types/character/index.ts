import type { AbilityKey } from '../dnd/ability-key.js'
import type { AlignmentKey } from '../dnd/alignment.js'
import type { ClassEntry } from '../dnd/class.js'
import type { GenderKey } from '../dnd/gender.js'
import type { SkillProficiencies } from '../dnd/skill.js'
import type { CharacterAbilityScores } from './ability.js'
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

/** 完整角色資料；profile / classes / stats / capabilities / inventory 五段組合，附識別與時間戳 */
export interface CharacterDTO
  extends
    CharacterProfile,
    CharacterClasses,
    CharacterStats,
    CharacterCapabilities,
    CharacterInventory {
  id: string
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** 建立角色時 client 提交的 payload；其餘欄位由 buildCharacterCreateDefaults 補 */
export interface CharacterCreateDTO {
  name: string
  gender: GenderKey | null
  race: string | null
  subrace: string | null
  alignment: AlignmentKey | null
  background: string | null
  faith: string | null
  age: number | null
  height: string | null
  weight: string | null
  appearance: string | null
  story: string | null
  languages: string | null
  tools: string | null
  weaponProficiencies: string | null
  armorProficiencies: string | null
  avatar?: string | null
  classes: ClassEntry[]
  abilities: CharacterAbilityScores
  skills: SkillProficiencies
  isJackOfAllTrades: boolean
  isTough: boolean
}

/** 角色列表 payload；level 為各職業等級總和，由 server 預先計算 */
export interface CharacterSummaryDTO {
  id: string
  name: string
  classes: ClassEntry[]
  level: number
  avatar: string | null
  updatedAt: string
}

export * from './ability.js'
export * from './attack.js'
export * from './feature.js'
export * from './inventory.js'
export * from './profile.js'
export * from './spell-entry.js'

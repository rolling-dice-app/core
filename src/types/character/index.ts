import type { AbilityKey } from '../dnd/ability-key.js'
import type { AlignmentKey } from '../dnd/alignment.js'
import type { ClassEntry } from '../dnd/class.js'
import type { GenderKey } from '../dnd/gender.js'
import type { SkillProficiencies } from '../dnd/skill.js'
import type { CharacterAbilityScores } from './ability.js'
import type { AttackEntry } from './attack.js'
import type { CharacterFeature } from './feature.js'
import type { CharacterClasses, CharacterProfile, CharacterStats } from './profile.js'
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

/** 完整角色資料；profile / classes / stats / capabilities 四段組合，附識別與時間戳。spells / inventory items / currency 走獨立 sub-endpoint */
export interface CharacterDTO
  extends CharacterProfile, CharacterClasses, CharacterStats, CharacterCapabilities {
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

/** 編輯角色時 client 提交的 patch payload；以 section 為粒度局部更新，附 updatedAt 樂觀鎖。spells / inventory / currency 不接受於此，請打對應 sub-endpoint */
export interface CharacterUpdateDTO {
  /** 樂觀鎖；client 必須帶上目前 GET 拿到的 updatedAt */
  updatedAt: string
  profile?: Partial<CharacterProfile>
  classes?: Partial<CharacterClasses>
  stats?: Partial<CharacterStats>
  capabilities?: Partial<CharacterCapabilities>
}

/** 角色列表 payload；level 為各職業等級總和，由 server 預先計算 */
export interface CharacterSummaryDTO {
  id: string
  name: string
  race: string | null
  classes: ClassEntry[]
  level: number
  avatar: string | null
  updatedAt: string
}

export * from './ability.js'
export * from './attack.js'
export * from './campaign-record.js'
export * from './currency.js'
export * from './feature.js'
export * from './inventory.js'
export * from './profile.js'
export * from './spell-entry.js'

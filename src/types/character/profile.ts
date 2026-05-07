import type { AbilityKey } from '../dnd/ability-key'
import type { AlignmentKey } from '../dnd/alignment'
import type { GenderKey } from '../dnd/misc'
import type { ClassEntry } from '../dnd/class'
import type { SkillProficiencies } from '../dnd/skill'
import type { CharacterAbilityScores } from './ability'
import type { ArmorClassConfig } from './attack'

/** 角色基本資料 section */
export interface CharacterProfile {
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
  avatar: string | null
}

/** 角色職業 section */
export interface CharacterClasses {
  classes: ClassEntry[]
}

/** 角色屬性與戰鬥相關數值 section */
export interface CharacterStats {
  abilities: CharacterAbilityScores
  skills: SkillProficiencies
  /** 使用者額外勾選的豁免熟練（不含主職業 baseline） */
  savingThrowExtras: AbilityKey[]
  /** 是否全能高手（1/2 熟練） */
  isJackOfAllTrades: boolean
  /** 是否具有健壯特質（每等額外 2 HP） */
  isTough: boolean
  armorClass: ArmorClassConfig
  /** 額外生命值（與職業 HP、體質加值、健壯加值累加為總 HP） */
  customHpBonus: number
  /** 額外移動速度加值，移動速度 = 30 + speedBonus */
  speedBonus: number
  /** 額外先攻加值 */
  initiativeBonus: number
  /** 額外加值到先攻的屬性（null = 不加） */
  initiativeAbilityKey: AbilityKey | null
  /** 額外被動察覺加值 */
  passivePerceptionBonus: number
  /** 額外被動洞察加值 */
  passiveInsightBonus: number
}

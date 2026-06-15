import type { AbilityKey } from './dnd/ability-key.js'
import type { AlignmentKey } from './dnd/alignment.js'
import type { SizeKey } from './dnd/size.js'
import type { SkillKey } from './dnd/skill.js'
import type { DamageDieEntry } from './character/attack.js'

/** 怪物攻擊條目；命中走寫死的 flat 加值（不套屬性＋熟練），傷害重用角色的 DamageDieEntry */
export interface MonsterAttackEntry {
  /** 行內穩定識別 */
  id: string
  /** 攻擊名稱 */
  name: string
  /** 命中加值（flat 絕對值，不由屬性 / 熟練衍生） */
  hitBonus: number
  /** 傷害條目（可有多行不同骰面 / 類型 / 加值） */
  damageDice: DamageDieEntry[]
  /** 補充說明（觸發條件、附加效果等；未填以 null 表示） */
  comment: string | null
}

/** 怪物特性 / 動作；trait / action / reaction / legendary 一律平鋪、靠文字自述，不分組 */
export interface MonsterFeature {
  /** 行內穩定識別 */
  id: string
  /** 特性名稱 */
  name: string
  /** 特性描述（未填以 null 表示） */
  description: string | null
}

/** 完整怪物模板；數值全走 flat 絕對值（怪物無等級成長），附識別與時間戳。無 restore，故不含 restoredAt */
export interface MonsterTemplateDTO {
  /** 名稱 */
  name: string
  /** 體型（null 表未選擇） */
  size: SizeKey | null
  /** 陣營（null 表未選擇） */
  alignment: AlignmentKey | null
  /** 挑戰等級；自由字串（如 "1/2"、"5"），不限定集合 */
  challengeRating: string | null
  /** 護甲等級（flat 絕對值） */
  ac: number
  /** 生命值最大值 */
  hp: number
  /** 速度；自由文字（如 "30 ft., fly 60 ft."） */
  speed: string
  /** 先攻加值（flat 絕對值） */
  initiativeBonus: number
  /** 六屬性分數（flat，不套 AbilityScoreEntry） */
  abilities: Record<AbilityKey, number>
  /** 豁免加值；只列有的，存 flat 加值（怪物不吃熟練加值） */
  savingThrows: Partial<Record<AbilityKey, number>>
  /** 技能加值；只列有的，存 flat 加值 */
  skills: Partial<Record<SkillKey, number>>
  /** 傷害易傷；自由文字 */
  damageVulnerabilities: string | null
  /** 傷害抗性；自由文字 */
  damageResistances: string | null
  /** 傷害免疫；自由文字 */
  damageImmunities: string | null
  /** 狀態免疫；自由文字 */
  conditionImmunities: string | null
  /** 感官（含被動察覺）；自由文字 */
  senses: string | null
  /** 語言；自由文字 */
  languages: string | null
  /** 攻擊條目 */
  attacks: MonsterAttackEntry[]
  /** 特性 / 動作條目 */
  features: MonsterFeature[]
  /** 唯一識別 */
  id: string
  /** 擁有者（DM）的 user id */
  userId: string
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** 怪物模板列表 payload；輕量子集，不含 attacks / features 等重陣列 */
export interface MonsterTemplateSummaryDTO {
  id: string
  name: string
  size: SizeKey | null
  challengeRating: string | null
  ac: number
  hp: number
}

/** 建立怪物模板時 client 提交的 payload；只 name 必填，其餘由 buildMonsterTemplateCreateDefaults 補 */
export interface MonsterTemplateCreateBody {
  name: string
}

/** 編輯怪物模板時 client 提交的 patch payload；附 updatedAt 樂觀鎖，業務欄位皆 optional 局部更新 */
export type MonsterTemplateUpdateBody = Pick<MonsterTemplateDTO, 'updatedAt'> &
  Partial<
    Pick<
      MonsterTemplateDTO,
      | 'name'
      | 'size'
      | 'alignment'
      | 'challengeRating'
      | 'ac'
      | 'hp'
      | 'speed'
      | 'initiativeBonus'
      | 'abilities'
      | 'savingThrows'
      | 'skills'
      | 'damageVulnerabilities'
      | 'damageResistances'
      | 'damageImmunities'
      | 'conditionImmunities'
      | 'senses'
      | 'languages'
      | 'attacks'
      | 'features'
    >
  >

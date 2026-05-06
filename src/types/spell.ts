import type { ProfessionKey } from './dnd/profession'

/** 法術學派（以英文 camelCase 為 key，中文僅為顯示 label） */
export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'

/** 法術出處 sourcebook 縮寫 */
export type SourceKey =
  | 'AAG'
  | 'AI'
  | 'BMT'
  | 'EGW'
  | 'FTD'
  | 'GGR'
  | 'PHB'
  | 'SCC'
  | 'TCE'
  | 'TDCSR'
  | 'XGE'

/** 來自 public/json/spells.json 的原始法術資料 */
export interface SpellDto {
  id: string
  name: string
  engName: string
  level: number
  school: SpellSchool
  castingTime: string
  range: string
  verbal: boolean
  somatic: boolean
  material: string
  duration: string
  concentration: boolean
  ritual: boolean
  source: SourceKey
  classes: ProfessionKey[]
  desc: string
}

/** 正規化後的法術資料，供 UI 使用 */
export type Spell = SpellDto

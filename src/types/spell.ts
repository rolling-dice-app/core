import type { ClassKey } from './dnd/class.js'

/** 法術學派 */
export const SPELL_SCHOOLS = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
] as const

/** 法術學派 */
export type SpellSchool = (typeof SPELL_SCHOOLS)[number]

/** 法術出處 sourcebook 縮寫 */
export const SPELL_SOURCES = [
  'AAG',
  'AI',
  'BMT',
  'EGW',
  'FTD',
  'GGR',
  'PHB',
  'SATO',
  'SCC',
  'TCE',
  'TDCSR',
  'XGE',
] as const

/** 法術出處 sourcebook 縮寫 */
export type SourceKey = (typeof SPELL_SOURCES)[number]

/** 法術完整資料的跨邊界公開契約 */
export interface SpellDTO {
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
  classes: ClassKey[]
  desc: string
}

/** SpellDTO 內容部分（不含 id）；backend `spells.data` JSONB column 的型別來源，row PK 與 JSONB 不重複存 id */
export type SpellRecord = Omit<SpellDTO, 'id'>

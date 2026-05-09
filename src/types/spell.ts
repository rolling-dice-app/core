import type { ClassKey } from './dnd/class.js'

/** 法術學派 */
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

import { ABILITY_KEYS } from '../types/dnd/ability-key.js'
import type { AbilityKey } from '../types/dnd/ability-key.js'
import type { MonsterTemplateDTO, MonsterTemplateCreateBody } from '../types/monster.js'

/** 新建怪物的保守預設護甲值 */
export const MONSTER_DEFAULT_AC = 10

/** 新建怪物的保守預設生命值 */
export const MONSTER_DEFAULT_HP = 1

/** 新建怪物的預設屬性分數 */
export const MONSTER_DEFAULT_ABILITY_SCORE = 10

/** 新建怪物時非 MonsterTemplateCreateBody 欄位的初始值；frontend mock 與 backend POST handler 共用。id / userId / sortOrder / 時間戳 / deletedAt 由 backend row state 帶出，不屬 defaults */
export const buildMonsterTemplateCreateDefaults = (): Omit<
  MonsterTemplateDTO,
  | keyof MonsterTemplateCreateBody
  | 'id'
  | 'userId'
  | 'sortOrder'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> => ({
  size: null,
  alignment: null,
  challengeRating: null,
  ac: MONSTER_DEFAULT_AC,
  hp: MONSTER_DEFAULT_HP,
  speed: '',
  initiativeBonus: 0,
  abilities: ABILITY_KEYS.reduce(
    (acc, key) => {
      acc[key] = MONSTER_DEFAULT_ABILITY_SCORE
      return acc
    },
    {} as Record<AbilityKey, number>,
  ),
  savingThrows: {},
  skills: {},
  damageVulnerabilities: null,
  damageResistances: null,
  damageImmunities: null,
  conditionImmunities: null,
  senses: null,
  languages: null,
  attacks: [],
  features: [],
})

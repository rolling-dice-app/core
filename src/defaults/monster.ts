import { ABILITY_KEYS } from '../types/dnd/ability-key.js'
import type { AbilityKey } from '../types/dnd/ability-key.js'
import type { MonsterTemplateDTO } from '../types/monster.js'

/** 新建怪物的保守預設護甲值 */
export const MONSTER_DEFAULT_AC = 10

/** 新建怪物的保守預設生命值 */
export const MONSTER_DEFAULT_HP = 1

/** 新建怪物的預設屬性分數 */
export const MONSTER_DEFAULT_ABILITY_SCORE = 10

/** 新建怪物的預設速度（呎）；PHB 多數中型人形生物步行速度 30 呎 */
export const MONSTER_DEFAULT_SPEED = 30

/** 新建怪物時 client 未帶欄位的初始值；backend POST handler 以 body 覆蓋此結果。id / userId / 時間戳 由 backend row state 帶出，不屬 defaults */
export const buildMonsterTemplateCreateDefaults = (): Omit<
  MonsterTemplateDTO,
  'name' | 'id' | 'userId' | 'createdAt' | 'updatedAt'
> => ({
  size: null,
  alignment: null,
  challengeRating: null,
  ac: MONSTER_DEFAULT_AC,
  hp: MONSTER_DEFAULT_HP,
  speed: MONSTER_DEFAULT_SPEED,
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
  damageModifiers: {},
  conditionImmunityKeys: [],
  senses: null,
  languages: null,
  attacks: [],
  features: [],
  remark: null,
})

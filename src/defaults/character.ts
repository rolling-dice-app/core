import type { ArmorClassConfig } from '../types/character/attack.js'
import type { CharacterCurrencyDTO } from '../types/character/currency.js'
import type { CharacterDTO, CharacterCreateDTO } from '../types/character/index.js'

/** SRD 無甲基礎護甲值 */
export const UNARMORED_AC_BASE = 10

/** 新建角色的初始貨幣狀態；供 backend 在 character create tx 內 INSERT character_currency row 用 */
export const DEFAULT_CURRENCY: Readonly<Omit<CharacterCurrencyDTO, 'updatedAt'>> = {
  cp: 0,
  sp: 0,
  gp: 0,
  pp: 0,
}

/** 新建角色的初始護甲設定（無甲） */
export const createDefaultArmorClass = (): ArmorClassConfig => ({
  type: 'none',
  value: UNARMORED_AC_BASE,
  abilityKey: null,
  shieldValue: 0,
})

/** 新建角色時非 CharacterCreateDTO 欄位的初始值；frontend mock 與 backend POST handler 共用。spells / inventory items / currency 由各自 sub-resource 管理，不在此 */
export const buildCharacterCreateDefaults = (): Omit<
  CharacterDTO,
  keyof CharacterCreateDTO | 'id' | 'createdAt' | 'updatedAt'
> => ({
  savingThrowExtras: [],
  armorClass: createDefaultArmorClass(),
  customHpBonus: 0,
  speedBonus: 0,
  initiativeBonus: 0,
  initiativeAbilityKey: null,
  passivePerceptionBonus: 0,
  passiveInsightBonus: 0,
  attacks: [],
  spellcastingAbilities: [],
  customSpellcastingBonuses: {},
  spellSlotsDelta: {},
  pactSlotsDelta: {},
  features: [],
})

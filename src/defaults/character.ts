import type { CharacterDTO, CharacterCreateDTO } from '../types/character/index.js'
import type { ArmorClassConfig } from '../types/character/attack.js'
import type { CharacterCurrency, InventoryItem } from '../types/character/inventory.js'

/** SRD 無甲基礎護甲值 */
export const UNARMORED_AC_BASE = 10

/** 新建角色的初始貨幣狀態 */
export const DEFAULT_CURRENCY: Readonly<CharacterCurrency> = {
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

/** 新建角色的初始背包與貨幣；每次呼叫回傳獨立物件 */
export const createDefaultInventory = (): {
  items: InventoryItem[]
  currency: CharacterCurrency
} => ({ items: [], currency: { ...DEFAULT_CURRENCY } })

/** 新建角色時非 CharacterCreateDTO 欄位的初始值；frontend mock 與 backend POST handler 共用 */
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
  spells: [],
  spellSlotsDelta: {},
  pactSlotsDelta: {},
  features: [],
  ...createDefaultInventory(),
})

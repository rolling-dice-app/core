import type { Character, CharacterCreateInput } from '../types/character/index.js'
import type { ArmorClassConfig } from '../types/character/attack.js'
import type { CharacterCurrency, InventoryItem } from '../types/character/inventory.js'

/** SRD 無甲基礎護甲值（10 + DEX mod 為 SRD baseline） */
export const UNARMORED_AC_BASE = 10

/** 新建角色的初始貨幣狀態 */
export const DEFAULT_CURRENCY: Readonly<CharacterCurrency> = {
  cp: 0,
  sp: 0,
  gp: 0,
  pp: 0,
}

/** 新建角色的初始護甲設定（無甲） */
export function createDefaultArmorClass(): ArmorClassConfig {
  return {
    type: 'none',
    value: UNARMORED_AC_BASE,
    abilityKey: null,
    shieldValue: 0,
  }
}

/** 新建角色的初始背包與貨幣；每次呼叫回傳獨立物件 */
export function createDefaultInventory(): {
  items: InventoryItem[]
  currency: CharacterCurrency
} {
  return { items: [], currency: { ...DEFAULT_CURRENCY } }
}

/**
 * 建構 Character 中「不在 CharacterCreateInput」的 16 個欄位的初始值。
 * frontend mock-build 與 backend POST handler 共用，確保新建 character
 * 的預設狀態 source-of-truth 唯一。
 */
export function buildCharacterCreateDefaults(): Omit<
  Character,
  keyof CharacterCreateInput | 'id' | 'createdAt' | 'updatedAt'
> {
  return {
    avatar: null,
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
  }
}

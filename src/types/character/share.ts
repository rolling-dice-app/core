import type { CharacterDTO } from './character.js'
import type { CurrencyAmount } from './currency.js'
import type { InventoryItemDTO } from './inventory.js'
import type { SpellEntryDTO } from './spell-entry.js'

/**
 * Public share endpoint 的 character 投影。
 * 採 allowlist (Pick)：日後 CharacterDTO 新增 owner-only 欄位時預設不公開；
 * 若需公開，必須同時更新 sharedCharacterProfileDTOSchema 與 toSharedCharacterProfileDTO。
 */
export type SharedCharacterProfileDTO = Pick<
  CharacterDTO,
  | 'name'
  | 'gender'
  | 'race'
  | 'subrace'
  | 'alignment'
  | 'background'
  | 'faith'
  | 'age'
  | 'height'
  | 'weight'
  | 'appearance'
  | 'story'
  | 'languages'
  | 'tools'
  | 'weaponProficiencies'
  | 'armorProficiencies'
  | 'avatar'
  | 'classes'
  | 'abilities'
  | 'skills'
  | 'savingThrowExtras'
  | 'isJackOfAllTrades'
  | 'isTough'
  | 'armorClass'
  | 'customHpBonus'
  | 'speedBonus'
  | 'initiativeBonus'
  | 'initiativeAbilityKey'
  | 'passivePerceptionBonus'
  | 'passiveInsightBonus'
  | 'attacks'
  | 'spellcastingAbilities'
  | 'customSpellcastingBonuses'
  | 'spellSlotsDelta'
  | 'pactSlotsDelta'
  | 'features'
>

/**
 * Public share endpoint 的 inventory item 投影。
 * 排除 id / createdAt / updatedAt（updatedAt 同為 owner PATCH 樂觀鎖 token）。
 */
export type SharedInventoryItemDTO = Pick<
  InventoryItemDTO,
  'name' | 'description' | 'quantity' | 'weight' | 'type' | 'location' | 'isAttuned'
>

/**
 * Public share endpoint 的 spell entry 投影。
 * 排除 entry row id / createdAt / updatedAt；保留 spellId（catalog 引用）與旗標。
 */
export type SharedSpellEntryDTO = Pick<
  SpellEntryDTO,
  'spellId' | 'isPrepared' | 'isFavorite' | 'sourceClass'
>

/** GET /share/characters/:shareId 的聚合回應；不含 combat-state、不含 campaign records */
export interface SharedCharacterDTO {
  character: SharedCharacterProfileDTO
  inventory: SharedInventoryItemDTO[]
  currency: CurrencyAmount
  spells: SharedSpellEntryDTO[]
  ownerDisplayName: string
}

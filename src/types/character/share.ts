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

/**
 * shareable 角色卡公開預覽。available=true 帶完整預覽；失效（owner 關了分享 / 角色已軟刪 / 不存在）
 * 則 available=false、name/avatar/ownerDisplayName 為 null，仍保留 shareId 供 caller 標註。
 */
export interface SharedCharacterPreviewDTO {
  /** 被連結角色卡的 shareId（chs_…）；含失效者亦回傳 */
  shareId: string
  /** 該 shareId 目前是否仍指向有效（存在 + shareable + 未軟刪）的角色卡 */
  available: boolean
  /** 僅 available=true 時有值 */
  name: string | null
  /** 僅 available=true 時有值 */
  avatar: string | null
  /** 僅 available=true 時有值 */
  ownerDisplayName: string | null
}

/** POST /share/characters/resolve body；批次依 shareId 解析 shareable 角色卡公開預覽 */
export interface ResolveSharedCharactersBody {
  shareIds: string[]
}

/** POST /share/characters/resolve 回應；previews 順序與輸入一致 */
export interface ResolveSharedCharactersResponse {
  previews: SharedCharacterPreviewDTO[]
}

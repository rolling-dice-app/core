import type { SharedCharacterProfileDTO } from '../types/character/share.js'

/** D&D 5e：角色同調物品基礎 slot */
export const BASE_ATTUNED_SLOT = 3

/** 額外同調 slot；當前版本最多額外 3 個 */
export const EXTRA_ATTUNED_SLOT = 3

/**
 * 計算角色實際同調上限。
 *
 * 參數型別取 `SharedCharacterProfileDTO`（公開投影）；完整 `CharacterDTO` 仍可結構相容傳入。
 * 規則來源與 permissive cap 緣由參見 `core/CLAUDE.md` 的「Catalogue of permissive caps」。
 */
export function computeAttunedLimit(_character: SharedCharacterProfileDTO): number {
  return BASE_ATTUNED_SLOT + EXTRA_ATTUNED_SLOT
}

import type { CharacterDTO } from '../types/character/index.js'

/** D&D 5e：角色同調物品基礎 slot */
export const BASE_ATTUNED_SLOT = 3

/** 額外同調 slot；當前版本最多額外 3 個 */
export const EXTRA_ATTUNED_SLOT = 3

/**
 * 計算角色實際同調上限。
 */
export function computeAttunedLimit(_character: CharacterDTO): number {
  return BASE_ATTUNED_SLOT + EXTRA_ATTUNED_SLOT
}

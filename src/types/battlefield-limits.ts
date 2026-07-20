import { CHARACTER_INT_LIMITS } from './validation-limits.js'

/**
 * Battlefield 欄位防爆數值範圍；純防 JSONB 塞爆，不承載戰鬥規則語意。
 * `_ABS_MAX` 後綴代表 ±cap；`_MIN` 後綴明示非 0 下限；其餘 `_MAX` 代表 0..max。
 * `UNIT_` 前綴為 BattlefieldUnit 欄位，無前綴為 BattlefieldDTO 頂層欄位。
 */
export const BATTLEFIELD_LIMITS = {
  /** battleSequence 下限（第 1 場起算，無第 0 場） */
  BATTLE_SEQUENCE_MIN: 1,
  BATTLE_SEQUENCE_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
  /** round 下限（第 1 輪起算，無第 0 輪） */
  ROUND_MIN: 1,
  ROUND_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
  /** maxHp 快照基準下限（單位必有至少 1 HP）；hp.current / hp.tempHp 下限為 0 */
  UNIT_HP_MIN: 1,
  /** maxHp / hp.current / hp.tempHp 共用上限 */
  UNIT_HP_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
  /** hp.maxAdjustment ±cap（比照 COMBAT_STATE_LIMITS.HP_MAX_ADJUSTMENT_ABS_MAX） */
  UNIT_HP_MAX_ADJUSTMENT_ABS_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
  /** ac 快照基準上限（下限為 0） */
  UNIT_AC_MAX: CHARACTER_INT_LIMITS.SMALL_INT_MAX,
  /** acAdjustment ±cap（比照 COMBAT_STATE_LIMITS.AC_ADJUSTMENT_ABS_MAX） */
  UNIT_AC_ADJUSTMENT_ABS_MAX: CHARACTER_INT_LIMITS.SMALL_INT_MAX,
  /** 攻擊快照 hitBonus ±cap */
  UNIT_ATTACK_HIT_BONUS_ABS_MAX: CHARACTER_INT_LIMITS.SMALL_INT_MAX,
  /** initiativeBonus ±cap */
  UNIT_INITIATIVE_BONUS_ABS_MAX: CHARACTER_INT_LIMITS.SMALL_INT_MAX,
  /** initiative ±cap */
  UNIT_INITIATIVE_ABS_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
  /** sortOrder 上限（下限為 0） */
  UNIT_SORT_ORDER_MAX: CHARACTER_INT_LIMITS.GENERAL_INT_MAX,
} as const

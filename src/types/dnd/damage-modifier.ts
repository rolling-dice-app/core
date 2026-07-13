/** 傷害調整 key（同一傷害類型三態互斥，擇一） */
export const DAMAGE_MODIFIER_KEYS = [
  'vulnerability', // 易傷
  'resistance', // 抗性
  'immunity', // 免疫
] as const

/** 傷害調整：對某傷害類型的易傷 / 抗性 / 免疫狀態 */
export type DamageModifierKey = (typeof DAMAGE_MODIFIER_KEYS)[number]

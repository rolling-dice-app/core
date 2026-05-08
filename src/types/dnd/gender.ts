/** 性別 key */
export const GENDER_KEYS = [
  'male', // 男性
  'female', // 女性
  'nonBinary', // 非二元
] as const

/** 性別 */
export type GenderKey = (typeof GENDER_KEYS)[number]

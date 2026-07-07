/** 體型 key（從微型到巨型） */
export const SIZE_KEYS = [
  'tiny', // 微型
  'small', // 小型
  'medium', // 中型
  'large', // 大型
  'huge', // 超大型
  'gargantuan', // 巨型
] as const

/** 體型：D&D 尺寸分類 */
export type SizeKey = (typeof SIZE_KEYS)[number]

/** 護甲類型 */
export const ARMOR_TYPES = ['light', 'medium', 'heavy', 'none'] as const

/** 護甲類型 */
export type ArmorType = (typeof ARMOR_TYPES)[number]

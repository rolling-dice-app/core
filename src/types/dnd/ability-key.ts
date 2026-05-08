/** 六項基本屬性 key */
export const ABILITY_KEYS = [
  'strength', // 力量
  'dexterity', // 敏捷
  'constitution', // 體質
  'intelligence', // 智力
  'wisdom', // 感知
  'charisma', // 魅力
] as const

/** 六項基本屬性 key */
export type AbilityKey = (typeof ABILITY_KEYS)[number]

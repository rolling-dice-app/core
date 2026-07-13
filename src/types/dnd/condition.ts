/** 狀態 key（5e 標準 15 種狀態，字母序） */
export const CONDITION_KEYS = [
  'blinded', // 目盲
  'charmed', // 魅惑
  'deafened', // 耳聾
  'exhaustion', // 力竭
  'frightened', // 恐懼
  'grappled', // 擒抱
  'incapacitated', // 失能
  'invisible', // 隱形
  'paralyzed', // 麻痺
  'petrified', // 石化
  'poisoned', // 中毒
  'prone', // 倒地
  'restrained', // 束縛
  'stunned', // 震懾
  'unconscious', // 昏迷
] as const

/** 狀態：D&D 標準狀態分類 */
export type ConditionKey = (typeof CONDITION_KEYS)[number]

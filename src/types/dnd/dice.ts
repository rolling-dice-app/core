/** 一般骰面 */
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

/** 傷害骰可用骰面（不含 d20、d100） */
export type DamageDieType = Extract<DieType, 'd4' | 'd6' | 'd8' | 'd10' | 'd12'>

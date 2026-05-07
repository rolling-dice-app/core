/** 骰子面數；DND 5e 標準骰種 */
export type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100

/** 傷害骰可用面數（不含 d20、d100） */
export type DamageDieType = Extract<DieType, 4 | 6 | 8 | 10 | 12>

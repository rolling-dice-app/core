import type { CombatStateBody } from '../types/combat.js'

/** 新建 CombatState 時 body 欄位的初始值；每次呼叫回傳獨立物件 */
export const buildCombatStateBodyDefaults = (): CombatStateBody => ({
  hp: { current: null, tempHp: 0, maxAdjustment: 0 },
  acAdjustment: 0,
  speedAdjustment: 0,
  savingThrowAdjustments: {},
  featureUsesSpent: {},
  hitDiceUsed: {},
  spellSlotsUsed: {},
  pactSlotsUsed: {},
  deathSaves: { successes: 0, failures: 0 },
})

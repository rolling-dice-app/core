import { CLASS_HIT_DICE } from '../types/dnd/class.js'
import type { SharedCharacterProfileDTO } from '../types/character/share.js'

/** 主職業（陣列首項）第 1 級取滿生命骰，其餘等級用平均（PHB p.15）；非主職業全用平均。 */
export function getClassHitPoints(hitDie: number, level: number, isPrimary: boolean): number {
  const avg = Math.floor(hitDie / 2) + 1
  if (isPrimary && level >= 1) {
    return hitDie + avg * (level - 1)
  }
  return avg * level
}

export type HpMaxInput = Pick<
  SharedCharacterProfileDTO,
  'classes' | 'abilities' | 'isTough' | 'customHpBonus'
>

/** 角色 base HP 上限；不含 combat-state 的 hp.maxAdjustment（屬戰鬥當下臨時值，caller 自套）。 */
export function computeHpMax(character: HpMaxInput): number {
  const con = character.abilities.constitution
  const conModifier = Math.floor((con.origin + con.race + con.bonusScore - 10) / 2)

  let totalLevel = 0
  let classHp = 0
  for (const [index, entry] of character.classes.entries()) {
    const hp = getClassHitPoints(CLASS_HIT_DICE[entry.classKey], entry.level, index === 0)
    classHp += hp + conModifier * entry.level
    totalLevel += entry.level
  }
  const toughBonus = character.isTough ? totalLevel * 2 : 0
  return classHp + toughBonus + character.customHpBonus
}

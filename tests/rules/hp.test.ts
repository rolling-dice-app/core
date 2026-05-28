import { describe, expect, it } from 'vitest'

import type {
  AbilityKey,
  CharacterAbilityScores,
  ClassEntry,
  ClassKey,
  SubclassKey,
} from '../../src/types/index.js'
import { computeHpMax, getClassHitPoints, type HpMaxInput } from '../../src/rules/hp.js'

const classEntry = (
  classKey: ClassKey,
  level: number,
  subclass: SubclassKey | null = null,
): ClassEntry => ({ classKey, level, subclass })

const abilities = (constitution: number): CharacterAbilityScores => {
  const base: Record<AbilityKey, { origin: number; race: number; bonusScore: number }> = {
    strength: { origin: 10, race: 0, bonusScore: 0 },
    dexterity: { origin: 10, race: 0, bonusScore: 0 },
    constitution: { origin: constitution, race: 0, bonusScore: 0 },
    intelligence: { origin: 10, race: 0, bonusScore: 0 },
    wisdom: { origin: 10, race: 0, bonusScore: 0 },
    charisma: { origin: 10, race: 0, bonusScore: 0 },
  }
  return base as CharacterAbilityScores
}

const character = (overrides: Partial<HpMaxInput>): HpMaxInput => ({
  classes: [],
  abilities: abilities(10),
  isTough: false,
  customHpBonus: 0,
  ...overrides,
})

describe('getClassHitPoints', () => {
  it('主職業第 1 級取滿生命骰', () => {
    expect(getClassHitPoints(10, 1, true)).toBe(10)
  })

  it('主職業 5 級：滿 + 平均 ×4', () => {
    // d10 平均 = floor(10/2)+1 = 6；10 + 6×4 = 34
    expect(getClassHitPoints(10, 5, true)).toBe(34)
  })

  it('非主職業全用平均', () => {
    // d8 平均 = 5；level=3 → 15
    expect(getClassHitPoints(8, 3, false)).toBe(15)
  })

  it('非主職業第 1 級也用平均，不取滿', () => {
    expect(getClassHitPoints(12, 1, false)).toBe(7)
  })
})

describe('computeHpMax', () => {
  it('空 classes：只回傳 customHpBonus', () => {
    expect(computeHpMax(character({ customHpBonus: 7 }))).toBe(7)
  })

  it('單職業 fighter lv1：滿 d10 + 0 CON mod', () => {
    expect(computeHpMax(character({ classes: [classEntry('fighter', 1)] }))).toBe(10)
  })

  it('單職業 fighter lv1 + CON 14：10 + 2', () => {
    expect(
      computeHpMax(character({ classes: [classEntry('fighter', 1)], abilities: abilities(14) })),
    ).toBe(12)
  })

  it('單職業 wizard lv5：d6 主職業 → 6 + 4×4 = 22；CON 12 → +5；總 27', () => {
    expect(
      computeHpMax(character({ classes: [classEntry('wizard', 5)], abilities: abilities(12) })),
    ).toBe(27)
  })

  it('Tough 特質每等加 2', () => {
    // fighter lv3 base = 10 + 6×2 = 22；tough +6；total 28
    expect(computeHpMax(character({ classes: [classEntry('fighter', 3)], isTough: true }))).toBe(28)
  })

  it('customHpBonus 直接疊加', () => {
    expect(computeHpMax(character({ classes: [classEntry('fighter', 3)], customHpBonus: 5 }))).toBe(
      27,
    )
  })

  it('多職業：第一項算主職業滿骰、其餘平均；CON 各自疊加', () => {
    // primary: fighter lv3 → 10 + 6 + 6 = 22；CON 14 (mod +2) × 3 = +6
    // multi: wizard lv2 → 4 + 4 = 8；CON +2 × 2 = +4
    // total = 22 + 6 + 8 + 4 = 40
    expect(
      computeHpMax(
        character({
          classes: [classEntry('fighter', 3), classEntry('wizard', 2)],
          abilities: abilities(14),
        }),
      ),
    ).toBe(40)
  })

  it('負 CON 修正會扣 HP', () => {
    // fighter lv5 base = 10 + 6×4 = 34；CON 8 (mod -1) × 5 = -5；total 29
    expect(
      computeHpMax(character({ classes: [classEntry('fighter', 5)], abilities: abilities(8) })),
    ).toBe(29)
  })

  it('abilities 走 origin + race + bonusScore 加總', () => {
    const input = character({
      classes: [classEntry('fighter', 1)],
      abilities: {
        ...abilities(10),
        constitution: { origin: 8, race: 2, bonusScore: 4 }, // total 14 → mod +2
      },
    })
    // 10 + 2 = 12
    expect(computeHpMax(input)).toBe(12)
  })
})

import { describe, expect, it } from 'vitest'

import type { ClassEntry, ClassKey, SubclassKey } from '../../src/types/index.js'
import {
  getSuggestedPactSlots,
  getSuggestedRegularSpellSlots,
} from '../../src/rules/spell-slots.js'

const entry = (
  classKey: ClassKey,
  level: number,
  subclass: SubclassKey | null = null,
): ClassEntry => ({
  classKey,
  level,
  subclass,
})

describe('getSuggestedRegularSpellSlots — C1 subclass-override class scope', () => {
  it('monk + eldritchKnight does NOT leak third-caster slots (UI 不可達 / API 可送的非法配對)', () => {
    expect(getSuggestedRegularSpellSlots([entry('monk', 5, 'eldritchKnight')])).toEqual({})
  })

  it('fighter + eldritchKnight stays third-caster (override fires)', () => {
    // fighter 主職業 'none'，subclass override → 'third'，單職走 multiclass 公式；
    // 主職向上取整 ceil(5/3) = 2 → full[1] = {1:3}，對齊 PHB 單職三階施法者表
    expect(getSuggestedRegularSpellSlots([entry('fighter', 5, 'eldritchKnight')])).toEqual({ 1: 3 })
  })

  it('rogue + arcaneTrickster stays third-caster', () => {
    expect(getSuggestedRegularSpellSlots([entry('rogue', 5, 'arcaneTrickster')])).toEqual({ 1: 3 })
  })

  it('wizard + bladesinging keeps full caster (override 不影響已 caster 的主職業)', () => {
    expect(getSuggestedRegularSpellSlots([entry('wizard', 5, 'bladesinging')])).toEqual({
      1: 4,
      2: 3,
      3: 2,
    })
  })
})

describe('getSuggestedRegularSpellSlots — C2 single-class tables', () => {
  it('single-class paladin lv5 → {1:4, 2:2}', () => {
    expect(getSuggestedRegularSpellSlots([entry('paladin', 5)])).toEqual({ 1: 4, 2: 2 })
  })

  it('single-class paladin lv1 → {} (half-caster lv1 沒環位)', () => {
    expect(getSuggestedRegularSpellSlots([entry('paladin', 1)])).toEqual({})
  })

  it('single-class wizard lv20 → full caster 上限', () => {
    expect(getSuggestedRegularSpellSlots([entry('wizard', 20)])).toEqual({
      1: 4,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
      6: 2,
      7: 2,
      8: 1,
      9: 1,
    })
  })

  it('single-class warlock lv5 → regular {} (warlock 走 pact magic)', () => {
    expect(getSuggestedRegularSpellSlots([entry('warlock', 5)])).toEqual({})
  })

  it('single-class artificer lv5 → {1:4, 2:2} (round-up half, ceil(5/2)=3 → full[3]=paladin lv5)', () => {
    expect(getSuggestedRegularSpellSlots([entry('artificer', 5)])).toEqual({ 1: 4, 2: 2 })
  })

  it('single-class artificer lv1 → {1:2} (round-up half: ceil(1/2)=1 → full lv1)', () => {
    expect(getSuggestedRegularSpellSlots([entry('artificer', 1)])).toEqual({ 1: 2 })
  })

  it('single-class artificer lv3 → {1:4, 2:2} (ceil(3/2)=2 → full lv2... wait, 應該是 effective 2 = {1:3})', () => {
    // ceil(3/2) = 2 → fullSlotsAt(2) = FULL_CASTER_SLOTS[1] = { 1: 3 }
    expect(getSuggestedRegularSpellSlots([entry('artificer', 3)])).toEqual({ 1: 3 })
  })
})

describe('getSuggestedRegularSpellSlots — C3 multiclass artificer round-up half', () => {
  it('artificer 1 + paladin 1 → effective 1 (ceil(1/2) + floor(1/2) = 1+0)', () => {
    expect(getSuggestedRegularSpellSlots([entry('artificer', 1), entry('paladin', 1)])).toEqual({
      1: 2,
    })
  })

  it('paladin 2 + ranger 2 → effective 2 (主職 ceil(2/2)=1 + 兼職 floor(2/2)=1)', () => {
    expect(getSuggestedRegularSpellSlots([entry('paladin', 2), entry('ranger', 2)])).toEqual({
      1: 3,
    })
  })

  it('artificer 3 + wizard 0 → effective 2 (走 multiclass; wizard lv0 過濾掉、剩 artificer 單筆但 active.length=1 走 single)', () => {
    // 注意：因為 wizard lv0 被 active filter 掉，single-class 路徑會被命中（artificer 單班）
    // → fullSlotsAt(ceil(3/2)) = fullSlotsAt(2) = {1:3}
    expect(getSuggestedRegularSpellSlots([entry('artificer', 3), entry('wizard', 0)])).toEqual({
      1: 3,
    })
  })

  it('artificer 4 + paladin 4 → effective 4 (ceil(4/2) + floor(4/2) = 2+2)', () => {
    expect(getSuggestedRegularSpellSlots([entry('artificer', 4), entry('paladin', 4)])).toEqual({
      1: 4,
      2: 3,
    })
  })
})

describe('getSuggestedRegularSpellSlots — C4 主職 ceil / 兼職 floor 位置取整', () => {
  it('paladin(主) 5 + wizard 5 → effective 8 (ceil(5/2)=3 + full 5)', () => {
    expect(getSuggestedRegularSpellSlots([entry('paladin', 5), entry('wizard', 5)])).toEqual({
      1: 4,
      2: 3,
      3: 3,
      4: 2,
    })
  })

  it('wizard(主) 5 + artificer 3 → effective 6 (full 5 + 兼職 floor(3/2)=1；artificer 兼職改 floor)', () => {
    expect(getSuggestedRegularSpellSlots([entry('wizard', 5), entry('artificer', 3)])).toEqual({
      1: 4,
      2: 3,
      3: 3,
    })
  })

  it('paladin(主) 5 + ranger 3 → effective 4 (ceil(5/2)=3 + floor(3/2)=1)', () => {
    expect(getSuggestedRegularSpellSlots([entry('paladin', 5), entry('ranger', 3)])).toEqual({
      1: 4,
      2: 3,
    })
  })

  it('single-class eldritchKnight lv7 → {1:4,2:2} (主職 ceil(7/3)=3，對齊 PHB 單職三階表)', () => {
    expect(getSuggestedRegularSpellSlots([entry('fighter', 7, 'eldritchKnight')])).toEqual({
      1: 4,
      2: 2,
    })
  })
})

describe('getSuggestedRegularSpellSlots — 回歸 (regression)', () => {
  it('single-class bard lv1 → {1:2}', () => {
    expect(getSuggestedRegularSpellSlots([entry('bard', 1)])).toEqual({ 1: 2 })
  })

  it('single-class sorcerer lv11 → {1:4,2:3,3:3,4:3,5:2,6:1}', () => {
    expect(getSuggestedRegularSpellSlots([entry('sorcerer', 11)])).toEqual({
      1: 4,
      2: 3,
      3: 3,
      4: 3,
      5: 2,
      6: 1,
    })
  })

  it('non-caster single (barbarian) → {}', () => {
    expect(getSuggestedRegularSpellSlots([entry('barbarian', 10)])).toEqual({})
  })

  it('empty / all-zero levels → {}', () => {
    expect(getSuggestedRegularSpellSlots([])).toEqual({})
    expect(getSuggestedRegularSpellSlots([entry('wizard', 0)])).toEqual({})
  })
})

describe('getSuggestedPactSlots', () => {
  it('warlock lv5 → {3:2}', () => {
    expect(getSuggestedPactSlots([entry('warlock', 5)])).toEqual({ 3: 2 })
  })

  it('non-warlock → {}', () => {
    expect(getSuggestedPactSlots([entry('wizard', 20)])).toEqual({})
  })

  it('warlock lv0 → {}', () => {
    expect(getSuggestedPactSlots([entry('warlock', 0)])).toEqual({})
  })
})

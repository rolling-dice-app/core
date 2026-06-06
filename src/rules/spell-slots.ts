import type {
  CharacterDTO,
  ClassEntry,
  ClassKey,
  SpellLevel,
  SpellSlots,
  SpellSlotsDelta,
  SubclassKey,
} from '../types/index.js'

type CasterCategory = 'full' | 'half' | 'half-roundUp' | 'third' | 'warlock' | 'none'

/** 各職業的施法者分類；artificer 為 round-up half-caster（Tasha errata） */
const CASTER_CATEGORY: Readonly<Record<ClassKey, CasterCategory>> = {
  bard: 'full',
  cleric: 'full',
  druid: 'full',
  sorcerer: 'full',
  wizard: 'full',
  paladin: 'half',
  ranger: 'half',
  artificer: 'half-roundUp',
  warlock: 'warlock',
  barbarian: 'none',
  fighter: 'none',
  monk: 'none',
  rogue: 'none',
}

/**
 * 子職業對施法者類別的覆寫；以 (classKey, subclass) 雙鍵索引，避免子職業 key 漏配對到非法主職業。
 * 例：`monk + eldritchKnight` 因 monk 下無 entry 而 fallback 到 monk 的 default `'none'`。
 */
const SUBCLASS_CASTER_OVERRIDE: Readonly<
  Partial<Record<ClassKey, Partial<Record<SubclassKey, CasterCategory>>>>
> = {
  fighter: { eldritchKnight: 'third' },
  rogue: { arcaneTrickster: 'third' },
}

/** 全施法者環位表：index = level (1-20)，PHB p.113-115；亦作 multiclass effective-level 表 */
const FULL_CASTER_SLOTS: readonly SpellSlots[] = [
  { 1: 2 },
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
]

/** 半施法者環位表（向下取整）：paladin / ranger，PHB p.84 / p.110 */
const HALF_CASTER_FLOOR_SLOTS: readonly SpellSlots[] = [
  {}, // lv1：尚無環位
  { 1: 2 },
  { 1: 3 },
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
]

/** Warlock pact magic 表：index = warlock level (1-20)，PHB p.107 */
const PACT_MAGIC_SLOTS: readonly { count: number; level: SpellLevel }[] = [
  { count: 1, level: 1 },
  { count: 2, level: 1 },
  { count: 2, level: 2 },
  { count: 2, level: 2 },
  { count: 2, level: 3 },
  { count: 2, level: 3 },
  { count: 2, level: 4 },
  { count: 2, level: 4 },
  { count: 2, level: 5 },
  { count: 2, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
]

/**
 * 多職 effective-level 計算時各施法者分類的等級除數；full = 1（不取整）。
 * 取整方向不在此決定，而由主職（ceil）/ 兼職（floor）位置決定。
 */
const CASTER_DIVISOR: Partial<Record<CasterCategory, number>> = {
  full: 1,
  half: 2,
  'half-roundUp': 2,
  third: 3,
}

const SPELL_LEVELS: readonly SpellLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const SLOT_MAX = 9

const fullSlotsAt = (level: number): SpellSlots => {
  if (level < 1 || level > 20) return {}
  return { ...FULL_CASTER_SLOTS[level - 1] }
}

const halfFloorSlotsAt = (level: number): SpellSlots => {
  if (level < 1 || level > 20) return {}
  return { ...HALF_CASTER_FLOOR_SLOTS[level - 1] }
}

/** Single-class caster → slot table 查詢；warlock 走 getSuggestedPactSlots，不在此表 */
const SINGLE_CLASS_SLOT_LOOKUP: Partial<Record<ClassKey, (level: number) => SpellSlots>> = {
  bard: (l) => fullSlotsAt(l),
  cleric: (l) => fullSlotsAt(l),
  druid: (l) => fullSlotsAt(l),
  sorcerer: (l) => fullSlotsAt(l),
  wizard: (l) => fullSlotsAt(l),
  paladin: (l) => halfFloorSlotsAt(l),
  ranger: (l) => halfFloorSlotsAt(l),
  artificer: (l) => fullSlotsAt(Math.ceil(l / 2)),
}

const resolveCategory = (entry: ClassEntry): CasterCategory => {
  const override =
    entry.subclass !== null ? SUBCLASS_CASTER_OVERRIDE[entry.classKey]?.[entry.subclass] : undefined
  return override ?? CASTER_CATEGORY[entry.classKey]
}

/**
 * 一般施法者建議環位。
 * Single-class caster（bard/cleric/druid/sorcerer/wizard/paladin/ranger/artificer）走專表；
 * 多 caster 混班走 effective-level 公式，逐 class 依位置取整再加總：
 * 主職業（`classes[0]`，與 hp.ts 一致）施法等級向上取整，其餘兼職向下取整，
 * full caster 除數為 1 不受取整影響。詳見 CLAUDE.md permissive interpretations catalogue。
 */
export const getSuggestedRegularSpellSlots = (classes: readonly ClassEntry[]): SpellSlots => {
  const active = classes.filter((c) => c.level > 0)

  if (active.length === 1) {
    const only = active[0]!
    const lookup = SINGLE_CLASS_SLOT_LOOKUP[only.classKey]
    if (lookup) return lookup(only.level)
    // 主職業非 caster 但 subclass 是 third-caster (EK/AT) 等情況 → 走下方 multiclass 公式
  }

  let effectiveLevel = 0
  for (const [index, entry] of classes.entries()) {
    if (entry.level <= 0) continue
    const divisor = CASTER_DIVISOR[resolveCategory(entry)]
    if (divisor === undefined) continue // warlock / none
    const fraction = entry.level / divisor
    // 主職（陣列首項）向上取整，兼職向下取整
    effectiveLevel += index === 0 ? Math.ceil(fraction) : Math.floor(fraction)
  }

  if (effectiveLevel < 1 || effectiveLevel > 20) return {}
  return { ...FULL_CASTER_SLOTS[effectiveLevel - 1] }
}

/** 契術師 pact magic 建議環位；多次契術師等級加總後查表 */
export const getSuggestedPactSlots = (classes: readonly ClassEntry[]): SpellSlots => {
  let warlockLevels = 0
  for (const entry of classes) {
    if (entry.level <= 0) continue
    if (CASTER_CATEGORY[entry.classKey] === 'warlock') warlockLevels += entry.level
  }

  if (warlockLevels < 1 || warlockLevels > 20) return {}
  const pact = PACT_MAGIC_SLOTS[warlockLevels - 1]
  if (!pact) return {}
  return { [pact.level]: pact.count }
}

/** 合併建議環位 (base) 與使用者調整 (delta)，輸出每環顯示值，clamp 至 [0, 9]；零值不留 key */
export const mergeSlots = (base: SpellSlots, delta: SpellSlotsDelta): SpellSlots => {
  const result: SpellSlots = {}
  for (const level of SPELL_LEVELS) {
    const value = (base[level] ?? 0) + (delta[level] ?? 0)
    const clamped = Math.max(0, Math.min(SLOT_MAX, value))
    if (clamped > 0) result[level] = clamped
  }
  return result
}

/** 計算角色目前最終的環位上限（regular 與 pact 分開），含使用者 delta 調整 */
export const computeSpellSlotMax = (
  character: CharacterDTO,
): { regular: SpellSlots; pact: SpellSlots } => {
  const regularBase = getSuggestedRegularSpellSlots(character.classes)
  const pactBase = getSuggestedPactSlots(character.classes)
  return {
    regular: mergeSlots(regularBase, character.spellSlotsDelta),
    pact: mergeSlots(pactBase, character.pactSlotsDelta),
  }
}

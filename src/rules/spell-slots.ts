import type {
  CharacterDTO,
  ClassEntry,
  ClassKey,
  SpellLevel,
  SpellSlots,
  SpellSlotsDelta,
  SubclassKey,
} from '../types/index.js'

type CasterCategory = 'full' | 'half' | 'third' | 'warlock' | 'none'

/** 各職業的施法者分類；artificer 為 third-caster 但向上取整 */
const CASTER_CATEGORY: Readonly<Record<ClassKey, CasterCategory>> = {
  bard: 'full',
  cleric: 'full',
  druid: 'full',
  sorcerer: 'full',
  wizard: 'full',
  paladin: 'half',
  ranger: 'half',
  artificer: 'third',
  warlock: 'warlock',
  barbarian: 'none',
  fighter: 'none',
  monk: 'none',
  rogue: 'none',
}

/** 子職業對施法者類別的覆寫；主職業 CASTER_CATEGORY 為 'none' 時才生效 */
const SUBCLASS_CASTER_OVERRIDE: Readonly<Partial<Record<SubclassKey, CasterCategory>>> = {
  eldritchKnight: 'third',
  arcaneTrickster: 'third',
}

/** 共用施法者環位表：index = effective level (1-20)，PHB p.113-115 */
const SHARED_CASTER_SLOTS: readonly SpellSlots[] = [
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

/** Warlock pact magic 表：index = warlock level (1-20)，PHB p.107 */
const WARLOCK_SLOT_TABLE: readonly { count: number; level: SpellLevel }[] = [
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

const SPELL_LEVELS: readonly SpellLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const SLOT_MAX = 9

const resolveCategory = (entry: ClassEntry): CasterCategory => {
  const base = CASTER_CATEGORY[entry.classKey]
  if (base !== 'none') return base
  if (entry.subclass === null) return 'none'
  return SUBCLASS_CASTER_OVERRIDE[entry.subclass] ?? 'none'
}

/** 一般施法者建議環位（全 / 半 / 三分之一合併計算）；artificer 向上取整，其他 third-caster 向下取整 */
export const getSuggestedRegularSpellSlots = (classes: readonly ClassEntry[]): SpellSlots => {
  let fullLevels = 0
  let halfLevels = 0
  let thirdNonArtificerLevels = 0
  let artificerLevels = 0

  for (const entry of classes) {
    if (entry.level <= 0) continue
    const category = resolveCategory(entry)
    if (category === 'full') fullLevels += entry.level
    else if (category === 'half') halfLevels += entry.level
    else if (category === 'third') {
      if (entry.classKey === 'artificer') artificerLevels += entry.level
      else thirdNonArtificerLevels += entry.level
    }
  }

  const effectiveLevel =
    fullLevels +
    Math.floor(halfLevels / 2) +
    Math.floor(thirdNonArtificerLevels / 3) +
    Math.ceil(artificerLevels / 3)

  if (effectiveLevel < 1 || effectiveLevel > 20) return {}
  return { ...SHARED_CASTER_SLOTS[effectiveLevel - 1] }
}

/** 契術師 pact magic 建議環位；多次契術師等級加總後查表 */
export const getSuggestedPactSlots = (classes: readonly ClassEntry[]): SpellSlots => {
  let warlockLevels = 0
  for (const entry of classes) {
    if (entry.level <= 0) continue
    if (CASTER_CATEGORY[entry.classKey] === 'warlock') warlockLevels += entry.level
  }

  if (warlockLevels < 1 || warlockLevels > 20) return {}
  const pact = WARLOCK_SLOT_TABLE[warlockLevels - 1]
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

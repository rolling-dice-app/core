/** 技能 key（D&D 5e 18 項標準技能） */
export const SKILL_KEYS = [
  // 力量
  'athletics', // 運動
  // 敏捷
  'acrobatics', // 特技
  'sleightOfHand', // 巧手
  'stealth', // 隱匿
  // 智力
  'arcana', // 奧秘
  'history', // 歷史
  'investigation', // 調查
  'nature', // 自然
  'religion', // 宗教
  // 感知
  'animalHandling', // 馴獸
  'insight', // 洞察
  'medicine', // 醫藥
  'perception', // 察覺
  'survival', // 求生
  // 魅力
  'deception', // 欺瞞
  'intimidation', // 威嚇
  'performance', // 表演
  'persuasion', // 說服
] as const

/** 技能 key（D&D 5e 18 項標準技能） */
export type SkillKey = (typeof SKILL_KEYS)[number]

/** 熟練等級：無熟練、熟練、專精 */
export type ProficiencyLevel =
  | 'none' // 無熟練
  | 'proficient' // 熟練
  | 'expertise' // 專精（加值翻倍）

/** wire 上實際出現的熟練值（'none' 以 key 不存在表示，不入 wire） */
export const SKILL_PROFICIENCY_VALUES = ['proficient', 'expertise'] as const

/** 角色技能熟練度，僅記錄有熟練或專精的技能；'none' 以 key 不存在表示 */
export type SkillProficiencies = Partial<
  Record<SkillKey, (typeof SKILL_PROFICIENCY_VALUES)[number]>
>

/** 道德軸（善 / 中立 / 惡） */
export type MoralityKey = 'good' | 'neutral' | 'evil'

/** 秩序軸（守序 / 中立 / 混亂） */
export type OrderKey = 'lawful' | 'neutral' | 'chaotic'

/** 九宮格陣營 */
export type AlignmentKey =
  | 'lawfulGood'
  | 'neutralGood'
  | 'chaoticGood'
  | 'lawfulNeutral'
  | 'trueNeutral'
  | 'chaoticNeutral'
  | 'lawfulEvil'
  | 'neutralEvil'
  | 'chaoticEvil'

import type { AbilityKey } from '../dnd/ability-key.js'
import type { DamageDieType } from '../dnd/dice.js'
import type { ArmorType, DamageTypeKey } from '../dnd/misc.js'

/** 護甲等級設定 */
export interface ArmorClassConfig {
  /** 護甲類型（null 表示尚未選擇） */
  type: ArmorType | null
  /** 護甲基礎值（使用者自定義，如皮甲 11、鎖甲 16） */
  value: number | null
  /** 額外屬性調整值所使用的屬性鍵（使用者從六種屬性自選，null 表示無） */
  abilityKey: AbilityKey | null
  /** 盾牌加值（預設 0） */
  shieldValue: number
}

/** 單行傷害條目（攻擊內可有多行不同骰面 / 類型 / 加值） */
export interface DamageDieEntry {
  /** 行內穩定識別 */
  id: string
  /** 骰面（null 表未指定；count > 0 但 dieType 為 null 時不渲染骰部分） */
  dieType: DamageDieType | null
  /** 骰數（>= 0；count = 0 + bonus !== 0 表示純定額傷害，例如「10 酸蝕」） */
  count: number
  /** 此行的加值（null 或 0 不顯示；可為負數） */
  bonus: number | null
  /** 傷害類型（null 表未指定） */
  damageType: DamageTypeKey | null
}

/** 自訂攻擊項目 */
export interface AttackEntry {
  /** 唯一識別 */
  id: string
  /** 攻擊名稱 */
  name: string
  /** 命中使用的屬性（null 表示未選擇） */
  abilityKey: AbilityKey | null
  /** 傷害條目（可有多行，例如 1d8+5 劈砍 + 4d8 光耀） */
  damageDice: DamageDieEntry[]
  /** 額外命中加值（疊加於屬性調整值 + 熟練加值之上） */
  extraHitBonus: number | null
  /** 是否將屬性調整值加入第一行傷害（預設 true；false 用於額外傷害類型不吃屬性 mod 的情境） */
  applyAbilityToDamage: boolean
  /** 攻擊模組的補充說明（觸發條件、附加效果、備註等；未填以 null 表示） */
  comment: string | null
}

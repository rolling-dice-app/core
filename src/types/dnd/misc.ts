/** 體型：D&D 尺寸分類，從超微型到龐大型 */
export type SizeKey =
  | 'tiny' // 微型
  | 'small' // 小型
  | 'medium' // 中型
  | 'large' // 大型
  | 'huge' // 超大型
  | 'gargantuan' // 巨型

/** 性別 */
export type GenderKey =
  | 'male' // 男性
  | 'female' // 女性
  | 'nonBinary' // 非二元

/** 護甲類型 */
export type ArmorType = 'light' | 'medium' | 'heavy' | 'none'

/** 武器類型 */
export type WeaponType = 'simple' | 'martial'

/** 一般骰面 */
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

/** 傷害骰可用骰面（不含 d20、d100） */
export type DamageDieType = Extract<DieType, 'd4' | 'd6' | 'd8' | 'd10' | 'd12'>

/** D&D 5e 13 種傷害類型 */
export type DamageTypeKey =
  | 'bludgeoning' // 鈍擊
  | 'piercing' // 穿刺
  | 'slashing' // 劈砍
  | 'acid' // 酸蝕
  | 'cold' // 寒冰
  | 'fire' // 火焰
  | 'lightning' // 閃電
  | 'thunder' // 雷鳴
  | 'poison' // 毒素
  | 'force' // 力場
  | 'necrotic' // 暗蝕
  | 'radiant' // 光耀
  | 'psychic' // 心靈

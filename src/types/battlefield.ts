import type { DamageDieEntry } from './character/attack.js'
import type { DeathSaves } from './combat.js'
import type { ClassEntry } from './dnd/class.js'
import type { ConditionKey } from './dnd/condition.js'

/** 戰場單位種類；character = 角色卡快照、monster = 怪物模板實例、adhoc = 手動臨時單位 */
export type BattlefieldUnitKind = 'character' | 'monster' | 'adhoc'

/** 戰場單位陣營（友軍／敵人／中立） */
export type BattlefieldFaction = 'player' | 'enemy' | 'neutral'

/** 戰場單位狀態條目；MVP 僅 id / key / note，來源與剩餘回合延後 */
export interface BattlefieldCondition {
  /** 行內穩定識別（client 生成，比照 MonsterAttackEntry） */
  id: string
  /** 狀態 key（core 既有 15 種 ConditionKey） */
  key: ConditionKey
  /** 狀態備注，字數上限 CHARACTER_TEXT_LIMITS.SHORT；未填為 null */
  note: string | null
}

/** 戰場單位攻擊快照條目；命中為 flat 總值（角色快照時已含屬性/熟練攤平、怪物從模板原樣搬），傷害復用 DamageDieEntry，供前端自動擲骰取數 */
export interface BattlefieldAttackEntry {
  /** 行內穩定識別（client 生成，比照 MonsterAttackEntry） */
  id: string
  /** 攻擊名稱，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  name: string
  /** 命中加值（flat 總值），絕對值上限 BATTLEFIELD_LIMITS.UNIT_ATTACK_HIT_BONUS_ABS_MAX */
  hitBonus: number
  /** 傷害條目；行數上限 VALIDATION_LIMITS.maxDamageDicePerAttack */
  damageDice: DamageDieEntry[]
  /** 補充說明（觸發條件、附加效果等），字數上限 CHARACTER_TEXT_LIMITS.SHORT；未填以 null 表示 */
  comment: string | null
}

/** 戰場單位 HP 子結構；欄位語意比照 CombatHp，惟 current 非 null（單位建立即滿血，無「未開始追蹤」狀態） */
export interface BattlefieldUnitHp {
  /** 目前生命值，範圍 0..BATTLEFIELD_LIMITS.UNIT_HP_MAX */
  current: number
  /** 臨時生命值，受傷時優先扣；範圍 0..BATTLEFIELD_LIMITS.UNIT_HP_MAX */
  tempHp: number
  /** 最大生命臨時調整（疊加於 maxHp 快照），絕對值上限 BATTLEFIELD_LIMITS.UNIT_HP_MAX_ADJUSTMENT_ABS_MAX */
  maxAdjustment: number
}

/**
 * 戰場參戰單位（JSONB 內嵌條目，非獨立資源）。加入戰場時把角色卡／怪物模板
 * 計算完成的值快照為基準（maxHp / ac / 速度），之後與來源互不同步、不回寫；
 * 戰鬥中的變動比照 combat-state 設計走調整值欄位（hp.maxAdjustment /
 * acAdjustment），有效值由前端計算，backend 不參與數值計算，
 * 只驗形狀與防爆 caps，不驗跨欄位遊戲不變量。
 */
export interface BattlefieldUnit {
  /** 行內穩定識別（client 生成，比照 MonsterAttackEntry） */
  id: string
  /** 單位種類 */
  kind: BattlefieldUnitKind
  /** 角色單位回溯 share 來源（≤ 64）；monster / adhoc 為 null */
  shareId: string | null
  /** 怪物實例回溯模板來源（≤ 64）；character / adhoc 為 null */
  templateId: string | null
  /** 陣營 */
  faction: BattlefieldFaction
  /** 名稱，字數上限 CHARACTER_TEXT_LIMITS.SHORT（不可降為 TINY — 帶入成員時快照角色名，上限必須 ≥ 角色名 cap） */
  name: string
  /** 怪物快照挑戰等級原始值（自由字串，如 "1/2"、"5"；顯示格式化交給 UI），字數上限 CHARACTER_TEXT_LIMITS.SHORT；character / adhoc 為 null */
  challengeRating: string | null
  /** character 快照種族，字數上限 CHARACTER_TEXT_LIMITS.SHORT；其他 kind 為 null */
  race: string | null
  /** character 快照職業列表；其他 kind 為空陣列 */
  classes: ClassEntry[]
  /** 快照基準最大 HP，範圍 BATTLEFIELD_LIMITS.UNIT_HP_MIN..UNIT_HP_MAX */
  maxHp: number
  /** HP 變動值（當前／臨時／最大調整） */
  hp: BattlefieldUnitHp
  /** 死亡豁免計數；前端僅於 HP 0 時顯示／計數（比照 combat：HP ≥ 1 歸零） */
  deathSaves: DeathSaves
  /** 快照基準 AC，範圍 0..BATTLEFIELD_LIMITS.UNIT_AC_MAX */
  ac: number
  /** AC 臨時調整（疊加於 ac 快照），絕對值上限 BATTLEFIELD_LIMITS.UNIT_AC_ADJUSTMENT_ABS_MAX */
  acAdjustment: number
  /** 速度（自由文字，可編輯），字數上限 CHARACTER_TEXT_LIMITS.SHORT；角色快照時前端寫入計算值文字、怪物從模板 speed 原樣搬（如 "30 ft., fly 60 ft."）、adhoc 手填；未填為 null */
  speed: string | null
  /** 攻擊快照；長度 ≤ VALIDATION_LIMITS.maxAttacksPerBattlefieldUnit；角色／怪物加入時由來源快照，adhoc 為空陣列起步 */
  attacks: BattlefieldAttackEntry[]
  /** 先攻加值，絕對值上限 BATTLEFIELD_LIMITS.UNIT_INITIATIVE_BONUS_ABS_MAX */
  initiativeBonus: number
  /** 先攻值，絕對值上限 BATTLEFIELD_LIMITS.UNIT_INITIATIVE_ABS_MAX；未擲為 null */
  initiative: number | null
  /** 先攻軌顯示順序（0..BATTLEFIELD_LIMITS.UNIT_SORT_ORDER_MAX）；擲骰後自動重排，拖曳為手動覆蓋 */
  sortOrder: number
  /** 狀態列表；長度 ≤ VALIDATION_LIMITS.maxConditionsPerBattlefieldUnit */
  conditions: BattlefieldCondition[]
  /** 是否在本場戰鬥出場 */
  inCombat: boolean
}

/**
 * 即時戰場；依附團務紀錄（session），一劇本（container）同時至多一戰場。
 * CombatPhase 採內聯欄位（battleSequence / round / activeUnitId / inProgress），不落獨立實體。
 */
export interface BattlefieldDTO {
  /** 唯一識別 */
  id: string
  /** 所屬團務紀錄 id；create 後不可改 */
  sessionId: string
  /** 所屬團務容器 id；server 從 session 推導的唯讀衍生欄位，不可經 body 寫入（前端靠它打 session log GET 取出席成員） */
  containerId: string
  /** 同一戰場的第幾場戰鬥，範圍 BATTLEFIELD_LIMITS.BATTLE_SEQUENCE_MIN..BATTLE_SEQUENCE_MAX */
  battleSequence: number
  /** 目前輪次，範圍 BATTLEFIELD_LIMITS.ROUND_MIN..ROUND_MAX */
  round: number
  /** 目前行動單位的 unit id（client 生成、≤ 64，非 uuid）；無為 null */
  activeUnitId: string | null
  /** false = 本場戰鬥已結束、尚未開下一場 */
  inProgress: boolean
  /** 參戰單位；長度 ≤ VALIDATION_LIMITS.maxUnitsPerBattlefield，寫入採整列 replace */
  units: BattlefieldUnit[]
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/**
 * 戰場入口頁的團務選項投影；battlefieldId 有值表示該團務已有戰場（1 團務至多 1 戰場）。
 * 排序沿用 m7.2 契約序：container createdAt 降冪 → session date 升冪、同日 createdAt 升冪。
 */
export interface BattlefieldSessionOption {
  /** 團務紀錄 id */
  sessionId: string
  /** 所屬容器 id；前端以此分組判斷「劇本已有戰場 → 停用同劇本其他團務的建立」 */
  containerId: string
  /** 容器標題（劇本／團名） */
  containerTitle: string
  /** 團務紀錄標題 */
  sessionTitle: string
  /** 團務日期，YYYY-MM-DD（無時間） */
  date: string
  /** 出席名單人數 */
  memberCount: number
  /** 該團務已建立的戰場 id；無為 null */
  battlefieldId: string | null
}

/** POST /battlefields body；僅 sessionId，其餘由 buildBattlefieldCreateDefaults 補、containerId 由 server 從 session 推導（不收 client 值） */
export type BattlefieldCreateBody = Pick<BattlefieldDTO, 'sessionId'>

/** PATCH /battlefields/:id body；updatedAt 樂觀鎖必填、其餘可選；units 採整列 replace */
export type BattlefieldUpdateBody = Pick<BattlefieldDTO, 'updatedAt'> &
  Partial<
    Pick<BattlefieldDTO, 'battleSequence' | 'round' | 'activeUnitId' | 'inProgress' | 'units'>
  >

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

/**
 * 戰場參戰單位（JSONB 內嵌條目，非獨立資源）；絕對值快照模型 — 加入戰場時把
 * 角色卡／怪物模板計算完成的絕對值快照進來，之後與來源互不同步、不回寫。
 * 快照數學為前端權威；backend 只驗形狀與防爆 caps，不驗跨欄位遊戲不變量。
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
  /** 顯示用補充（monster CR 描述／adhoc 說明），字數上限 CHARACTER_TEXT_LIMITS.SHORT；character 恆空字串 */
  title: string
  /** character 快照種族，字數上限 CHARACTER_TEXT_LIMITS.SHORT；其他 kind 為 null */
  race: string | null
  /** character 快照職業列表；其他 kind 為空陣列 */
  classes: ClassEntry[]
  /** 最大 HP，範圍 BATTLEFIELD_LIMITS.UNIT_HP_MIN..UNIT_HP_MAX */
  maxHp: number
  /** 快照當下的最大 HP；「結束戰鬥不保留其他調整值」時的重置基準，範圍同 maxHp */
  baseMaxHp: number
  /** 目前 HP，範圍 0..BATTLEFIELD_LIMITS.UNIT_HP_MAX */
  currentHp: number
  /** 臨時 HP，範圍 0..BATTLEFIELD_LIMITS.UNIT_HP_MAX */
  tempHp: number
  /** 快照當下的 AC；重置基準，範圍 0..BATTLEFIELD_LIMITS.UNIT_AC_MAX */
  baseAc: number
  /** 目前 AC，範圍 0..BATTLEFIELD_LIMITS.UNIT_AC_MAX */
  currentAc: number
  /** 速度雙欄之一：角色單位存前端計算後數值（呎，0..BATTLEFIELD_LIMITS.UNIT_SPEED_VALUE_MAX）；怪物／無值為 null */
  speedValue: number | null
  /** 速度雙欄之二：怪物單位保留模板 speed 字串原樣（如 "30 ft., fly 60 ft."），字數上限 CHARACTER_TEXT_LIMITS.SHORT；角色／無值為 null */
  speedText: string | null
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

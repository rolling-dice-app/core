import type { CurrencyAmount } from './character/currency.js'
import type { DmSessionMemberDTO, DmSessionMemberInput } from './dm-session-container.js'

/** 物品獎勵條目；item 為物品內容、player 為受領玩家名（純文字，未指定留空字串） */
export interface DmSessionLogItemReward {
  /** 行內穩定識別（client 生成，比照 MonsterAttackEntry） */
  id: string
  /** 物品內容，字數上限 CHARACTER_TEXT_LIMITS.ITEM */
  item: string
  /** 受領玩家名稱，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  player: string
  /** 獎勵備注，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  remark: string
}

/** DM 團務紀錄；DmSessionContainer 的 sub-resource，經 container 關聯 owner（不直掛 user id）。無 restore，故不含 restoredAt */
export interface DmSessionLogDTO {
  /** 唯一識別 */
  id: string
  /** 所屬團務容器 id；ownership 經 container.userId 推導 */
  containerId: string
  /** 標題，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  title: string
  /** 團務日期，YYYY-MM-DD（無時間） */
  date: string
  /** 筆記內文，字數上限 CHARACTER_TEXT_LIMITS.HUGE */
  content: string
  /** 本場出席名單（讀取形）；container.members 為常駐名單，本欄記當場實際出席；長度 ≤ VALIDATION_LIMITS.maxMembersPerDmSessionLog。寫入請見 create / update body 的 members（DmSessionMemberInput 陣列） */
  members: DmSessionMemberDTO[]
  /** 本場發出的金錢獎勵；純紀錄，不接任何 character currency */
  moneyRewards: CurrencyAmount
  /** 本場發出的經驗值獎勵，絕對值上限 CHARACTER_INT_LIMITS.LARGE_INT_MAX */
  expRewards: number
  /** 本場發出的物品獎勵；長度 ≤ VALIDATION_LIMITS.maxItemRewardsPerDmSessionLog */
  itemRewards: DmSessionLogItemReward[]
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** 團務紀錄輕量條目；container.sessions 與列表共用，不含 members / content 等重欄位 */
export interface DmSessionLogSummaryDTO {
  id: string
  title: string
  date: string
}

/** POST /dm-session-containers/:containerId/session-logs body；title / date 必填（date 由 client 預填，defaults 不碰時間），其餘缺漏由 buildDmSessionLogCreateDefaults 補 */
export type DmSessionLogCreateBody = Pick<DmSessionLogDTO, 'title' | 'date'> &
  Partial<Pick<DmSessionLogDTO, 'content' | 'moneyRewards' | 'expRewards' | 'itemRewards'>> &
  Partial<{ members: DmSessionMemberInput[] }>

/**
 * PATCH /dm-session-containers/:containerId/session-logs/:logId body；updatedAt 樂觀鎖必填、其餘可選。
 * members 採整列 replace，型別為寫入形 DmSessionMemberInput[]（非讀取形 DmSessionMemberDTO[]）。
 */
export type DmSessionLogUpdateBody = Pick<DmSessionLogDTO, 'updatedAt'> &
  Partial<
    Pick<
      DmSessionLogDTO,
      'title' | 'date' | 'content' | 'moneyRewards' | 'expRewards' | 'itemRewards'
    >
  > &
  Partial<{ members: DmSessionMemberInput[] }>

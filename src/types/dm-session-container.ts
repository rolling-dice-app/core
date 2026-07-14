import type { SharedCharacterPreviewDTO } from './character/share.js'
import type { DmSessionLogSummaryDTO } from './dm-session-log.js'

/** 團務成員條目（讀取形）；container 常駐名單與 session 出席名單共用。playerName 純文字，character 由 shareId hydrate（失效 available=false），未連結為 null */
export interface DmSessionMemberDTO {
  /** 行內穩定識別（client 生成，比照 MonsterAttackEntry） */
  id: string
  /** 玩家名稱（PL），字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  playerName: string
  /** 連結的角色卡（PC）預覽；寫入用 shareId（見 DmSessionMemberInput），server hydrate；未連結為 null */
  character: SharedCharacterPreviewDTO | null
}

/** 團務成員條目（寫入形）；characterShareId 為 chs_… shareId 或 null，server 端驗證有效性 */
export interface DmSessionMemberInput {
  id: string
  playerName: string
  characterShareId: string | null
}

/** DM 團務容器；owner-scoped 頂層資源，聚合同一劇本 / 玩家群體的多場團務紀錄（不同群體開不同 container）。無 restore，故不含 restoredAt */
export interface DmSessionContainerDTO {
  /** 唯一識別 */
  id: string
  /** 擁有者（DM）的 user id */
  userId: string
  /** 標題（劇本 / 團名），字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  title: string
  /** 常駐成員名單（讀取形）；各場實際出席另記於 session.members；長度 ≤ VALIDATION_LIMITS.maxMembersPerDmSessionContainer。寫入請見 create / update body 的 members（DmSessionMemberInput 陣列） */
  members: DmSessionMemberDTO[]
  /** 備註（劇本概要、house rules、進度備忘等），字數上限 CHARACTER_TEXT_LIMITS.LONG */
  remark: string
  /** 旗下團務紀錄輕量條目；server 帶出的唯讀衍生欄位，增刪走 session-log sub-endpoint，不可經 container body 寫入。排序依 date 升冪、同日依 createdAt 升冪（跑團時序） */
  sessions: DmSessionLogSummaryDTO[]
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** 團務容器列表 payload；輕量子集 */
export interface DmSessionContainerSummaryDTO {
  id: string
  title: string
  members: Pick<DmSessionMemberDTO, 'playerName'>[]
  nextSession: DmSessionLogSummaryDTO | null
  createdAt: string
}

/** POST /dm-session-containers body；title 必填，其餘缺漏由 buildDmSessionContainerCreateDefaults 補 */
export type DmSessionContainerCreateBody = Pick<DmSessionContainerDTO, 'title'> &
  Partial<Pick<DmSessionContainerDTO, 'remark'>> &
  Partial<{ members: DmSessionMemberInput[] }>

/**
 * PATCH /dm-session-containers/:id body；updatedAt 樂觀鎖必填、其餘可選。
 * members 採整列 replace，型別為寫入形 DmSessionMemberInput[]（非讀取形 DmSessionMemberDTO[]）。
 */
export type DmSessionContainerUpdateBody = Pick<DmSessionContainerDTO, 'updatedAt'> &
  Partial<Pick<DmSessionContainerDTO, 'title' | 'remark'>> &
  Partial<{ members: DmSessionMemberInput[] }>

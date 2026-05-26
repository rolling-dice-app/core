import type { CurrencyAmount } from './currency.js'
import type { SharedCharacterPreviewDTO } from './share.js'

/** 角色戰役紀錄；sub-endpoint 的唯一 wire shape */
export interface CampaignRecordDTO {
  id: string
  characterId: string
  /** 主標題，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  title: string
  /** 副標題，字數上限 CHARACTER_TEXT_LIMITS.SHORT */
  subtitle: string | null
  /** 內文，字數上限 VALIDATION_LIMITS.maxCampaignRecordContentLength */
  content: string
  /** 發生日期，YYYY-MM-DD（無時間） */
  date: string
  /** 隊友名單（讀取形）；以 shareId 引用 shareable 角色卡，server hydrate 成預覽。長度 ≤ VALIDATION_LIMITS.maxTeammatesPerCampaignRecord。寫入請見 CampaignRecordCreateBody.teammates（shareId 陣列） */
  teammates: SharedCharacterPreviewDTO[]
  /** 本場獲得的金錢；是否同步累加到 character currency 由 user.preference.applyMoneyToCurrency 決定 */
  moneyEarning: CurrencyAmount
  /** 本場獲得的經驗值，絕對值上限 CHARACTER_INT_LIMITS.LARGE_INT_MAX */
  expEarning: number
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** POST /characters/:id/campaign-records body；characterId / 時間戳由 server 賦值 */
export interface CampaignRecordCreateBody {
  title: string
  subtitle: string | null
  content: string
  date: string
  /** 隊友 shareId 陣列（指向 shareable 角色卡）；預設空陣列，非 nullable。每筆須為合法 shareId 且 server 端再驗證有效性 */
  teammates: string[]
  moneyEarning: CurrencyAmount
  expEarning: number
}

/**
 * PATCH /characters/:id/campaign-records/:recordId body；updatedAt 樂觀鎖必填、其餘可選。
 * teammates 採整列 replace，型別為 shareId 陣列（與 CreateBody 一致，非讀取形 SharedCharacterPreviewDTO[]）。
 */
export type CampaignRecordUpdateBody = Pick<CampaignRecordDTO, 'updatedAt'> &
  Partial<
    Pick<
      CampaignRecordDTO,
      'title' | 'subtitle' | 'content' | 'date' | 'moneyEarning' | 'expEarning'
    >
  > &
  Partial<{ teammates: string[] }>

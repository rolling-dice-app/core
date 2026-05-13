import type { CurrencyAmount } from './currency.js'

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
  /** 隊友名單；MVP 純人名（每筆 ≤ CHARACTER_TEXT_LIMITS.SHORT、長度 ≤ VALIDATION_LIMITS.maxTeammatesPerCampaignRecord），未來升級為 cross-user character link */
  teammates: string[]
  /** 本場獲得的金錢；是否同步累加到 character currency 由 create 時的 applyMoneyToCurrency 旗標決定 */
  moneyEarning: CurrencyAmount
  /** 本場獲得的經驗值，絕對值上限 CHARACTER_INT_LIMITS.LARGE_INT_MAX */
  expEarning: number
  /**
   * 預留排序欄位；MVP 仍照 createdAt 排序
   * @deprecated 下個 major 版本移除，請改以 createdAt 排序
   */
  sortOrder: number
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** POST /characters/:id/campaign-records body；characterId / sortOrder / 時間戳由 server 賦值 */
export interface CampaignRecordCreateBody {
  title: string
  subtitle: string | null
  content: string
  date: string
  /** 預設空陣列，非 nullable */
  teammates: string[]
  moneyEarning: CurrencyAmount
  expEarning: number
  /** server-side 旗標：true 時同 tx 把 moneyEarning 累加到角色 currency；只在 create 時生效，update 不接受 */
  applyMoneyToCurrency: boolean
}

/** PATCH /characters/:id/campaign-records/:recordId body；updatedAt 樂觀鎖必填、其餘可選。teammates 採整列 replace */
export type CampaignRecordUpdateBody = Pick<CampaignRecordDTO, 'updatedAt'> &
  Partial<
    Pick<
      CampaignRecordDTO,
      'title' | 'subtitle' | 'content' | 'date' | 'teammates' | 'moneyEarning' | 'expEarning'
    >
  >

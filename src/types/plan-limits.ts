/**
 * 方案相關上限；shape 共用、values 由 backend 拍板，
 * 透過 /auth/me 回應送給前端做 UI 阻擋。
 * 前端不應 hardcode、也不應 import 任何 *_PLAN_LIMITS const。
 */
export interface PlanLimits {
  /** 總角色卡 row 上限（active + soft-deleted） */
  maxCharacters: number
  /** 顯示中（未刪除）的角色卡上限 */
  maxActiveCharacters: number
  /** 每張卡冒險紀錄上限 */
  maxCampaignRecordsPerCharacter: number
  /** 怪物模板上限（計未刪除列；無 restore，不拆 active/total） */
  maxMonsterTemplates: number
  /** 團務容器上限（計未刪除列；無 restore，不拆 active/total） */
  maxDmSessionContainers: number
  /** 每個團務容器旗下的團務紀錄上限 */
  maxDmSessionLogsPerContainer: number
}

import type { PlanLimits } from './plan-limits.js'

/** 跨 frontend / backend 共用的使用者公開資料 sub-shape */
export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  /** ISO 8601 時間字串 */
  createdAt: string
}

/** GET /auth/me 回應；user 與 limits 並列 */
export interface MeResponseDTO {
  user: User
  limits: PlanLimits
}

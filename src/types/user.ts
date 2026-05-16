import type { PlanLimits } from './plan-limits.js'

/** 使用者偏好設定 sub-shape；新增 union member 為 minor，移除為 major */
export interface UserPreference {
  /** 角色列表佈局 */
  characterListLayout: 'grid' | 'list'
  /** 新增 campaign record 時是否同步把 moneyEarning 累加到角色 currency；缺欄位視為 true */
  applyMoneyToCurrency?: boolean
}

/** 跨 frontend / backend 共用的使用者公開資料 sub-shape */
export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  preference: UserPreference
  /** ISO 8601 時間字串 */
  createdAt: string
  /** ISO 8601 時間字串；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** 編輯 user profile 時 client 提交的 patch payload；附 updatedAt 樂觀鎖 */
export interface UserProfileUpdateDTO {
  displayName?: string
  preference?: UserPreference
  /** 樂觀鎖；client 必須帶上目前 GET 拿到的 updatedAt */
  updatedAt: string
}

/**
 * 更新 avatar 的 payload；avatarUrl = null 表示清除
 * @deprecated 由 POST/DELETE /users/me/avatar 取代；待下次 core major 一併移除
 */
export interface UserAvatarUpdateDTO {
  avatarUrl: string | null
  /** 樂觀鎖；client 必須帶上目前 GET 拿到的 updatedAt */
  updatedAt: string
}

/** GET /auth/me 回應；user 與 limits 並列 */
export interface MeResponseDTO {
  user: User
  limits: PlanLimits
}

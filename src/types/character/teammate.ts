/**
 * 戰役紀錄隊友的公開預覽。teammates 以「shareable 角色卡的 shareId」為引用儲存，
 * 後端讀取時 hydrate 成此形：available=true 帶完整預覽，失效（owner 關了分享 / 刪了角色）
 * 則 available=false、name/avatar/ownerDisplayName 皆為 null，但仍保留 shareId 供前端
 * 顯示「已不再分享」標註。分享連結由前端依 shareId 自組（與其餘 share 介面一致）。
 */
export interface TeammatePreviewDTO {
  /** 被連結角色卡的 shareId（chs_…）；含失效者亦回傳，前端據此組分享連結與識別 */
  shareId: string
  /** 該 shareId 目前是否仍指向有效（存在 + shareable + 未軟刪）的角色卡 */
  available: boolean
  /** 僅 available=true 時有值 */
  name: string | null
  /** 僅 available=true 時有值 */
  avatar: string | null
  /** 僅 available=true 時有值 */
  ownerDisplayName: string | null
}

/** POST /share/characters/validate-teammates body；送出整組 campaign 前批次驗證 shareId */
export interface ValidateTeammatesBody {
  shareIds: string[]
}

/** validate-teammates 回應；順序與輸入一致，前端以 every(t => t.available) 作為送出 gate 並 prefill 預覽 */
export interface ValidateTeammatesResponse {
  teammates: TeammatePreviewDTO[]
}

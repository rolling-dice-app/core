/** 角色持有金錢；sub-endpoint 的唯一 wire shape */
export interface CharacterCurrencyDTO {
  cp: number
  sp: number
  gp: number
  pp: number
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** PATCH /characters/:id/currency body；updatedAt 樂觀鎖必填、其餘可選 */
export type CharacterCurrencyUpdateBody = Pick<CharacterCurrencyDTO, 'updatedAt'> & {
  cp?: number
  sp?: number
  gp?: number
  pp?: number
}

/** 物品類型 */
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'other'

/** 物品存放位置：一般背包或次元袋（不計入負重） */
export type InventoryLocation = 'backpack' | 'dimensionalBag'

/** 背包物品條目；sub-endpoint 的唯一 wire shape */
export interface InventoryItemDTO {
  id: string
  name: string
  description: string | null
  /** 數量（整數） */
  quantity: number
  /** 每件重量（磅，可為小數） */
  weight: number
  type: ItemType
  location: InventoryLocation
  /** 是否被同調（受 computeAttunedLimit 上限規範） */
  isAttuned: boolean
  /** 建立時間，ISO 8601 ms 精度 */
  createdAt: string
  /** 最後更新時間，ISO 8601 ms 精度；同時作為 PATCH concurrency token */
  updatedAt: string
}

/** POST /characters/:id/inventory/items body；isAttuned 由 server 強制 false、不接受 client 提供 */
export type InventoryItemCreateBody = Omit<
  InventoryItemDTO,
  'id' | 'createdAt' | 'updatedAt' | 'isAttuned'
>

/** PATCH /characters/:id/inventory/items/:itemId body；updatedAt 樂觀鎖必填、其餘可選 */
export type InventoryItemUpdateBody = Pick<InventoryItemDTO, 'updatedAt'> &
  Partial<Omit<InventoryItemDTO, 'id' | 'createdAt' | 'updatedAt'>>

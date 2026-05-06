/** 物品類型 */
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'other'

/** 物品存放位置：一般背包或次元袋（不計入負重） */
export type InventoryLocation = 'backpack' | 'dimensionalBag'

/** 背包物品條目 */
export interface InventoryItem {
  id: string
  name: string
  description: string | null
  /** 數量（整數） */
  quantity: number
  /** 每件重量（磅，可為小數） */
  weight: number
  type: ItemType
  location: InventoryLocation
  /** 是否被同調（最多 3 件物品可同時為 true） */
  isAttuned: boolean
}

/** 角色持有金錢 */
export interface CharacterCurrency {
  cp: number
  sp: number
  gp: number
  pp: number
}

/** 角色背包與金錢 */
export interface CharacterInventory {
  items: InventoryItem[]
  currency: CharacterCurrency
}

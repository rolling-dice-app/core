import type { DmSessionLogDTO } from '../types/dm-session-log.js'
import { DEFAULT_CURRENCY } from './character.js'

/** 新建團務紀錄時 client 未帶欄位的初始值；backend POST handler 以 body 覆蓋此結果。title / date 為 create 必填、id / containerId / 時間戳 由 backend row state 帶出，不屬 defaults */
export const buildDmSessionLogCreateDefaults = (): Omit<
  DmSessionLogDTO,
  'title' | 'date' | 'id' | 'containerId' | 'createdAt' | 'updatedAt'
> => ({
  content: '',
  members: [],
  moneyRewards: { ...DEFAULT_CURRENCY },
  expRewards: 0,
  itemRewards: [],
})

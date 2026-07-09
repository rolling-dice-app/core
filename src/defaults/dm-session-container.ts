import type { DmSessionContainerDTO } from '../types/dm-session-container.js'

/** 新建團務容器時 client 未帶欄位的初始值；backend POST handler 以 body 覆蓋此結果。title 為 create 必填、id / userId / 時間戳由 backend row state 帶出、sessions 為唯讀衍生欄位，皆不屬 defaults */
export const buildDmSessionContainerCreateDefaults = (): Omit<
  DmSessionContainerDTO,
  'title' | 'id' | 'userId' | 'sessions' | 'createdAt' | 'updatedAt'
> => ({
  members: [],
  remark: '',
})

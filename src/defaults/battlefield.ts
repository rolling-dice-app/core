import type { BattlefieldDTO } from '../types/battlefield.js'

/** 新建戰場時 client 未帶欄位的初始值；sessionId 為 create 必填、id / containerId / 時間戳由 backend row state 帶出，不屬 defaults */
export const buildBattlefieldCreateDefaults = (): Omit<
  BattlefieldDTO,
  'sessionId' | 'id' | 'containerId' | 'createdAt' | 'updatedAt'
> => ({
  battleSequence: 1,
  round: 1,
  activeUnitId: null,
  inProgress: true,
  units: [],
})

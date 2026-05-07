// TODO(naming): API 契約型別應加 DTO 後綴，但 Character / CombatState 因為內部結構
// 大概率會隨開發調整，等實際動到那兩個區塊時再一起 rename：
//   Character    -> CharacterDTO
//   CombatState  -> CombatStateDTO
// 規則：只有「直接做為 HTTP request/response top-level shape」的型別才加 DTO 後綴；
// AbilityScoreEntry / ArmorClassConfig / SpellLevel 等 rule / sub-shape 不加。
export * from './auth.js'
export * from './character/index.js'
export * from './combat.js'
export * from './dnd/index.js'
export * from './plan-limits.js'
export * from './spell.js'
export * from './user.js'

import type { AbilityKey } from './ability-key.js'

/** 職業 key（D&D 5e 13 項標準 class） */
export type ClassKey =
  | 'artificer' // 奇械師
  | 'barbarian' // 野蠻人
  | 'bard' // 吟遊詩人
  | 'cleric' // 牧師
  | 'druid' // 德魯伊
  | 'fighter' // 戰士
  | 'monk' // 武僧
  | 'paladin' // 聖騎士
  | 'ranger' // 游俠
  | 'rogue' // 遊蕩者
  | 'sorcerer' // 術士
  | 'warlock' // 契術師
  | 'wizard' // 魔法師

/**
 * 子職業 key（subclass；PHB / Xanathar's / Tasha's 全部官方子職業；
 * wildMagicSorcerer 為避免與野蠻人 wildMagic 衝突而改名）
 */
export type SubclassKey =
  // Barbarian
  | 'berserker'
  | 'totemWarrior'
  | 'ancestralGuardian'
  | 'stormHerald'
  | 'zealot'
  | 'beast'
  | 'battlerager'
  | 'wildMagic'
  | 'giant'
  | 'Juggernaut'
  // Bard
  | 'lore'
  | 'valor'
  | 'glamour'
  | 'swords'
  | 'whispers'
  | 'creation'
  | 'eloquence'
  | 'spirits'
  | 'tragedy'
  // Cleric
  | 'knowledge'
  | 'life'
  | 'light'
  | 'nature'
  | 'tempest'
  | 'trickery'
  | 'war'
  | 'forge'
  | 'grave'
  | 'arcana'
  | 'order'
  | 'peace'
  | 'twilight'
  | 'blood'
  | 'moon'
  // Druid
  | 'land'
  | 'dreams'
  | 'shepherd'
  | 'spores'
  | 'stars'
  | 'wildfire'
  | 'blighted'
  // Fighter
  | 'champion'
  | 'battleMaster'
  | 'eldritchKnight'
  | 'arcaneArcher'
  | 'cavalier'
  | 'samurai'
  | 'purpleDragonKnight'
  | 'echoKnight'
  | 'psiWarrior'
  | 'runeKnight'
  // Monk
  | 'openHand'
  | 'shadow'
  | 'fourElements'
  | 'drunkenMaster'
  | 'kensei'
  | 'sunSoul'
  | 'longDeath'
  | 'mercy'
  | 'astralSelf'
  | 'ascendantDragon'
  | 'cobaltSoul'
  // Paladin
  | 'devotion'
  | 'ancients'
  | 'vengeance'
  | 'crown'
  | 'conquest'
  | 'redemption'
  | 'glory'
  | 'watchers'
  | 'sea'
  // Ranger
  | 'hunter'
  | 'beastMaster'
  | 'gloomStalker'
  | 'horizonWalker'
  | 'monsterSlayer'
  | 'feyWanderer'
  | 'swarmkeeper'
  | 'drakewarden'
  // Rogue
  | 'thief'
  | 'assassin'
  | 'arcaneTrickster'
  | 'inquisitive'
  | 'mastermind'
  | 'scout'
  | 'swashbuckler'
  | 'phantom'
  | 'soulknife'
  // Sorcerer
  | 'draconicBloodline'
  | 'wildMagicSorcerer'
  | 'divineSoul'
  | 'shadowMagic'
  | 'stormSorcery'
  | 'aberrantMind'
  | 'clockworkSoul'
  | 'lunarSorcery'
  | 'runeChild'
  // Warlock
  | 'archfey'
  | 'fiend'
  | 'celestial'
  | 'hexblade'
  | 'undying'
  | 'greatOldOne'
  | 'fathomless'
  | 'genie'
  | 'undead'
  // Wizard
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'
  | 'warMagic'
  | 'bladesinging'
  | 'chronurgyMagic'
  | 'graviturgyMagic'
  | 'scribes'
  | 'bloodMagic'
  // Artificer
  | 'alchemist'
  | 'armorer'
  | 'artillerist'
  | 'battleSmith'

/** 職業靜態設定資料 */
export interface ClassData {
  /** 職業中文名稱 */
  label: string
  /** 生命骰面數（例如 12 代表 d12） */
  hitDie: number
  /** D&D 5e 標準豁免熟練屬性（兩項） */
  savingThrowProficiencies: readonly AbilityKey[]
}

/** 單一職業條目：職業 key 與該職業等級 */
export interface ClassEntry {
  /** 職業 class key */
  classKey: ClassKey
  /** 該職業等級（1–20） */
  level: number
  /** 流派 / 範型（subclass / archetype），enum key；未選以 null 表示 */
  subclass: SubclassKey | null
}

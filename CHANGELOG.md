# @rolling-dice-app/types

## 8.1.0

### Minor Changes

- ac4c807: 新增 `MAX_DECIMAL_PRECISION = 1`：小數欄位允許的小數位數上限，供前後端共用驗證。

## 8.0.1

### Patch Changes

- c34f706: Internal: 將 `src/types/character/index.ts` 還原為純 barrel。先前內嵌的型別搬到：
  - `capabilities.ts` — `CharacterCapabilities`
  - `character.ts` — `CharacterDTO`、`CharacterCreateDTO`、`CharacterUpdateDTO`、`CharacterSummaryDTO`

  Public surface 不變（透過 root barrel 取用的所有 named export 保留）；僅檔案組織調整。

## 8.0.0

### Major Changes

- 1610ceb: 擴充 `User` 與新增 user partial-update DTO / 偏好設定型別。
  - BREAKING: `User` 新增必填 `preference: UserPreference` 與 `updatedAt: string`；所有 producer 必須同時供應。
  - Add `UserPreference` sub-shape：`characterListLayout: 'grid' | 'list'`。
  - Add `UserProfileUpdateDTO`（PATCH profile / preference；含 `updatedAt` 樂觀鎖）。
  - Add `UserAvatarUpdateDTO`（更新或清除 avatar；`avatarUrl: string | null`，含 `updatedAt` 樂觀鎖）。

### Patch Changes

- ae9b14c: Fix `VALIDATION_LIMITS.maxCampaignRecordsPerCharacter` from `200` back to `20`，與 `campaign-record-types` changeset 描述及預期的單一角色戰役紀錄上限一致。

## 7.2.0

### Minor Changes

- 024523e: Add `CampaignRecordDTO` / `CampaignRecordCreateBody` / `CampaignRecordUpdateBody` and the shared `CurrencyAmount` sub-shape under `character/`. `CharacterCurrencyDTO` and `CharacterCurrencyUpdateBody` are refactored to compose `CurrencyAmount`; wire shape is unchanged. `VALIDATION_LIMITS` gains `maxCampaignRecordsPerCharacter` (200), `maxCampaignRecordContentLength` (2000), and `maxTeammatesPerCampaignRecord` (20).

### Patch Changes

- d3d01bc: Deprecate the OAuth redirect channel error-code contract: `OAUTH_ERROR_CODES`, `OAuthErrorCode`, and `isOAuthErrorCode` are now marked `@deprecated` and will be removed in the next major. Frontend error handling is moving to a unified policy where OAuth redirect errors are logged with the raw `?error=` value and the UI shows a single generic "please try again later" message instead of branching per code. No runtime or type-shape changes in this release.

## 7.1.0

### Minor Changes

- 03a8473: Promote at-wire literal unions to `as const` runtime arrays so zod / select-option consumers can iterate without redeclaring values (which silently over-narrows when core later adds a variant).

  Added (type aliases unchanged, fully backwards-compatible):
  - `DAMAGE_TYPE_KEYS` (13 values) → `DamageTypeKey`
  - `ARMOR_TYPES` (`['light', 'medium', 'heavy', 'none']`) → `ArmorType`
  - `DAMAGE_DIE_TYPES` (`[4, 6, 8, 10, 12]`) → `DamageDieType`
  - `SKILL_PROFICIENCY_VALUES` (`['proficient', 'expertise']`) — wire subset of `ProficiencyLevel` (`'none'` excluded; `SkillProficiencies` now derives its value type from this const)
  - `SPELL_SCHOOLS` (8 values) → `SpellSchool`
  - `SPELL_SOURCES` (11 values) → `SourceKey`
  - `SPELL_LEVELS` (`[1, 2, 3, 4, 5, 6, 7, 8, 9]`) → `SpellLevel`
  - `ITEM_TYPES` (4 values) → `ItemType`
  - `INVENTORY_LOCATIONS` (`['backpack', 'dimensionalBag']`) → `InventoryLocation`
  - `FEATURE_SOURCES` (5 values) → `FeatureSource`
  - `FEATURE_USAGE_RECOVERIES` (`['shortRest', 'longRest', 'manual']`) → `FeatureUsageRecovery`
  - `CURRENCY_KEYS` (`['cp', 'sp', 'gp', 'pp']`) + new `CurrencyKey` type alias

  `DieType` (full die-face set), `SizeKey`, `WeaponType`, `ProficiencyLevel` (the `'none'`-inclusive form) remain TS-only — none of them currently sit at a wire boundary that needs runtime enumeration.

## 7.0.0

### Major Changes

- 7ed7c3f: M3 character sub-resource type refactor — split spells / inventory items / currency from `CharacterDTO` into dedicated sub-resource wire shapes.

  Breaking changes:
  - Remove `SpellEntry`, `InventoryItem`, `CharacterCurrency`, `CharacterInventory` interfaces.
  - Add `SpellEntryDTO` + `SpellEntryCreateBody` + `SpellEntryUpdateBody`; entry id is `id`, catalog FK is `spellId` (old `SpellEntry.id` was ambiguous between entry PK and catalog FK).
  - Add `InventoryItemDTO` + `InventoryItemCreateBody` (omits `isAttuned`; server enforces `false`) + `InventoryItemUpdateBody`.
  - Add `CharacterCurrencyDTO` + `CharacterCurrencyUpdateBody` (lives in new `src/types/character/currency.ts`).
  - `CharacterDTO` no longer extends `CharacterInventory`; `CharacterCapabilities` no longer carries `spells`; `CharacterUpdateDTO` removes `inventory` and `capabilities.spells` partial keys.
  - All sub-resource shapes carry their own `createdAt` / `updatedAt`; PATCH uses entry-level `updatedAt` as the optimistic-lock token.
  - Add `SpellRecord = Omit<SpellDTO, 'id'>` for backend `spells.data` JSONB column typing; wire `SpellDTO` keeps `id` at the top level.
  - Add `rules/attunement.ts` with `BASE_ATTUNED_SLOT = 3`, `EXTRA_ATTUNED_SLOT = 3`, and `computeAttunedLimit(character)` stub returning their sum (class / feat bonuses land in a follow-up; the base / extra split reserves headroom for future expansion).
  - Remove deprecated exports flagged for the next major: `VALIDATION_LIMITS.maxCampaignRecordContentLength`, `VALIDATION_LIMITS.maxItemDescriptionLength`, `VALIDATION_LIMITS.maxFeatureDescriptionLength`, top-level `COMMON_STRING_LENGTH_LIMIT`, `LONG_STRING_LENGTH_LIMIT`, `COMMON_INT_MAX_LIMIT`. Migrate to `CHARACTER_TEXT_LIMITS.*` / `CHARACTER_INT_LIMITS.GENERAL_INT_MAX`.
  - `defaults/character.ts`: remove `createDefaultInventory` factory; `buildCharacterCreateDefaults` no longer populates `spells` / `inventory`. `DEFAULT_CURRENCY` retained (used by backend for the `character_currency` sibling row at character creation).

  Consumers (frontend + backend) must migrate inventory / currency / spell entry reads and writes to dedicated sub-endpoints; aggregate `CharacterDTO` no longer carries them.

## 6.4.0

### Minor Changes

- 76811f0: 新增 `CombatStateUpdateDTO`（`types/combat.ts`）：CombatState PATCH 時 client 提交的 patch payload。
  - 帶 `updatedAt`（required）作樂觀鎖；其餘欄位 optional。
  - Nested object/array 必須整個帶完整值，與 character section partial 一致（JSONB `||` 是 shallow merge）。

## 6.3.0

### Minor Changes

- b49be75: 新增 CombatState 相關共享型別、defaults 與 overflow guard 常數，並把死亡豁免門檻搬進 `rules/`：
  - `CombatStateBody`（`types/combat.ts`）：`Omit<CombatStateDTO, 'characterId' | 'updatedAt'>`，給 frontend mock / backend POST·PATCH handler 共用。
  - `buildCombatStateBodyDefaults()`（`defaults/combat.ts`）：純工廠，回傳 SRD-baseline 初始 body；每次呼叫回傳獨立物件。
  - `COMBAT_STATE_LIMITS`（`types/combat-limits.ts`）：純防 JSONB 塞爆的欄位絕對值上限，量級沿用 `CHARACTER_INT_LIMITS`；不含 `deathSaves`、不含可推導的 `hp.current`。
  - `DEATH_SAVE_THRESHOLD`（`rules/death-saves.ts`）：SRD 死亡豁免成功 / 失敗計數的判定門檻常數。

### Patch Changes

- f3bb0db: 標記 `VALIDATION_LIMITS` 三個 length 欄位為 `@deprecated`，下一個 major 一併移除。改用 `CHARACTER_TEXT_LIMITS` 分層常數：
  - `maxCampaignRecordContentLength`（原 1000）
  - `maxItemDescriptionLength`（原 500）
  - `maxFeatureDescriptionLength`（原 800）

  新欄位字數上限請依語意挑 `CHARACTER_TEXT_LIMITS.MEDIUM` (500) 或 `CHARACTER_TEXT_LIMITS.LONG` (2000)。

## 6.2.0

### Minor Changes

- 2364642: `validation-limits.ts` 新增分層常數，舊扁平 const 標 `@deprecated`，下一個 major 移除。

  **新增**
  - `CHARACTER_TEXT_LIMITS = { TINY: 30, SHORT: 100, MEDIUM: 500, LONG: 2000 } as const` — 角色文字欄位字數上限分層（TINY: tag / SHORT: name·race / MEDIUM: item·feature / LONG: story·appearance）。
  - `CHARACTER_INT_LIMITS = { SMALL_INT_MAX: 99, GENERAL_INT_MAX: 999, LARGE_INT_MAX: 999_999 } as const` — 角色 int 欄位防爆絕對值（applies as ±cap）。`SMALL_INT_MAX` 給 level / proficiency tier / spell slot 數量類欄位；`GENERAL_INT_MAX` 給 HP / gold / XP 類；`LARGE_INT_MAX` 給累計類大數值（總 XP / 累計 gold 等）。

  **Deprecated（仍可用，建議遷移）**
  - `COMMON_STRING_LENGTH_LIMIT` → `CHARACTER_TEXT_LIMITS.SHORT`
  - `LONG_STRING_LENGTH_LIMIT` → `CHARACTER_TEXT_LIMITS.LONG`
  - `COMMON_INT_MAX_LIMIT` → `CHARACTER_INT_LIMITS.GENERAL_INT_MAX`

  分層命名讓 consumer 表達意圖更清楚（`SHORT`/`MEDIUM`/`LONG` vs 三個獨立 const 名），並補上原本缺的 `TINY` / `MEDIUM` 段位。

## 6.1.0

### Minor Changes

- 8463261: 新增共用驗證閾值與 D&D 5e 角色等級上限，避免前後端各自硬編碼。

  **`types/validation-limits.ts` 新增 sibling 常數**
  - `COMMON_STRING_LENGTH_LIMIT = 100` — 一般字串欄位字數上限（name / race / 短欄位），純防 JSONB 塞爆。
  - `LONG_STRING_LENGTH_LIMIT = 2000` — 長字串欄位字數上限（story / appearance / 列舉類），純防 JSONB 塞爆。
  - `COMMON_INT_MAX_LIMIT = 999` — 一般 int 欄位防爆絕對值（applies as ±cap），純防 JSONB 塞爆。

  不塞進 `ValidationLimits` interface — 這三個是「通用防爆閾值」，不會隨 plan tier 或實例化目標變動。

  **`rules/character-level.ts`（新檔）**
  - `MAX_CHARACTER_LEVEL = 20` — D&D 5e：單一角色跨多職業的總等級上限。

  同時將 `rules/index.ts` 由 `export {}` 改為 `export * from './character-level.js'`。

## 6.0.0

### Major Changes

- bdbd923: refactor(types)!: `PlanLimits` 移除 `softDeleteRetentionDays` 與 `deleteCooldownAfterRestoreDays`。

  兩者為系統級保留政策，不隨 plan tier 變動，語意上不屬 plan-tier limits。Backend 已將兩者集中於 `src/lib/retention.ts`；frontend 若需顯示倒數，未來由 API 另外暴露而非塞進 `PlanLimits`。

  備註：這兩欄位在 5.0.0 短暫存在過，未經實際消費就移除。Frontend / backend 不需特別動作（沒人應該已開始讀這兩欄位）。

## 5.0.0

### Major Changes

- bdca0af: refactor(types): 拆分 `PlanLimits` 為純方案上限 shape，並新增 `ValidationLimits` 與 `MeResponseDTO`。
  - 新增 `ValidationLimits` 介面與 `VALIDATION_LIMITS` 常數，承接通用輸入驗證上限（物品 / 攻擊 / 特性 / 自訂法術數，以及描述字數），值對齊原 `FREE_PLAN_LIMITS` 同名欄位。
  - `PlanLimits` 改為純 shape；values 由 backend 拍板，透過 `/auth/me` 回應送給前端。欄位重組：保留 `maxCharacters`、`maxCampaignRecordsPerCharacter`；新增 `maxActiveCharacters`、`softDeleteRetentionDays`、`deleteCooldownAfterRestoreDays`；移除 7 個驗證類欄位。
  - **語意變更**：`PlanLimits.maxCharacters` 由「active 角色卡上限」改為「總 row 上限（active + soft-deleted）」；UI「尚可新建的卡數」應改用 `maxActiveCharacters`。
  - 移除 `FREE_PLAN_LIMITS` const — 前端不再 import 任何 `*_PLAN_LIMITS`。
  - 新增 `MeResponseDTO` (`{ user: UserDTO, limits: PlanLimits }`)，作為 `GET /auth/me` 的標準回應 shape。

  Frontend / backend 須同步調整：字數限制改讀 `VALIDATION_LIMITS.*`；方案限制改讀 `meResponse.limits.*`；`/auth/me` 回應從扁平 `UserDTO` 改為 `MeResponseDTO`。

- 5cc91e9: refactor(types)!: `UserDTO` 改名為 `User`，與既有 sub-shape 命名規則對齊。

  按 `src/types/index.ts` 規則：top-level HTTP request/response 才掛 `DTO` 後綴；`User` 在現有 surface（`MeResponseDTO.user`）是 sub-shape，不該帶 DTO。

  Frontend / backend 須同步調整 import：`UserDTO` → `User`。若未來新增以 user 為 top-level 回應的 endpoint（如 `GET /users/:id`），命名仍應走 `User` 不另立 `UserDTO`，避免 sub-shape / response-shape 雙生。

## 4.1.0

### Minor Changes

- 6ed7852: feat(character): 新增 `CharacterUpdateDTO`，PATCH 角色 endpoint 共用契約。以 section 為粒度（`profile` / `classes` / `stats` / `capabilities` / `inventory`，各為 `Partial<...>`）局部更新，並要求 client 帶上 `updatedAt` 作為樂觀鎖 token。

### Patch Changes

- 6b775a8: refactor(defaults): 將 `createDefaultArmorClass` / `createDefaultInventory` / `buildCharacterCreateDefaults` 從 function declaration 改為 arrow function expression，統一程式風格。執行語意不變。

## 4.0.0

### Major Changes

- 026e4f6: 統一 HTTP top-level shape 的 DTO 後綴命名，並把 avatar 移入建立角色 payload。

  **Rename（breaking）**
  - `Character` → `CharacterDTO`
  - `CharacterCreateInput` → `CharacterCreateDTO`
  - `CharacterSummary` → `CharacterSummaryDTO`
  - `CombatState` → `CombatStateDTO`
  - `SpellDto` → `SpellDTO`（大小寫對齊 `UserDTO`）

  Sub-shape（`CharacterProfile` / `CombatHp` / `AbilityScoreEntry` /
  `ArmorClassConfig` / `SpellEntry` 等）依「只有 HTTP top-level shape 加 DTO 後綴」
  規則維持原名。

  **CharacterCreateDTO 新增 `avatar?: string | null`**

  `buildCharacterCreateDefaults()` 不再涵蓋 `avatar`；改由 server 端在 POST
  handler 處理 fallback：

  ```ts
  const character: CharacterDTO = {
    ...buildCharacterCreateDefaults(),
    ...input,
    avatar: input.avatar ?? null,
    id,
    createdAt,
    updatedAt,
  }
  ```

  **CharacterSummaryDTO 新增 `race: string | null`**

  列表 payload 補上種族欄位；server 端列表查詢需一併投影 `race`。

  **Consumer migration**
  - 全部 import 名字置換上述 5 個 type
  - backend POST `/characters` 加 `input.avatar ?? null` fallback
  - backend GET `/characters` 列表 select 加 `race`
  - frontend create form 若已支援 avatar 上傳，可將值放進 create payload

## 3.3.0

### Minor Changes

- d6a7841: 新增 6 個 enum value array 並改由陣列推導對應 union type，讓 backend 能直接餵 `z.enum([...])` 做 runtime 驗證、避免 source-of-truth 分裂：
  - `ABILITY_KEYS` → `AbilityKey`
  - `ALIGNMENT_KEYS` → `AlignmentKey`
  - `GENDER_KEYS` → `GenderKey`
  - `CLASS_KEYS` → `ClassKey`
  - `SUBCLASS_KEYS` → `SubclassKey`
  - `SKILL_KEYS` → `SkillKey`

  純 additive 變更，type 名稱與成員集合不變，既有 import 不受影響。

## 3.2.0

### Minor Changes

- a66cd02: 新增 character contract 項目，支援 backend M1 endpoints（list / detail /
  create）：

  **Types**
  - `Character.updatedAt: string`（ISO 8601 ms 精度）— 列表/詳情顯示用，
    亦作 M2 PATCH concurrency token。
  - `CharacterCreateInput`：使用者表單真正會送出的 21 欄，剔除 form-only
    的 `abilityMethod` / `dicePool`。
  - `CharacterSummary`：列表 payload，包含 `id`、`name`、`classes`、
    `level`（各職業等級總和）、`avatar`、`updatedAt`。

  **新增 `defaults/` 桶**

  從 frontend 搬來，作為 frontend mock-build 與 backend POST handler 共用
  的 source-of-truth：
  - `UNARMORED_AC_BASE = 10`
  - `DEFAULT_CURRENCY: Readonly<CharacterCurrency>`
  - `createDefaultArmorClass()`
  - `createDefaultInventory()`
  - `buildCharacterCreateDefaults()` — 構造 Character 中「不在
    `CharacterCreateInput`」的 16 個欄位的初始值。

  **Consumer 須知**
  - `Character.updatedAt` 為新必填欄。任何以 object literal 構造 Character
    的 caller 需補上此欄（例：frontend `stores/character.ts: addCharacter`
    將同步在跨 repo 配套 PR 移除本機 build 流程，改由 backend 構造完整
    Character）。
  - frontend 對應 PR 須移除自有的 `UNARMORED_AC_BASE` /
    `DEFAULT_CURRENCY` / `createDefaultArmorClass` / `createDefaultInventory`，
    改從 `@rolling-dice-app/core` import。

- 06a3e4e: `SpellEntry` 新增 optional `sourceClass?: ClassKey` 欄位，用於多職業情境
  下標記法術來源職業（牧師習得的法術 vs 法師習得的法術）。

  當前以 optional 形式預留，不強制填寫；後續釐清「法術來源歸屬」設計與
  prepare limit 正確計算規則後，改為必填並補既有資料 migration。

  新增為 non-breaking minor change，既有持久化資料不須立即更新。

## 3.1.0

### Minor Changes

- 50dd03b: 新增 OAuth redirect error code wire contract：
  - `OAUTH_ERROR_CODES`：7 個 code 的 `as const` tuple（6 個 OAuth flow code + `OAUTH_UNEXPECTED_ERROR` fallback）
  - `OAuthErrorCode`：對應的 union type
  - `isOAuthErrorCode`：narrow guard

  範圍限定為「OAuth redirect URL `?error=` 通道」。HTTP API response body 的
  error code（VALIDATION_ERROR / UNAUTHORIZED_ERROR / RATE_LIMITED 等）屬於
  另一條 contract，待後續 milestone 視需要再收。

## 3.0.0

### Major Changes

- 9a9309e: Remove the `ClassData` interface. The three fields are split by ownership:
  - `label` (Chinese display string) — leaves `core` entirely; how to
    store / source class labels (hardcoded mapping, i18n, etc.) is the
    consumer's concern.
  - `hitDie` and `savingThrowProficiencies` — kept as SRD facts but
    unbundled into two parallel runtime constants:
    - `CLASS_HIT_DICE: Readonly<Record<ClassKey, DieType>>`
    - `CLASS_SAVING_THROW_PROFICIENCIES: Readonly<Record<ClassKey, readonly AbilityKey[]>>`

  Rationale: the original `ClassData` had cross-concerns — `label` is UI,
  the other two are SRD rule facts. The two SRD fields also have no
  shared consumer (different future `derive*` rules will use one or the
  other), so bundling them was artificial cohesion. Splitting now also
  avoids the pattern becoming a god-object as more SRD per-class data
  (spellcaster type, primary ability, etc.) lands.

  Migration: replace `CLASS_CONFIG[key].hitDie` →
  `CLASS_HIT_DICE[key]` and `CLASS_CONFIG[key].savingThrowProficiencies` →
  `CLASS_SAVING_THROW_PROFICIENCIES[key]`. Build any local label table in
  the consumer.

- bb34349: `DieType` and `DamageDieType` now use numeric face counts instead of
  `'d4' | 'd6' | ...` string literals.

  ```ts
  // before
  type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
  type DamageDieType = Extract<DieType, 'd4' | 'd6' | 'd8' | 'd10' | 'd12'>

  // after
  type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100
  type DamageDieType = Extract<DieType, 4 | 6 | 8 | 10 | 12>
  ```

  Rationale: the `'d'` prefix is a written / display notation, not the die's
  identity. A die is identified by its face count; rendering as `"d10"` /
  `"10-sided"` / icon is a presentation choice that belongs to the consumer.

  Migration: persisted / passed values change from `'d6'` to `6`. Consumers
  that need to render the `"d"` prefix can format inline (`` `d${value}` ``).

- 38651fd: Remove `CharacterTier` (`'common' | 'elite' | 'master' | 'legendary'`).

  This was a UI-flavor classification — gacha-style rarity grading rather
  than a SRD concept (DND 5e's "tier of play" uses 1/2/3/4 with no such
  labels). No `Character` field referenced it; the value was always derived
  from level by a frontend helper (`getCharacterTier(level)`).

  Such product-specific UI grading belongs in the consumer that displays
  it. Both the type and any `level → tier` mapping should live in the
  frontend.

- df4e1a1: Remove the `Spell` type alias. `SpellDto` is now the single name for the
  spell contract.

  The two names had identical shapes but unclear semantic distinction
  (the JSDoc claimed `Spell` was "normalized for UI" but no normalization
  existed). The DTO suffix matches the convention pinned in `2.0.0`'s
  `UserDTO` introduction.

  Migration: replace `import type { Spell } from '@rolling-dice-app/core'`
  with `import type { SpellDto }` and rename references accordingly.

### Patch Changes

- 0c15168: Remove JSDoc comments that prescribed UI behavior or referenced
  frontend file paths:
  - `combat.ts` `CombatHp.current` no longer suggests "UI 應顯示
    effectiveMaxHp" — display fallback is the consumer's choice.
  - `spell.ts` `SpellSchool` no longer mentions "中文僅為顯示 label"
    (no labels live in this file).
  - `spell.ts` `SpellDto` no longer references `public/json/spells.json`
    (a frontend asset path that should not appear in `core`).

  Pure documentation cleanup; no shape changes.

- ca97be3: Split the catch-all `dnd/misc.ts` into one file per concept, matching
  the existing `dnd/` convention (`ability-key.ts`, `dice.ts`, `skill.ts`,
  etc.):
  - `dnd/size.ts` — `SizeKey`
  - `dnd/gender.ts` — `GenderKey`
  - `dnd/armor-type.ts` — `ArmorType`
  - `dnd/weapon-type.ts` — `WeaponType`
  - `dnd/damage-type.ts` — `DamageTypeKey`

  `dnd/misc.ts` is removed. Public API is unchanged — the root barrel
  continues to re-export every type, so consumer imports
  (`import type { SizeKey } from '@rolling-dice-app/core'`) work as before.

## 2.1.1

### Patch Changes

- 7443830: Extract `DieType` and `DamageDieType` from `dnd/misc.ts` into a dedicated
  `dnd/dice.ts`. Dice are a core DND mechanic, not a "miscellaneous" concept,
  and deserve their own file alongside `ability-key`, `class`, `skill`, etc.

  Internal-only refactor. Both types continue to be re-exported from the
  root barrel (`@rolling-dice-app/core`), so consumer imports do not change.

- fd2ee3d: Switch build to `moduleResolution: NodeNext` and add explicit `.js`
  extensions to all relative imports / re-exports in source.

  Previously `core` built with `moduleResolution: Bundler`, which produced
  `dist/**/*.js` containing extensionless imports like
  `export * from './types'`. Bundler-based consumers (Vite / Nuxt / webpack)
  handle this fine, but Node's native ESM resolver is strict and throws
  `ERR_UNSUPPORTED_DIR_IMPORT`, making the package unusable from a plain
  Node runtime — including the backend (Fastify under `tsx` / `node`).

  No public API changes. Consumers continue to write
  `import { ... } from '@rolling-dice-app/core'` exactly as before; only the
  internal dist resolution paths now satisfy the NodeNext spec.

## 2.1.0

### Minor Changes

- fe855ba: Add `UserDTO` — the shared public user contract consumed directly by both
  frontend and backend (auth/profile responses, character ownership, …).

  Fields: `id`, `email`, `displayName`, `avatarUrl: string | null`,
  `createdAt` (ISO 8601 string).

  Also pin the `DTO` suffix naming convention via a TODO in
  `src/types/index.ts`: only top-level HTTP request/response shapes get the
  suffix; sub-shapes (`AbilityScoreEntry`, `ArmorClassConfig`, `SpellLevel`, …)
  do not. Existing `Character` / `CombatState` are left unrenamed for now and
  will be migrated when those areas next change, to avoid a rename-only major
  release.

## 2.0.0

### Major Changes

- 7dd0578: Rename `profession` → `class` to align with DND 5e official terminology.

  Renamed types: `ProfessionKey` → `ClassKey`,
  `SubprofessionKey` → `SubclassKey`, `ProfessionData` → `ClassData`,
  `ProfessionEntry` → `ClassEntry`, `CharacterProfessions` → `CharacterClasses`.

  Renamed properties: `CharacterClasses.professions` → `classes`,
  `ClassEntry.profession` → `classKey` (avoids TS reserved word `class`),
  `ClassEntry.subprofession` → `subclass`.

  String literal members (`'fighter'`, `'wizard'`, `'champion'`,
  `'wildMagicSorcerer'`, …) are unchanged.

  Migration: rename imports / property accesses 1:1. Frontend and backend
  should upgrade in lockstep.

## 1.1.0

### Minor Changes

- e87f049: Spell type spec adjustment: add `engName: string`, `source: SourceKey`,
  `classes: ProfessionKey[]` to `SpellDto`. New `SourceKey` union enumerates
  the 11 sourcebook codes currently present in shipped spell data
  (PHB / XGE / TCE / FTD / EGW / GGR / SCC / TDCSR / AAG / AI / BMT).

  Additive change for consumers — existing `SpellDto` consumers continue to
  compile, but constructing a `SpellDto` literal now requires the three new
  fields.

## 1.0.0

### Major Changes

- b5c1322: Rename package from `@rolling-dice-app/types` to `@rolling-dice-app/core` and
  reposition it as the shared **domain core** (types + pure DND rules) consumed
  by frontend and backend.

  Restructure:
  - All existing types moved under `src/types/` (`character/`, `dnd/`,
    `combat.ts`, `spell.ts`, `plan-limits.ts`). No type contents changed.
  - New empty `src/rules/` introduced as the home for pure SRD-baseline
    derivation functions; rules will land in follow-up PRs.
  - `src/index.ts` now re-exports `./types` and `./rules` — root imports stay
    flat for consumers.

  This is a hard break: no alias package is published. Consumers must update
  both `package.json` and import specifiers from `@rolling-dice-app/types` to
  `@rolling-dice-app/core`. Re-export surface is unchanged for existing types.

## 0.2.0

### Minor Changes

- 3a84155: Add `PlanLimits` type and `FREE_PLAN_LIMITS` constant to define per-account usage caps (characters, items, campaign records, attacks, features, custom spells, plus content length limits). Used by backend for enforcement and frontend for UX gating.

### Patch Changes

- 5abfb19: Add Prettier with shared config aligned to backend/frontend, plus `.editorconfig`. New `format` / `format:check` scripts; CI Release workflow now gates on `pnpm format:check`. No public API change.

## 0.1.0

### Minor Changes

- e6ab592: initial release: extract shared persistent types from frontend (character / combat / dnd / spell)

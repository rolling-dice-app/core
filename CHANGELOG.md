# @rolling-dice-app/types

## 12.1.0

### Minor Changes

- 49273d6: m7.3 戰場契約：新增 Battlefield 型別家族（BattlefieldDTO / BattlefieldUnit / BattlefieldUnitHp / BattlefieldAttackEntry / BattlefieldCondition / BattlefieldSessionOption / BattlefieldCreateBody / BattlefieldUpdateBody 與 BattlefieldUnitKind / BattlefieldFaction union）、BATTLEFIELD_LIMITS 數值範圍常數、VALIDATION_LIMITS 三鍵（maxUnitsPerBattlefield: 50 / maxConditionsPerBattlefieldUnit: 15 / maxAttacksPerBattlefieldUnit: 20）、三個 error codes（BATTLEFIELD_NOT_FOUND / STALE_BATTLEFIELD_VERSION / BATTLEFIELD_ALREADY_EXISTS）與 buildBattlefieldCreateDefaults()。單位 HP/AC 比照 combat-state 調整值模型（快照基準＋adjustment，前端計算有效值）；攻擊快照供前端擲骰取數（傷害復用 DamageDieEntry）；技能加值快照（BattlefieldUnit.skills，flat 總值 Partial&lt;Record&lt;SkillKey, number&gt;&gt;，±cap UNIT_SKILL_BONUS_ABS_MAX）；速度為數值快照（number | null，建立時定格）＋ speedAdjustment 調整值（比照 HP/AC 模型）；死亡豁免復用 DeathSaves

## 12.0.0

### Major Changes

- c8dd983: 怪物模板 speed 改為數字並移除已棄用欄位（breaking）：
  - `MonsterTemplateDTO.speed`：`string`（自由文字）→ `number`（呎；單一絕對數值，預設 30，新增 `MONSTER_DEFAULT_SPEED`）；多模式速度（飛行、攀爬等）改寫 remark
  - 移除 `CharacterSummaryDTO.level`（前端由 classes 自行加總）
  - 移除怪物模板四個已棄用自由文字欄位：`damageVulnerabilities` / `damageResistances` / `damageImmunities` / `conditionImmunities`（由 `damageModifiers` / `conditionImmunityKeys` 取代）

## 11.10.1

### Patch Changes

- fcac92c: Deprecate `CharacterSummaryDTO.level`. Clients should derive the total level from `classes`; the field will be removed in the next major. Doc-only change — no type or runtime impact.

## 11.10.0

### Minor Changes

- c0ac86a: DmSessionContainerSummaryDTO 新增 nextSession 欄位（DmSessionLogSummaryDTO | null）；server 帶出的唯讀衍生欄位，指向下一場團務，無場次可指時為 null

## 11.9.0

### Minor Changes

- 5052f82: 新增 CONDITION_KEYS / ConditionKey 與 DAMAGE_MODIFIER_KEYS / DamageModifierKey enum；MonsterTemplateDTO 新增結構化欄位 damageModifiers（每傷害類型單一互斥狀態）、conditionImmunityKeys、remark（含 defaults 與 update body）；原四個 free-text 抗性欄位標記 @deprecated，下個 major 移除

## 11.8.0

### Minor Changes

- c88c3b0: 新增 m7.2 團務紀錄的 API error codes：`DM_SESSION_CONTAINER_NOT_FOUND`、`DM_SESSION_LOG_NOT_FOUND`、`STALE_DM_SESSION_CONTAINER_VERSION`、`STALE_DM_SESSION_LOG_VERSION`、`DM_SESSION_CONTAINER_LIMIT_REACHED`、`DM_SESSION_LOG_LIMIT_REACHED`、`DM_SESSION_MEMBER_SHARE_ID_INVALID`；`PlanLimitErrorCode` union 納入兩個 DM session plan-limit codes。

## 11.7.0

### Minor Changes

- 3831b88: Add m7.2 DM session contract: `DmSessionContainerDTO` (owner-scoped container grouping session logs by scenario / player group, with shared member shapes `DmSessionMemberDTO` / `DmSessionMemberInput`) and `DmSessionLogDTO` as its sub-resource (`containerId`-linked), each with summary / create / update shapes, `buildDmSessionContainerCreateDefaults` / `buildDmSessionLogCreateDefaults`, plus `PlanLimits.maxDmSessionContainers` / `maxDmSessionLogsPerContainer` and validation limits `maxMembersPerDmSessionContainer` / `maxMembersPerDmSessionLog` / `maxItemRewardsPerDmSessionLog`.

## 11.6.0

### Minor Changes

- f6c3076: MonsterTemplateCreateBody 放寬為 name 必填 + 其餘業務欄位 optional

  原本 create 只收 `{ name }`，前端完整表單建立需拆成 POST + PATCH 兩段請求，且 PATCH 失敗會留下只有名字的半成品。放寬後建立可一次帶完整欄位，缺漏欄位仍由 `buildMonsterTemplateCreateDefaults` 補（quick-create 能力不變）。為 additive 變更，舊 `{ name }` payload 仍合法。

  同時修正 `buildMonsterTemplateCreateDefaults` 回傳型別：原以 `keyof MonsterTemplateCreateBody` 做 Omit，CreateBody 加入 optional 欄位後會把所有業務欄位剔除導致型別塌縮，改為顯式排除 `name` 與 server-owned 欄位。

## 11.5.0

### Minor Changes

- 26c971d: 新增 SIZE_KEYS 常數陣列（有序 SizeKey）

  `SizeKey` 原本僅為字面聯集型別，缺少對應的有序 key 陣列（其他枚舉如 `ABILITY_KEYS` / `ALIGNMENT_KEYS` 皆有）。新增 `SIZE_KEYS` 讓消費端可迭代體型（如怪物模板的體型下拉），`SizeKey` 改由 `(typeof SIZE_KEYS)[number]` 衍生、型別等價不變。

## 11.4.0

### Minor Changes

- e50c51c: SPELL_SOURCES 新增 SATO 出處

  `SPELL_SOURCES` 新增 `SATO` 出處縮寫，`SourceKey` 隨之擴充。屬可向後相容的 union 新增成員，消費者可安全忽略。

## 11.3.0

### Minor Changes

- b7bfac9: 怪物模板改 hard-delete：移除 MonsterTemplateDTO 的 deletedAt

  怪物模板為靜態素材、無 restore，後端 DELETE 改為實刪（hard-delete），不再保留軟刪除欄位。`MonsterTemplateDTO` 移除 `deletedAt`，`buildMonsterTemplateCreateDefaults` 的 `Omit` 同步移除。修正尚無消費者的 11.2.0 monster 契約。

## 11.2.0

### Minor Changes

- 120d297: 怪物模板（m7.1）契約收尾：移除 sortOrder、補 error codes
  - `types/monster.ts`：`MonsterTemplateDTO` 與 `MonsterTemplateSummaryDTO` 移除 `sortOrder`。怪物模板為頂層 owner-scoped 資源，比照 characters / inventory 以時間排序，產品無「使用者手動排序」模型，故不保留 sort 欄位。修正剛 publish 的 11.1.0 monster 契約（尚無消費者）。
  - `types/api-error.ts`：`API_ERROR_CODES` 新增 `MONSTER_TEMPLATE_NOT_FOUND`、`STALE_MONSTER_TEMPLATE_VERSION`、`MONSTER_TEMPLATE_LIMIT_REACHED`；後者納入 `PlanLimitErrorCode` union，供 backend `PlanLimitExceededError` 使用。
  - `defaults/monster.ts`：`buildMonsterTemplateCreateDefaults` 的 `Omit` 同步移除 `sortOrder`。

## 11.1.0

### Minor Changes

- 06cd0d2: 新增怪物模板（m7.1）契約型別、limits 與 defaults
  - `types/monster.ts`：新增 `MonsterTemplateDTO`、`MonsterTemplateSummaryDTO`、`MonsterTemplateCreateBody`、`MonsterTemplateUpdateBody`，與子結構 `MonsterAttackEntry`、`MonsterFeature`。數值全走 flat 絕對值（怪物無等級成長），重用 `AbilityKey` / `SkillKey` / `SizeKey` / `AlignmentKey` enum 與 `DamageDieEntry` 結構；不重用角色的 `AttackEntry` / `CharacterFeature` / `ArmorClassConfig` / `AbilityScoreEntry`。無 restore，故 DTO 不含 `restoredAt`。
  - `PlanLimits`：新增 `maxMonsterTemplates`（值由 backend 拍板，計未刪除列）。
  - `VALIDATION_LIMITS`：新增 `maxAttacksPerMonsterTemplate`（10）、`maxFeaturesPerMonsterTemplate`（10）、`maxDamageDicePerAttack`（10，角色與怪物攻擊共用）。
  - `defaults/monster.ts`：新增 `buildMonsterTemplateCreateDefaults`（abilities 預設 10、ac 10 / hp 1、free-text 與陣列空）。

## 11.0.0

### Major Changes

- 56d5acb: 多職法術環位取整改為依主／兼職位置決定，並移除既有 deprecated 型別
  - `getSuggestedRegularSpellSlots`：多職 effective-level 改為逐 class 依位置取整再加總——主職業（`classes[0]`，與 `rules/hp.ts` 一致）施法等級向上取整（ceil），其餘兼職向下取整（floor）；artificer 作為兼職時亦改為 floor，不再永遠 round-up。full caster 除數為 1 不受影響。已取代原先 paladin+ranger「sum-then-halve」的 permissive 解讀（見 CLAUDE.md catalogue）。
  - 連帶修正：單職 eldritchKnight / arcaneTrickster 因走多職公式且為主職，改用 `ceil(level/3)`，現與 PHB 單職三階施法者表一致（例：EK lv7 由 `{1:3}` 修正為 `{1:4,2:2}`）。
  - 單職 paladin / ranger / artificer 各等級輸出不變（含第 1 級無環位）。
  - 移除「待下次 major」的 deprecated 型別：`TeammatePreviewDTO`、`ValidateTeammatesBody`、`ValidateTeammatesResponse`（整個 `teammate.ts`）與 `UserAvatarUpdateDTO`。

## 10.2.0

### Minor Changes

- d65f0f3: feat(rules): 新增 computeHpMax 與 getClassHitPoints

  把 frontend 原本 local 的 HP 公式（`calculateTotalHp` / `getClassHitPoints`）抽到 core。
  兩端 consumer 對「角色 base HP 上限」必須有單一一致的真值，frontend 用於 UI 顯示，
  backend 用於 PATCH /combat-state 的 `hp.current ≥ -hpMax` invariant 驗證。
  - `getClassHitPoints(hitDie, level, isPrimary)`：單一職業條目貢獻的 base HP；
    主職業第 1 級取滿，其餘用平均（PHB p.15）
  - `computeHpMax(character: HpMaxInput)`：完整 base HP 上限；含 CON 修正 / Tough /
    customHpBonus。輸入採 `Pick<SharedCharacterProfileDTO, 'classes'|'abilities'|
'isTough'|'customHpBonus'>`，DTO / form-state 結構相容皆可傳入。
  - 不含 combat-state 的 `hp.maxAdjustment` 臨時調整 —— 屬戰鬥當下值，由 caller 自行套上

## 10.1.0

### Minor Changes

- f806182: types(api-error): 新增 `PlanLimitErrorCode` narrow union

  對應 backend Group 4 U2-N9 — 讓 `PlanLimitExceededError(code)` 不再吃任意字串、限制只能傳 plan-quota 相關 code（`ACTIVE_CHARACTER_LIMIT_REACHED` / `CHARACTER_TOTAL_LIMIT_REACHED` / `CAMPAIGN_RECORD_LIMIT_REACHED`）。

  以 `Extract<ApiErrorCode, ...>` 顯式列出三個成員，若 `API_ERROR_CODES` 中任一被移除、`PlanLimitErrorCode` 會自動縮窄，backend 拋出端會直接 TS error。

## 10.0.0

### Major Changes

- 4ab61f7: Group 2A — Phase 2 major release (breaking):
  - **U1-C5**: `SUBCLASS_KEYS` entry `'Juggernaut'` renamed to `'juggernaut'` for casing consistency with all other subclass keys. `SubclassKey` union narrows accordingly. Frontend select option labels and i18n keys must be updated to the lowercase value; backend storage requires no migration (prod scan confirmed `count = 0` on 2026-05-28).
  - **U5-C1**: Add `CombatResetBody` (shared by short-rest / long-rest / reset endpoints; all three are replace-state operations of varying scope) requiring `expectedUpdatedAt: string`. Backend rest / reset endpoints now consume an optimistic-lock token instead of trusting frontend single-writer enforcement; concurrent PATCH /combat-state vs rest collisions will return `STALE_COMBAT_STATE_VERSION` 409 on the loser.
  - **Removed deprecated `VALIDATION_LIMITS` fields** (originally `@deprecated` since 9.13.0): `maxCampaignRecordsPerCharacter` and `maxCampaignRecordContentLength`. The campaign-record content limit canonicalised on `CHARACTER_TEXT_LIMITS.HUGE` (5000); per-character record count is governed solely by `PlanLimits.maxCampaignRecordsPerCharacter`. `core/src/types/character/campaign-record.ts` JSDoc updated to cite the new source.

  Coordinated rollout:
  - Backend bumps `@rolling-dice-app/core` and accepts the new rest/reset request bodies (Group 2B).
  - Frontend submits `expectedUpdatedAt` from the current combat-state snapshot when invoking rest / reset, adopts `'juggernaut'` in its subclass dropdown, and removes the residual `VALIDATION_LIMITS.maxCampaignRecordsPerCharacter` fallback in `CampaignsTab.vue` (only remaining consumer of the removed field).

## 9.13.0

### Minor Changes

- 2cb8909: Spell slots / errors / docs minor:
  - Fix subclass caster override leaking across classes — `SUBCLASS_CASTER_OVERRIDE` now keyed by `(classKey, subclass)` so `monk + eldritchKnight` no longer awards third-caster slots; `fighter + eldritchKnight` and `rogue + arcaneTrickster` continue to work.
  - Add single-class spell-slot lookup for full / floor-half / round-up-half casters (bard, cleric, druid, sorcerer, wizard, paladin, ranger, artificer). Multiclass effective-level path unchanged for mixed casters.
  - Re-classify artificer as round-up half-caster (Tasha errata): multiclass formula uses `ceil(level / 2)` instead of `ceil(level / 3)`.
  - Add `CHARACTER_NOT_FOUND` and `EMPTY_PATCH` API error codes.
  - Mark `maxCampaignRecordsPerCharacter` and `maxCampaignRecordContentLength` as `@deprecated` (removal scheduled for next major).
  - Rewrite `attunement.ts` and `CombatStateUpdateDTO` JSDoc to reduce ambiguity; attunement comment now points at the "Catalogue of permissive caps" section in `core/CLAUDE.md`.
  - Land Vitest infra (devDep + `test` script + `vitest.config.ts`) alongside the first `rules/` behavioural change, per `core/CLAUDE.md`.

## 9.12.0

### Minor Changes

- 5514b95: `API_ERROR_CODES` 補齊 backend 實際 throw 但首版漏列的 code：
  - race：`STALE_SPELL_ENTRY_VERSION`、`STALE_INVENTORY_ITEM_VERSION`
  - plan / quota：`CAMPAIGN_RECORD_VALIDATION_LIMIT_REACHED`、`ITEM_LIMIT_EXCEEDED`、`LEARNED_SPELLS_LIMIT_EXCEEDED`、`ATTUNED_LIMIT_EXCEEDED`、`SPELL_ALREADY_LEARNED`、`CURRENCY_OVERFLOW`
  - avatar 400：`AVATAR_INVALID_MIME`、`AVATAR_MAGIC_BYTE_MISMATCH`
  - 內部 invariants：`CHARACTER_CURRENCY_MISSING`、`OWNERSHIP_NOT_RUN`
  - OAuth 內部：`OAUTH_EMAIL_ALREADY_LINKED`、`OAUTH_USER_UPSERT_FAILED`

## 9.11.0

### Minor Changes

- 4e82590: 新增 `ApiErrorCode` 契約：`API_ERROR_CODES` const tuple、`ApiErrorCode` union 型別、`isApiErrorCode` runtime guard。涵蓋 backend 目前所有會出現在 HTTP error response body 的 code（含 race / cooldown / plan-limit / validation / 5xx fallback / OAuth 內部）。consumer 後續會把 backend `AppError.code` 與 frontend `ERROR_MESSAGE_MAP` key 改吃此型別。

## 9.10.0

### Minor Changes

- eefb957: 新增 `SharedCharacterPreviewDTO` 與 `ResolveSharedCharactersBody` / `ResolveSharedCharactersResponse`，作為 `POST /share/characters/resolve` 的中性型別。原 `TeammatePreviewDTO` / `ValidateTeammatesBody` / `ValidateTeammatesResponse` 改為 `@deprecated` 別名（`TeammatePreviewDTO` 轉為 `SharedCharacterPreviewDTO` 的 type alias），下次 major 一併移除。

  caller 用例命名（如 `CampaignRecordDTO.teammates` 欄位、`maxTeammatesPerCampaignRecord` 上限）保留不動。

## 9.9.0

### Minor Changes

- f9687bf: 新增 `CHARACTER_TEXT_LIMITS.HUGE = 5000`，作為比 `LONG (2000)` 更高的超長文字欄位通用層級。

## 9.8.0

### Minor Changes

- e32bf72: refactor(types): `TeammatePreviewDTO.shareLink`（完整 URL）改為 `shareId`（chs\_ token），與其餘 share 介面一致；分享連結由前端依 shareId 自組。

## 9.7.0

### Minor Changes

- 797cfd9: feat(types): 戰役紀錄 teammates 由純人名升級為 cross-user 角色卡連結。`CampaignRecordDTO.teammates` 讀取形改為 `TeammatePreviewDTO[]`（含 available 旗標與 shareLink，失效者欄位為 null）；`CampaignRecordCreateBody`/`CampaignRecordUpdateBody` 的 teammates 寫入形為 shareId 陣列。新增 `TeammatePreviewDTO`、`ValidateTeammatesBody`、`ValidateTeammatesResponse` 供 POST /share/characters/validate-teammates 使用。

## 9.6.0

### Minor Changes

- c2bccc5: feat(types): validation-limits 新增 TRASH_RETENTION_DAYS 與 RESTORE_COOLDOWN_DAYS 兩個常數（皆為 7），供 frontend 顯示 GC 倒數與 backend 強制再次軟刪除冷卻共用

## 9.5.0

### Minor Changes

- 09b4964: feat(types): CharacterDTO 與 CharacterSummaryDTO 新增 deletedAt 與 restoredAt，支援 character soft-delete restore 流程

## 9.4.1

### Patch Changes

- e3150d1: Relax `computeAttunedLimit` parameter type from `CharacterDTO` to
  `SharedCharacterProfileDTO`.

  The rule currently depends only on SRD-baseline constants and does not
  read any field from the character. Any future formula that grows to
  depend on character data would consume fields present in the shared
  profile (classes, features, abilities…), so the broader type was over-
  restrictive for both the present and the foreseeable expansion.

  This is a strictly broadening signature change: existing callers passing
  a full `CharacterDTO` continue to compile (structural subtype), and
  read-only consumers that only have the public projection — e.g. the
  frontend share page — can now call the rule directly without an unsafe
  cast.

## 9.4.0

### Minor Changes

- 12260d4: `CharacterSummaryDTO` 新增 `shareable` / `shareId`，對齊 `CharacterDTO` 的分享欄位語意。

## 9.3.0

### Minor Changes

- 69c2e71: `CHARACTER_TEXT_LIMITS` 新增 `ITEM`（800）層；item 文字欄位改用此層，feature 仍走 `MEDIUM`（500）。

## 9.2.0

### Minor Changes

- 027355a: Add `maxNicknameLength` (10) to `ValidationLimits` / `VALIDATION_LIMITS`.

### Patch Changes

- 7230b9d: Mark `UserAvatarUpdateDTO` as `@deprecated` (JSDoc only; shape unchanged).

  The avatar contract is moving to resource-scoped atomic endpoints
  `POST/DELETE /users/me/avatar` and `POST/DELETE /characters/:id/avatar`,
  which upload and apply in one call and carry no optimistic-lock token.
  `UserAvatarUpdateDTO` and the `PATCH /users/me/avatar` route it backs are
  kept working for now and will be removed in the next `core` major together
  with narrowing `CharacterUpdateDTO.profile` to exclude `avatar`.

## 9.1.0

### Minor Changes

- 4b5e640: Add character share contract surface for the upcoming `PATCH /characters/:id/share` and public `GET /share/characters/:shareId` endpoints.

  **Additions**
  - `CharacterDTO.shareable: boolean` — owner toggle exposing the character through the public share endpoint.
  - `CharacterDTO.shareId: string` — opaque identifier in the public share URL with the form `chs_<22 URL-safe base64 chars>`; generated at character creation, not rotated in v1.
  - `SharedCharacterProfileDTO` — fail-closed `Pick` projection of `CharacterDTO` for the public read. Excludes `id`, `shareable`, `shareId`, `createdAt`, and `updatedAt` (the latter is the owner-side optimistic-lock token).
  - `SharedInventoryItemDTO` / `SharedSpellEntryDTO` — fail-closed `Pick` projections for sub-resources, excluding internal `id`, `createdAt`, and `updatedAt` for the same reason.
  - `SharedCharacterDTO` — aggregate response shape: `{ character, inventory, currency, spells, ownerDisplayName }`, where `currency` reuses `CurrencyAmount` (no `updatedAt`). Excludes combat-state and campaign records by design.

  Adding a new owner-only field to `CharacterDTO` / `InventoryItemDTO` / `SpellEntryDTO` keeps it out of the public surface by default; opting in requires explicitly listing it in the corresponding `Shared*DTO` and consumer schemas.

## 9.0.0

### Major Changes

- 848d865: Move `applyMoneyToCurrency` from per-request campaign record body to user preference, and drop two deprecated contracts.

  **Breaking changes**
  - `CampaignRecordCreateBody.applyMoneyToCurrency` removed. The decision to credit `moneyEarning` to character currency is now controlled by `UserPreference.applyMoneyToCurrency` on the authed user, read server-side at insert time.
  - `CampaignRecordDTO.sortOrder` removed. Records have always been ordered by `createdAt` at the MVP level; consumers must use `createdAt` directly.
  - `OAUTH_ERROR_CODES`, `OAuthErrorCode`, and `isOAuthErrorCode` removed from `@rolling-dice-app/core`. OAuth redirect error handling now lives in the backend; the frontend treats the `?error=` query as an opaque log value behind a generic message.

  **Additions**
  - `UserPreference.applyMoneyToCurrency?: boolean` — optional so existing persisted preference rows without the key remain valid; consumers should treat a missing value as `true`.

## 8.3.0

### Minor Changes

- be616e6: `CampaignRecordDTO.sortOrder` 標註 `@deprecated`，下個 major 版本移除；MVP 排序持續以 `createdAt` 為準，consumer 請改用 `createdAt`。

## 8.2.0

### Minor Changes

- e60e298: Add spell-slot calculation rules: getSuggestedRegularSpellSlots, getSuggestedPactSlots, mergeSlots, computeSpellSlotMax. Migrated from frontend helpers ahead of backend wiring used <= max validation.

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

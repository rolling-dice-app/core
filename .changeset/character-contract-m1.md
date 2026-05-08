---
'@rolling-dice-app/core': minor
---

新增 character contract 項目，支援 backend M1 endpoints（list / detail /
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

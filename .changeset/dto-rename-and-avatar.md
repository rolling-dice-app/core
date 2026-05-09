---
'@rolling-dice-app/core': major
---

統一 HTTP top-level shape 的 DTO 後綴命名，並把 avatar 移入建立角色 payload。

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

**Consumer migration**

- 全部 import 名字置換上述 5 個 type
- backend POST `/characters` 加 `input.avatar ?? null` fallback
- frontend create form 若已支援 avatar 上傳，可將值放進 create payload

---
'@rolling-dice-app/core': patch
---

Internal: 將 `src/types/character/index.ts` 還原為純 barrel。先前內嵌的型別搬到：

- `capabilities.ts` — `CharacterCapabilities`
- `character.ts` — `CharacterDTO`、`CharacterCreateDTO`、`CharacterUpdateDTO`、`CharacterSummaryDTO`

Public surface 不變（透過 root barrel 取用的所有 named export 保留）；僅檔案組織調整。

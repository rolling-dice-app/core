---
'@rolling-dice-app/core': minor
---

feat(character): 新增 `CharacterUpdateDTO`，PATCH 角色 endpoint 共用契約。以 section 為粒度（`profile` / `classes` / `stats` / `capabilities` / `inventory`，各為 `Partial<...>`）局部更新，並要求 client 帶上 `updatedAt` 作為樂觀鎖 token。

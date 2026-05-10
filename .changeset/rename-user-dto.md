---
'@rolling-dice-app/core': major
---

refactor(types)!: `UserDTO` 改名為 `User`，與既有 sub-shape 命名規則對齊。

按 `src/types/index.ts` 規則：top-level HTTP request/response 才掛 `DTO` 後綴；`User` 在現有 surface（`MeResponseDTO.user`）是 sub-shape，不該帶 DTO。

Frontend / backend 須同步調整 import：`UserDTO` → `User`。若未來新增以 user 為 top-level 回應的 endpoint（如 `GET /users/:id`），命名仍應走 `User` 不另立 `UserDTO`，避免 sub-shape / response-shape 雙生。

---
'@rolling-dice-app/core': major
---

擴充 `User` 與新增 user partial-update DTO / 偏好設定型別。

- BREAKING: `User` 新增必填 `preference: UserPreference` 與 `updatedAt: string`；所有 producer 必須同時供應。
- Add `UserPreference` sub-shape：`characterListLayout: 'grid' | 'list'`。
- Add `UserProfileUpdateDTO`（PATCH profile / preference；含 `updatedAt` 樂觀鎖）。
- Add `UserAvatarUpdateDTO`（更新或清除 avatar；`avatarUrl: string | null`，含 `updatedAt` 樂觀鎖）。

---
'@rolling-dice-app/core': patch
---

Mark `UserAvatarUpdateDTO` as `@deprecated` (JSDoc only; shape unchanged).

The avatar contract is moving to resource-scoped atomic endpoints
`POST/DELETE /users/me/avatar` and `POST/DELETE /characters/:id/avatar`,
which upload and apply in one call and carry no optimistic-lock token.
`UserAvatarUpdateDTO` and the `PATCH /users/me/avatar` route it backs are
kept working for now and will be removed in the next `core` major together
with narrowing `CharacterUpdateDTO.profile` to exclude `avatar`.

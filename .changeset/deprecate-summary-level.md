---
'@rolling-dice-app/core': patch
---

Deprecate `CharacterSummaryDTO.level`. Clients should derive the total level from `classes`; the field will be removed in the next major. Doc-only change — no type or runtime impact.

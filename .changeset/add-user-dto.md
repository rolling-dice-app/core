---
'@rolling-dice-app/core': minor
---

Add `UserDTO` — the shared public user contract consumed directly by both
frontend and backend (auth/profile responses, character ownership, …).

Fields: `id`, `email`, `displayName`, `avatarUrl: string | null`,
`createdAt` (ISO 8601 string).

Also pin the `DTO` suffix naming convention via a TODO in
`src/types/index.ts`: only top-level HTTP request/response shapes get the
suffix; sub-shapes (`AbilityScoreEntry`, `ArmorClassConfig`, `SpellLevel`, …)
do not. Existing `Character` / `CombatState` are left unrenamed for now and
will be migrated when those areas next change, to avoid a rename-only major
release.

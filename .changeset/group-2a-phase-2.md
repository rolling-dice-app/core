---
'@rolling-dice-app/core': major
---

Group 2A — Phase 2 major release (breaking):

- **U1-C5**: `SUBCLASS_KEYS` entry `'Juggernaut'` renamed to `'juggernaut'` for casing consistency with all other subclass keys. `SubclassKey` union narrows accordingly. Frontend select option labels and i18n keys must be updated to the lowercase value; backend storage requires no migration (prod scan confirmed `count = 0` on 2026-05-28).
- **U5-C1**: Add `CombatResetBody` (shared by short-rest / long-rest / reset endpoints; all three are replace-state operations of varying scope) requiring `expectedUpdatedAt: string`. Backend rest / reset endpoints now consume an optimistic-lock token instead of trusting frontend single-writer enforcement; concurrent PATCH /combat-state vs rest collisions will return `STALE_COMBAT_STATE_VERSION` 409 on the loser.
- **Removed deprecated `VALIDATION_LIMITS` fields** (originally `@deprecated` since 9.13.0): `maxCampaignRecordsPerCharacter` and `maxCampaignRecordContentLength`. The campaign-record content limit canonicalised on `CHARACTER_TEXT_LIMITS.HUGE` (5000); per-character record count is governed solely by `PlanLimits.maxCampaignRecordsPerCharacter`. `core/src/types/character/campaign-record.ts` JSDoc updated to cite the new source.

Coordinated rollout:

- Backend bumps `@rolling-dice-app/core` and accepts the new rest/reset request bodies (Group 2B).
- Frontend submits `expectedUpdatedAt` from the current combat-state snapshot when invoking rest / reset, adopts `'juggernaut'` in its subclass dropdown, and removes the residual `VALIDATION_LIMITS.maxCampaignRecordsPerCharacter` fallback in `CampaignsTab.vue` (only remaining consumer of the removed field).

---
'@rolling-dice-app/core': minor
---

Spell slots / errors / docs minor:

- Fix subclass caster override leaking across classes — `SUBCLASS_CASTER_OVERRIDE` now keyed by `(classKey, subclass)` so `monk + eldritchKnight` no longer awards third-caster slots; `fighter + eldritchKnight` and `rogue + arcaneTrickster` continue to work.
- Add single-class spell-slot lookup for full / floor-half / round-up-half casters (bard, cleric, druid, sorcerer, wizard, paladin, ranger, artificer). Multiclass effective-level path unchanged for mixed casters.
- Re-classify artificer as round-up half-caster (Tasha errata): multiclass formula uses `ceil(level / 2)` instead of `ceil(level / 3)`.
- Add `CHARACTER_NOT_FOUND` and `EMPTY_PATCH` API error codes.
- Mark `maxCampaignRecordsPerCharacter` and `maxCampaignRecordContentLength` as `@deprecated` (removal scheduled for next major).
- Rewrite `attunement.ts` and `CombatStateUpdateDTO` JSDoc to reduce ambiguity; attunement comment now points at the "Catalogue of permissive caps" section in `core/CLAUDE.md`.
- Land Vitest infra (devDep + `test` script + `vitest.config.ts`) alongside the first `rules/` behavioural change, per `core/CLAUDE.md`.

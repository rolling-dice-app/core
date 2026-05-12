---
"@rolling-dice-app/core": major
---

M3 character sub-resource type refactor — split spells / inventory items / currency from `CharacterDTO` into dedicated sub-resource wire shapes.

Breaking changes:

- Remove `SpellEntry`, `InventoryItem`, `CharacterCurrency`, `CharacterInventory` interfaces.
- Add `SpellEntryDTO` + `SpellEntryCreateBody` + `SpellEntryUpdateBody`; entry id is `id`, catalog FK is `spellId` (old `SpellEntry.id` was ambiguous between entry PK and catalog FK).
- Add `InventoryItemDTO` + `InventoryItemCreateBody` (omits `isAttuned`; server enforces `false`) + `InventoryItemUpdateBody`.
- Add `CharacterCurrencyDTO` + `CharacterCurrencyUpdateBody` (lives in new `src/types/character/currency.ts`).
- `CharacterDTO` no longer extends `CharacterInventory`; `CharacterCapabilities` no longer carries `spells`; `CharacterUpdateDTO` removes `inventory` and `capabilities.spells` partial keys.
- All sub-resource shapes carry their own `createdAt` / `updatedAt`; PATCH uses entry-level `updatedAt` as the optimistic-lock token.
- Add `SpellRecord = Omit<SpellDTO, 'id'>` for backend `spells.data` JSONB column typing; wire `SpellDTO` keeps `id` at the top level.
- Add `rules/attunement.ts` with `BASE_ATTUNED_SLOT = 3`, `EXTRA_ATTUNED_SLOT = 3`, and `computeAttunedLimit(character)` stub returning their sum (class / feat bonuses land in a follow-up; the base / extra split reserves headroom for future expansion).
- Remove deprecated exports flagged for the next major: `VALIDATION_LIMITS.maxCampaignRecordContentLength`, `VALIDATION_LIMITS.maxItemDescriptionLength`, `VALIDATION_LIMITS.maxFeatureDescriptionLength`, top-level `COMMON_STRING_LENGTH_LIMIT`, `LONG_STRING_LENGTH_LIMIT`, `COMMON_INT_MAX_LIMIT`. Migrate to `CHARACTER_TEXT_LIMITS.*` / `CHARACTER_INT_LIMITS.GENERAL_INT_MAX`.
- `defaults/character.ts`: remove `createDefaultInventory` factory; `buildCharacterCreateDefaults` no longer populates `spells` / `inventory`. `DEFAULT_CURRENCY` retained (used by backend for the `character_currency` sibling row at character creation).

Consumers (frontend + backend) must migrate inventory / currency / spell entry reads and writes to dedicated sub-endpoints; aggregate `CharacterDTO` no longer carries them.

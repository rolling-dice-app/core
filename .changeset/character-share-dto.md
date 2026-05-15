---
'@rolling-dice-app/core': minor
---

Add character share contract surface for the upcoming `PATCH /characters/:id/share` and public `GET /share/characters/:shareId` endpoints.

**Additions**

- `CharacterDTO.shareable: boolean` — owner toggle exposing the character through the public share endpoint.
- `CharacterDTO.shareId: string` — opaque identifier in the public share URL with the form `chs_<22 URL-safe base64 chars>`; generated at character creation, not rotated in v1.
- `SharedCharacterProfileDTO` — fail-closed `Pick` projection of `CharacterDTO` for the public read. Excludes `id`, `shareable`, `shareId`, `createdAt`, and `updatedAt` (the latter is the owner-side optimistic-lock token).
- `SharedInventoryItemDTO` / `SharedSpellEntryDTO` — fail-closed `Pick` projections for sub-resources, excluding internal `id`, `createdAt`, and `updatedAt` for the same reason.
- `SharedCharacterDTO` — aggregate response shape: `{ character, inventory, currency, spells, ownerDisplayName }`, where `currency` reuses `CurrencyAmount` (no `updatedAt`). Excludes combat-state and campaign records by design.

Adding a new owner-only field to `CharacterDTO` / `InventoryItemDTO` / `SpellEntryDTO` keeps it out of the public surface by default; opting in requires explicitly listing it in the corresponding `Shared*DTO` and consumer schemas.

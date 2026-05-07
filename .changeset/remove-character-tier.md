---
'@rolling-dice-app/core': major
---

Remove `CharacterTier` (`'common' | 'elite' | 'master' | 'legendary'`).

This was a UI-flavor classification — gacha-style rarity grading rather
than a SRD concept (DND 5e's "tier of play" uses 1/2/3/4 with no such
labels). No `Character` field referenced it; the value was always derived
from level by a frontend helper (`getCharacterTier(level)`).

Such product-specific UI grading belongs in the consumer that displays
it. Both the type and any `level → tier` mapping should live in the
frontend.

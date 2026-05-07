---
'@rolling-dice-app/core': major
---

Rename `profession` → `class` to align with DND 5e official terminology.

Renamed types: `ProfessionKey` → `ClassKey`,
`SubprofessionKey` → `SubclassKey`, `ProfessionData` → `ClassData`,
`ProfessionEntry` → `ClassEntry`, `CharacterProfessions` → `CharacterClasses`.

Renamed properties: `CharacterClasses.professions` → `classes`,
`ClassEntry.profession` → `classKey` (avoids TS reserved word `class`),
`ClassEntry.subprofession` → `subclass`.

String literal members (`'fighter'`, `'wizard'`, `'champion'`,
`'wildMagicSorcerer'`, …) are unchanged.

Migration: rename imports / property accesses 1:1. Frontend and backend
should upgrade in lockstep.

---
'@rolling-dice-app/core': minor
---

Spell type spec adjustment: add `engName: string`, `source: SourceKey`,
`classes: ProfessionKey[]` to `SpellDto`. New `SourceKey` union enumerates
the 11 sourcebook codes currently present in shipped spell data
(PHB / XGE / TCE / FTD / EGW / GGR / SCC / TDCSR / AAG / AI / BMT).

Additive change for consumers — existing `SpellDto` consumers continue to
compile, but constructing a `SpellDto` literal now requires the three new
fields.

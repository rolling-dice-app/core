---
'@rolling-dice-app/core': patch
---

Extract `DieType` and `DamageDieType` from `dnd/misc.ts` into a dedicated
`dnd/dice.ts`. Dice are a core DND mechanic, not a "miscellaneous" concept,
and deserve their own file alongside `ability-key`, `class`, `skill`, etc.

Internal-only refactor. Both types continue to be re-exported from the
root barrel (`@rolling-dice-app/core`), so consumer imports do not change.

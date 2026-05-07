---
'@rolling-dice-app/core': patch
---

Split the catch-all `dnd/misc.ts` into one file per concept, matching
the existing `dnd/` convention (`ability-key.ts`, `dice.ts`, `skill.ts`,
etc.):

- `dnd/size.ts` — `SizeKey`
- `dnd/gender.ts` — `GenderKey`
- `dnd/armor-type.ts` — `ArmorType`
- `dnd/weapon-type.ts` — `WeaponType`
- `dnd/damage-type.ts` — `DamageTypeKey`

`dnd/misc.ts` is removed. Public API is unchanged — the root barrel
continues to re-export every type, so consumer imports
(`import type { SizeKey } from '@rolling-dice-app/core'`) work as before.

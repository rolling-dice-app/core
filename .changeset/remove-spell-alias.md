---
'@rolling-dice-app/core': major
---

Remove the `Spell` type alias. `SpellDto` is now the single name for the
spell contract.

The two names had identical shapes but unclear semantic distinction
(the JSDoc claimed `Spell` was "normalized for UI" but no normalization
existed). The DTO suffix matches the convention pinned in `2.0.0`'s
`UserDTO` introduction.

Migration: replace `import type { Spell } from '@rolling-dice-app/core'`
with `import type { SpellDto }` and rename references accordingly.

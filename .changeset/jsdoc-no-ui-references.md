---
'@rolling-dice-app/core': patch
---

Remove JSDoc comments that prescribed UI behavior or referenced
frontend file paths:

- `combat.ts` `CombatHp.current` no longer suggests "UI 應顯示
  effectiveMaxHp" — display fallback is the consumer's choice.
- `spell.ts` `SpellSchool` no longer mentions "中文僅為顯示 label"
  (no labels live in this file).
- `spell.ts` `SpellDto` no longer references `public/json/spells.json`
  (a frontend asset path that should not appear in `core`).

Pure documentation cleanup; no shape changes.

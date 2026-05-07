---
'@rolling-dice-app/core': major
---

Remove the `ClassData` interface. The three fields are split by ownership:

- `label` (Chinese display string) — leaves `core` entirely; how to
  store / source class labels (hardcoded mapping, i18n, etc.) is the
  consumer's concern.
- `hitDie` and `savingThrowProficiencies` — kept as SRD facts but
  unbundled into two parallel runtime constants:
  - `CLASS_HIT_DICE: Readonly<Record<ClassKey, DieType>>`
  - `CLASS_SAVING_THROW_PROFICIENCIES: Readonly<Record<ClassKey, readonly AbilityKey[]>>`

Rationale: the original `ClassData` had cross-concerns — `label` is UI,
the other two are SRD rule facts. The two SRD fields also have no
shared consumer (different future `derive*` rules will use one or the
other), so bundling them was artificial cohesion. Splitting now also
avoids the pattern becoming a god-object as more SRD per-class data
(spellcaster type, primary ability, etc.) lands.

Migration: replace `CLASS_CONFIG[key].hitDie` →
`CLASS_HIT_DICE[key]` and `CLASS_CONFIG[key].savingThrowProficiencies` →
`CLASS_SAVING_THROW_PROFICIENCIES[key]`. Build any local label table in
the consumer.

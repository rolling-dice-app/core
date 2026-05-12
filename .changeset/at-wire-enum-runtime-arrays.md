---
"@rolling-dice-app/core": minor
---

Promote at-wire literal unions to `as const` runtime arrays so zod / select-option consumers can iterate without redeclaring values (which silently over-narrows when core later adds a variant).

Added (type aliases unchanged, fully backwards-compatible):

- `DAMAGE_TYPE_KEYS` (13 values) → `DamageTypeKey`
- `ARMOR_TYPES` (`['light', 'medium', 'heavy', 'none']`) → `ArmorType`
- `DAMAGE_DIE_TYPES` (`[4, 6, 8, 10, 12]`) → `DamageDieType`
- `SKILL_PROFICIENCY_VALUES` (`['proficient', 'expertise']`) — wire subset of `ProficiencyLevel` (`'none'` excluded; `SkillProficiencies` now derives its value type from this const)
- `SPELL_SCHOOLS` (8 values) → `SpellSchool`
- `SPELL_SOURCES` (11 values) → `SourceKey`
- `SPELL_LEVELS` (`[1, 2, 3, 4, 5, 6, 7, 8, 9]`) → `SpellLevel`
- `ITEM_TYPES` (4 values) → `ItemType`
- `INVENTORY_LOCATIONS` (`['backpack', 'dimensionalBag']`) → `InventoryLocation`
- `FEATURE_SOURCES` (5 values) → `FeatureSource`
- `FEATURE_USAGE_RECOVERIES` (`['shortRest', 'longRest', 'manual']`) → `FeatureUsageRecovery`
- `CURRENCY_KEYS` (`['cp', 'sp', 'gp', 'pp']`) + new `CurrencyKey` type alias

`DieType` (full die-face set), `SizeKey`, `WeaponType`, `ProficiencyLevel` (the `'none'`-inclusive form) remain TS-only — none of them currently sit at a wire boundary that needs runtime enumeration.

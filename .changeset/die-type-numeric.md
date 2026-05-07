---
'@rolling-dice-app/core': major
---

`DieType` and `DamageDieType` now use numeric face counts instead of
`'d4' | 'd6' | ...` string literals.

```ts
// before
type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
type DamageDieType = Extract<DieType, 'd4' | 'd6' | 'd8' | 'd10' | 'd12'>

// after
type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100
type DamageDieType = Extract<DieType, 4 | 6 | 8 | 10 | 12>
```

Rationale: the `'d'` prefix is a written / display notation, not the die's
identity. A die is identified by its face count; rendering as `"d10"` /
`"10-sided"` / icon is a presentation choice that belongs to the consumer.

Migration: persisted / passed values change from `'d6'` to `6`. Consumers
that need to render the `"d"` prefix can format inline (`` `d${value}` ``).

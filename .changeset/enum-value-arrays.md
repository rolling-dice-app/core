---
'@rolling-dice-app/core': minor
---

新增 6 個 enum value array 並改由陣列推導對應 union type，讓 backend 能直接餵 `z.enum([...])` 做 runtime 驗證、避免 source-of-truth 分裂：

- `ABILITY_KEYS` → `AbilityKey`
- `ALIGNMENT_KEYS` → `AlignmentKey`
- `GENDER_KEYS` → `GenderKey`
- `CLASS_KEYS` → `ClassKey`
- `SUBCLASS_KEYS` → `SubclassKey`
- `SKILL_KEYS` → `SkillKey`

純 additive 變更，type 名稱與成員集合不變，既有 import 不受影響。

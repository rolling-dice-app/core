---
'@rolling-dice-app/core': minor
---

新增 SIZE_KEYS 常數陣列（有序 SizeKey）

`SizeKey` 原本僅為字面聯集型別，缺少對應的有序 key 陣列（其他枚舉如 `ABILITY_KEYS` / `ALIGNMENT_KEYS` 皆有）。新增 `SIZE_KEYS` 讓消費端可迭代體型（如怪物模板的體型下拉），`SizeKey` 改由 `(typeof SIZE_KEYS)[number]` 衍生、型別等價不變。

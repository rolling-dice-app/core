---
'@rolling-dice-app/core': minor
---

`SpellEntry` 新增 optional `sourceClass?: ClassKey` 欄位，用於多職業情境
下標記法術來源職業（牧師習得的法術 vs 法師習得的法術）。

當前以 optional 形式預留，不強制填寫；後續釐清「法術來源歸屬」設計與
prepare limit 正確計算規則後，改為必填並補既有資料 migration。

新增為 non-breaking minor change，既有持久化資料不須立即更新。

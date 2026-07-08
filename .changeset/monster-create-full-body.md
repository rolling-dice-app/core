---
'@rolling-dice-app/core': minor
---

MonsterTemplateCreateBody 放寬為 name 必填 + 其餘業務欄位 optional

原本 create 只收 `{ name }`，前端完整表單建立需拆成 POST + PATCH 兩段請求，且 PATCH 失敗會留下只有名字的半成品。放寬後建立可一次帶完整欄位，缺漏欄位仍由 `buildMonsterTemplateCreateDefaults` 補（quick-create 能力不變）。為 additive 變更，舊 `{ name }` payload 仍合法。

同時修正 `buildMonsterTemplateCreateDefaults` 回傳型別：原以 `keyof MonsterTemplateCreateBody` 做 Omit，CreateBody 加入 optional 欄位後會把所有業務欄位剔除導致型別塌縮，改為顯式排除 `name` 與 server-owned 欄位。

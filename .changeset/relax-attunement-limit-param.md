---
'@rolling-dice-app/core': patch
---

Relax `computeAttunedLimit` parameter type from `CharacterDTO` to
`SharedCharacterProfileDTO`.

The rule currently depends only on SRD-baseline constants and does not
read any field from the character. Any future formula that grows to
depend on character data would consume fields present in the shared
profile (classes, features, abilities…), so the broader type was over-
restrictive for both the present and the foreseeable expansion.

This is a strictly broadening signature change: existing callers passing
a full `CharacterDTO` continue to compile (structural subtype), and
read-only consumers that only have the public projection — e.g. the
frontend share page — can now call the rule directly without an unsafe
cast.
